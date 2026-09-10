import React, { useState } from 'react';
import { X, FileSpreadsheet, ExternalLink, Download, Check, AlertCircle, Loader2, Copy } from 'lucide-react';
import { TarotCard } from '../types';
import { exportToGoogleSheets, ExportProgress, generateCsv, generateMarkdown } from '../services/googleSheetsService';

interface GoogleSheetsExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: TarotCard[];
}

export const GoogleSheetsExportModal: React.FC<GoogleSheetsExportModalProps> = ({
  isOpen,
  onClose,
  cards,
}) => {
  const [progress, setProgress] = useState<ExportProgress>({
    status: 'idle',
    message: '',
  });
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      await exportToGoogleSheets(cards, (p) => setProgress(p));
    } catch (err: any) {
      setProgress({
        status: 'error',
        message: 'Не удалось экспортировать в Google Таблицы',
        error: err.message || String(err),
      });
    }
  };

  const handleDownloadCsv = () => {
    const csvData = generateCsv(cards);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'slavic_tarot_major_arcana.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJson = () => {
    const jsonData = JSON.stringify(cards, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'slavic_tarot_major_arcana.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdown(cards);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-2xl border border-emerald-800/50 bg-[#121722] text-slate-100 shadow-2xl shadow-emerald-950/40 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-slate-800 bg-gradient-to-r from-emerald-950/60 to-slate-900 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-900/50 p-2 text-emerald-400 border border-emerald-700/50">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 font-serif-cormorant text-xl">
                Экспорт в Google Таблицы
              </h2>
              <p className="text-xs text-slate-400">
                Сохранение всех 22 арканов с полным символизмом
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-800 p-1.5 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm">
          <p className="text-slate-300 leading-relaxed">
            Таблица будет автоматически создана в вашем личном Google Диске через официальный API Google Sheets. Все 22 аркана будут отформатированы с закрепленной шапкой, цветовым кодированием и разбором символов по книге.
          </p>

          {/* Status Display */}
          {progress.status === 'idle' && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-400 space-y-2">
              <div className="font-semibold text-slate-300">Что входит в экспорт:</div>
              <ul className="list-disc pl-4 space-y-1">
                <li>22 Старших аркана с традиционными и славянскими именами</li>
                <li>Архэ, Архетип и точная формула книги (n+3, n+4, 7+2, атомарность)</li>
                <li>Славянские атрибуты, тотемы и обереги</li>
                <li>Цветовая палитра и сакральное обоснование из книги</li>
                <li>Практики проживания и вопросы для расклада</li>
                <li>Метафизический и философский анализ</li>
              </ul>
            </div>
          )}

          {(progress.status === 'authorizing' ||
            progress.status === 'creating' ||
            progress.status === 'populating') && (
            <div className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-4 flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-amber-400 shrink-0" />
              <div className="text-xs text-amber-200">
                <div className="font-semibold">Выполняется:</div>
                <div>{progress.message}</div>
              </div>
            </div>
          )}

          {progress.status === 'success' && (
            <div className="rounded-xl border border-emerald-800/60 bg-emerald-950/30 p-4 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <Check className="h-5 w-5" />
                <span>Таблица успешно создана на вашем Google Диске!</span>
              </div>
              <a
                href={progress.spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-emerald-600"
              >
                <span>Открыть созданную Google Таблицу</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}

          {progress.status === 'error' && (
            <div className="rounded-xl border border-rose-900/60 bg-rose-950/30 p-4 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold">
                <AlertCircle className="h-5 w-5" />
                <span>Ошибка экспорта в Google Sheets</span>
              </div>
              <p className="text-xs text-rose-200/90 leading-snug">
                {progress.error}
              </p>
              <p className="text-xs text-slate-400">
                Вы можете воспользоваться локальной выгрузкой в CSV или Markdown ниже:
              </p>
            </div>
          )}

          {/* Primary Action Button */}
          {progress.status !== 'success' && (
            <button
              id="btn-confirm-google-export"
              onClick={handleExport}
              disabled={
                progress.status === 'authorizing' ||
                progress.status === 'creating' ||
                progress.status === 'populating'
              }
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Создать Google Таблицу прямо сейчас</span>
            </button>
          )}

          {/* Alternative Formats */}
          <div className="border-t border-slate-800 pt-4 space-y-2">
            <div className="text-xs font-medium text-slate-400">Локальные форматы экспорта:</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleDownloadCsv}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-2 text-xs text-slate-200 hover:bg-slate-700 hover:text-white"
              >
                <Download className="h-3.5 w-3.5 text-slate-400" />
                <span>Файл CSV</span>
              </button>

              <button
                onClick={handleDownloadJson}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-2 text-xs text-slate-200 hover:bg-slate-700 hover:text-white"
              >
                <Download className="h-3.5 w-3.5 text-slate-400" />
                <span>JSON</span>
              </button>

              <button
                onClick={handleCopyMarkdown}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-2 text-xs text-slate-200 hover:bg-slate-700 hover:text-white"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
                <span>{copied ? 'Скопировано' : 'Markdown'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
