import React from 'react';
import { Table, FileSpreadsheet, Download, BookOpen, Sparkles, Copy, Check } from 'lucide-react';

interface HeaderProps {
  onOpenGoogleExport: () => void;
  onOpenBookModal: () => void;
  onDownloadCsv: () => void;
  onCopyMarkdown: () => void;
  copiedMd: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGoogleExport,
  onOpenBookModal,
  onDownloadCsv,
  onCopyMarkdown,
  copiedMd,
}) => {
  return (
    <header className="border-b border-amber-950/40 bg-gradient-to-b from-[#141824] to-[#0e1117] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-500">
              <Sparkles className="h-4 w-4" />
              <span>Старшие Арканы в Славянской Мифологии</span>
              <span className="inline-block rounded bg-amber-950/70 px-2 py-0.5 text-[10px] text-amber-300 border border-amber-800/40">
                22 Аркана
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-amber-100 sm:text-3xl font-serif-cormorant">
              Таблица Символизма Славянского Таро
            </h1>
            <p className="max-w-3xl text-sm text-slate-400">
              Символы, цвета, архэ и архетипы на основе книги{' '}
              <span className="text-amber-200/90 italic font-serif-cormorant text-base">
                «Загадочное Таро Уэйта. Глубинный смысл каждой карты»
              </span>{' '}
              (Т. Славович-Досаева, О. Сидоренко)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-open-book-modal"
              onClick={onOpenBookModal}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white"
              title="О концепции и методе книги"
            >
              <BookOpen className="h-4 w-4 text-amber-400" />
              <span>О структуре книги</span>
            </button>

            <button
              id="btn-copy-markdown"
              onClick={onCopyMarkdown}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white"
              title="Скопировать Markdown-таблицу"
            >
              {copiedMd ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-300">Скопировано!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-slate-400" />
                  <span>Markdown</span>
                </>
              )}
            </button>

            <button
              id="btn-download-csv"
              onClick={onDownloadCsv}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white"
              title="Скачать таблицу в формате CSV"
            >
              <Download className="h-4 w-4 text-slate-400" />
              <span>CSV</span>
            </button>

            <button
              id="btn-export-google-sheets"
              onClick={onOpenGoogleExport}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-600/70 bg-gradient-to-r from-emerald-800 to-teal-800 px-4 py-2 text-xs font-semibold text-emerald-100 shadow-md transition hover:from-emerald-700 hover:to-teal-700 hover:shadow-emerald-900/30"
              title="Экспорт полной таблицы в Google Sheets"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-300" />
              <span>Экспорт в Google Таблицы</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
