import React from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles, BookOpen, Compass, Shield, Palette, HelpCircle } from 'lucide-react';
import { TarotCard } from '../types';

interface CardDetailModalProps {
  card: TarotCard | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  onClose,
  onPrev,
  onNext,
}) => {
  if (!card) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl rounded-2xl border border-amber-900/40 bg-[#121622] text-slate-100 shadow-2xl shadow-black/80 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative border-b border-slate-800 bg-gradient-to-r from-[#171d2c] via-[#1a2133] to-[#141824] px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-cinzel text-xl font-bold text-amber-400">
                  {card.numberRoman}
                </span>
                <span className="text-slate-400 text-sm">•</span>
                <span className="text-xs uppercase tracking-widest text-slate-400">
                  {card.waiteName}
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    card.lessonType === 'earth'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/40'
                      : 'bg-indigo-950/80 text-indigo-300 border border-indigo-700/40'
                  }`}
                >
                  {card.lessonType === 'earth' ? '12 Земных уроков' : '8 Духовных уроков'}
                </span>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-amber-300 border border-slate-700">
                  {card.compositionFormula}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-amber-100 font-serif-cormorant">
                {card.slavicName}
              </h2>
              <p className="text-sm text-amber-300/80 italic">
                {card.slavicTitleSubtitle} — Мир {card.slavicRealm}
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-full bg-slate-800/80 p-2 text-slate-400 transition hover:bg-slate-700 hover:text-white"
              title="Закрыть"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="max-h-[75vh] overflow-y-auto px-6 py-6 space-y-6">
          {/* Quick summary cards: Arche, Archetype, Question */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-amber-900/30 bg-slate-900/60 p-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Архэ (Первооснова)</span>
              </div>
              <div className="mt-1 text-lg font-bold text-slate-100 font-serif-cormorant">
                {card.arche}
              </div>
              <div className="mt-1 text-xs text-slate-400">
                Фундаментальный принцип мироздания по книге
              </div>
            </div>

            <div className="rounded-xl border border-amber-900/30 bg-slate-900/60 p-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                <span>Архетип книги</span>
              </div>
              <div className="mt-1 text-lg font-bold text-slate-100 font-serif-cormorant">
                {card.archetype}
              </div>
              <div className="mt-1 text-xs text-slate-400">
                Роль в Путешествии Героя и структуре Таро
              </div>
            </div>

            <div className="rounded-xl border border-amber-900/30 bg-slate-900/60 p-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Вопрос Вопрошания</span>
              </div>
              <div className="mt-1 text-xs font-medium text-amber-200 italic leading-relaxed">
                «{card.question}»
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                Трансформационный вопрос для самоанализа
              </div>
            </div>
          </div>

          {/* Slavic Mythological Context & Lore */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Compass className="h-4 w-4" />
              <span>Славянский мифологический образ и соответствие</span>
            </h3>
            <p className="text-sm leading-relaxed text-slate-300">
              {card.slavicMythologicalContext}
            </p>
          </div>

          {/* Color Palette & Book Justification */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span>Цветовой символизм и колористика (по книге)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {card.colorPalette.map((color, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-900/80 p-3"
                >
                  <span
                    className="h-8 w-8 shrink-0 rounded-full border border-slate-700 shadow-md"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="text-xs space-y-0.5">
                    <div className="font-semibold text-slate-200">
                      {color.name} <span className="text-slate-400 font-normal">({color.role})</span>
                    </div>
                    <div className="text-slate-400 leading-snug">
                      {color.bookJustification}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slavic Symbols & Attributes */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Славянские атрибуты и их значение в карте</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {card.symbolsExplanation.map((sym, idx) => (
                <div key={idx} className="rounded-lg bg-slate-900/70 p-3 border border-slate-800/80">
                  <div className="font-medium text-amber-200 text-xs">
                    {sym.symbol}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 leading-snug">
                    {sym.meaning}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3 Levels from the Book */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>3 Уровня постижения аркана (по Славович-Досаевой и Сидоренко)</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1.5">
                <div className="font-semibold text-amber-300">
                  УРОВЕНЬ 1 — Метафизика аркана
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {card.metaphysics}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1.5">
                <div className="font-semibold text-amber-300">
                  УРОВЕНЬ 2 — Философия аркана
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {card.philosophy}
                </p>
              </div>

              <div className="rounded-xl border border-emerald-900/30 bg-emerald-950/20 p-4 space-y-1.5">
                <div className="font-semibold text-emerald-300">
                  УРОВЕНЬ 3 — Практика аркана в жизни
                </div>
                <p className="text-emerald-100/90 leading-relaxed">
                  {card.practice}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with Navigation */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-[#141824] px-6 py-4">
          <button
            onClick={onPrev}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Предыдущий аркан</span>
          </button>

          <span className="text-xs text-slate-400 font-mono">
            {card.id} / 21
          </span>

          <button
            onClick={onNext}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white"
          >
            <span>Следующий аркан</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
