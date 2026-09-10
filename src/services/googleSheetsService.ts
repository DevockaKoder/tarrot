import { TarotCard } from '../types';

export interface ExportProgress {
  status: 'idle' | 'authorizing' | 'creating' | 'populating' | 'success' | 'error';
  message: string;
  spreadsheetUrl?: string;
  spreadsheetId?: string;
  error?: string;
}

export const OAUTH_CLIENT_ID = "129763237104-4su31dfijgm1gipm72ht41cvb9ao3c99.apps.googleusercontent.com";
export const OAUTH_SCOPES = "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file";

declare global {
  interface Window {
    google?: any;
  }
}

/**
 * Request OAuth token using Google Identity Services (GSI) in the browser
 */
export function requestGoogleAccessToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.google?.accounts?.oauth2) {
      reject(new Error('Google Identity Services SDK не загружен. Проверьте интернет-соединение.'));
      return;
    }

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: OAUTH_CLIENT_ID,
        scope: OAUTH_SCOPES,
        callback: (response: any) => {
          if (response.error) {
            reject(new Error(response.error_description || response.error || 'Ошибка авторизации Google'));
            return;
          }
          if (response.access_token) {
            resolve(response.access_token);
          } else {
            reject(new Error('Токен доступа не был получен'));
          }
        },
        error_callback: (err: any) => {
          reject(new Error(err.message || 'Ошибка окна входа Google'));
        }
      });

      client.requestAccessToken({ prompt: '' });
    } catch (e: any) {
      reject(new Error(e.message || 'Не удалось запустить авторизацию Google'));
    }
  });
}

/**
 * Creates and formats a Google Spreadsheet with all 22 Slavic Tarot Major Arcana
 */
export async function exportToGoogleSheets(
  cards: TarotCard[],
  onProgress?: (progress: ExportProgress) => void
): Promise<{ url: string; id: string }> {
  onProgress?.({ status: 'authorizing', message: 'Авторизация в Google Аккаунте...' });

  const accessToken = await requestGoogleAccessToken();

  onProgress?.({ status: 'creating', message: 'Создание таблицы в Google Таблицах...' });

  const dateStr = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const title = `Символизм Славянского Таро (Старшие Арканы) - ${dateStr}`;

  // 1. Create spreadsheet with initial metadata
  const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title,
        locale: 'ru_RU'
      },
      sheets: [
        {
          properties: {
            title: 'Старшие Арканы',
            gridProperties: {
              frozenRowCount: 1,
              frozenColumnCount: 2
            }
          }
        }
      ]
    })
  });

  if (!createResponse.ok) {
    const errorData = await createResponse.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Ошибка создания таблицы: ${createResponse.statusText}`);
  }

  const spreadsheetData = await createResponse.json();
  const spreadsheetId = spreadsheetData.spreadsheetId;
  const sheetId = spreadsheetData.sheets[0].properties.sheetId;
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  onProgress?.({ status: 'populating', message: 'Заполнение 22 карт и форматирование стилей...', spreadsheetUrl, spreadsheetId });

  // Headers
  const headers = [
    '№',
    'Аркан Таро (Уэйт)',
    'Славянский образ',
    'Эпитет / Роль',
    'Архэ (по книге)',
    'Архетип',
    'Тип урока',
    'Формула книги',
    'Мир',
    'Славянские символы и атрибуты',
    'Цветовая палитра и сакральный смысл',
    'Вопрос вопрошания (из книги)',
    'Практика аркана (по книге)',
    'Метафизика аркана',
    'Философия аркана',
    'Мифологический контекст'
  ];

  // Convert cards to rows
  const rows: any[][] = [headers];

  for (const card of cards) {
    const symbolsStr = card.slavicSymbols.join('; ');
    const colorsStr = card.colorPalette.map(c => `${c.name} (${c.role}): ${c.bookJustification}`).join(' | ');
    const lessonLabel = card.lessonType === 'earth' ? 'Земной урок' : 'Духовный урок';

    rows.push([
      card.numberRoman,
      card.waiteName,
      card.slavicName,
      card.slavicTitleSubtitle,
      card.arche,
      card.archetype,
      lessonLabel,
      card.compositionFormula,
      card.slavicRealm,
      symbolsStr,
      colorsStr,
      card.question,
      card.practice,
      card.metaphysics,
      card.philosophy,
      card.slavicMythologicalContext
    ]);
  }

  // Write values to sheet
  const updateValuesResponse = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Старшие Арканы!A1:P23?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: rows
      })
    }
  );

  if (!updateValuesResponse.ok) {
    const err = await updateValuesResponse.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Ошибка заполнения данных таблицы');
  }

  // Now apply batch styling: bold headers, colors, auto column widths, borders
  const batchUpdateRequest = {
    requests: [
      // Header formatting
      {
        repeatCell: {
          range: {
            sheetId,
            startRowIndex: 0,
            endRowIndex: 1
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 0.12, green: 0.22, blue: 0.18 }, // Deep forest emerald
              textFormat: {
                foregroundColor: { red: 0.98, green: 0.95, blue: 0.85 },
                bold: true,
                fontSize: 11
              },
              horizontalAlignment: 'CENTER',
              verticalAlignment: 'MIDDLE',
              wrapStrategy: 'WRAP'
            }
          },
          fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)'
        }
      },
      // Alternating row styling & alignment
      {
        repeatCell: {
          range: {
            sheetId,
            startRowIndex: 1,
            endRowIndex: 23,
            startColumnIndex: 0,
            endColumnIndex: 1
          },
          cell: {
            userEnteredFormat: {
              horizontalAlignment: 'CENTER',
              textFormat: { bold: true }
            }
          },
          fields: 'userEnteredFormat(horizontalAlignment,textFormat)'
        }
      },
      // Auto-resize columns dimensions
      {
        autoResizeDimensions: {
          dimensions: {
            sheetId,
            dimension: 'COLUMNS',
            startIndex: 0,
            endIndex: 9
          }
        }
      },
      // Set comfortable width for description columns
      {
        updateDimensionProperties: {
          range: {
            sheetId,
            dimension: 'COLUMNS',
            startIndex: 9,
            endIndex: 16
          },
          properties: {
            pixelSize: 280
          },
          fields: 'pixelSize'
        }
      }
    ]
  };

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(batchUpdateRequest)
  }).catch(e => console.warn('Non-fatal batch update error:', e));

  onProgress?.({
    status: 'success',
    message: 'Таблица успешно создана в Google Sheets!',
    spreadsheetUrl,
    spreadsheetId
  });

  return { url: spreadsheetUrl, id: spreadsheetId };
}

/**
 * Generate CSV representation with UTF-8 BOM for Excel/Sheets compatibility
 */
export function generateCsv(cards: TarotCard[]): string {
  const headers = [
    'Номер',
    'Карта Таро (Уэйт)',
    'Славянский образ',
    'Роль',
    'Архэ',
    'Архетип',
    'Тип урока',
    'Формула',
    'Мир',
    'Славянские символы',
    'Цветовая палитра',
    'Вопрос вопрошания',
    'Практика',
    'Метафизика',
    'Философия',
    'Мифологический контекст'
  ];

  const escapeCsv = (str: string) => `"${str.replace(/"/g, '""')}"`;

  const rows = cards.map(c => [
    escapeCsv(c.numberRoman),
    escapeCsv(c.waiteName),
    escapeCsv(c.slavicName),
    escapeCsv(c.slavicTitleSubtitle),
    escapeCsv(c.arche),
    escapeCsv(c.archetype),
    escapeCsv(c.lessonType === 'earth' ? 'Земной урок' : 'Духовный урок'),
    escapeCsv(c.compositionFormula),
    escapeCsv(c.slavicRealm),
    escapeCsv(c.slavicSymbols.join('; ')),
    escapeCsv(c.colorPalette.map(p => `${p.name}: ${p.bookJustification}`).join(' | ')),
    escapeCsv(c.question),
    escapeCsv(c.practice),
    escapeCsv(c.metaphysics),
    escapeCsv(c.philosophy),
    escapeCsv(c.slavicMythologicalContext)
  ]);

  const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows.map(r => r.join(','))].join('\n');
  return csvContent;
}

/**
 * Generate Markdown Table representation
 */
export function generateMarkdown(cards: TarotCard[]): string {
  let md = '# Таблица символизма Старших арканов (Славянское Таро)\n\n';
  md += '_На основе книги «Загадочное Таро Уэйта. Глубинный смысл каждой карты» (Т. Славович-Досаева, О. Сидоренко)_\n\n';
  md += '| № | Аркан Таро | Славянский образ | Архэ | Архетип | Урок | Символы славянской мифологии | Цвета и смысл |\n';
  md += '|---|---|---|---|---|---|---|---|\n';

  for (const c of cards) {
    const syms = c.slavicSymbols.slice(0, 3).join(', ');
    const colors = c.colorPalette.map(p => p.name).join(', ');
    const lesson = c.lessonType === 'earth' ? 'Земной' : 'Духовный';
    md += `| ${c.numberRoman} | ${c.waiteName} | **${c.slavicName}** | ${c.arche} | ${c.archetype} | ${lesson} | ${syms} | ${colors} |\n`;
  }

  return md;
}
