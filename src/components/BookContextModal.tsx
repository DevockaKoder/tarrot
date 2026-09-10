import React from 'react';
import { X, BookOpen, Layers, Binary, Shield, Compass, Sparkles } from 'lucide-react';

interface BookContextModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookContextModal: React.FC<BookContextModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl rounded-2xl border border-amber-900/50 bg-[#121622] text-slate-100 shadow-2xl shadow-black/80 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-slate-800 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-900/40 p-2 text-amber-400 border border-amber-700/40">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-amber-100 font-serif-cormorant">
                О системе и методологии книги
              </h2>
              <p className="text-xs text-slate-400">
                Тереза Славович-Досаева, Олеся Сидоренко (АСТ, 2023)
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
        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* 3 levels */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-amber-300 text-sm">
              <Layers className="h-4 w-4" />
              <span>3 Уровня постижения каждого аркана</span>
            </div>
            <p>
              В отличие от традиционных гадательных справочников, книга рассматривает карты Таро как стройную метафизическую модель мира и человеческой психики, раскрывая каждый аркан на трех неразрывных уровнях:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2">
              <div className="rounded-lg bg-slate-800/80 p-3 border border-slate-700/60">
                <div className="font-semibold text-amber-200">1. Метафизика (Архэ)</div>
                <div className="text-xs text-slate-400 mt-1">
                  Первоосновы Вселенной, законы физики, сингулярность, энтропия, космология и природа материи.
                </div>
              </div>
              <div className="rounded-lg bg-slate-800/80 p-3 border border-slate-700/60">
                <div className="font-semibold text-amber-200">2. Философия</div>
                <div className="text-xs text-slate-400 mt-1">
                  Символы Уэйта и Памелы Смит, архетипы Юнга, феномен Другого, алхимия (нигредо, альбедо, рубедо).
                </div>
              </div>
              <div className="rounded-lg bg-slate-800/80 p-3 border border-slate-700/60">
                <div className="font-semibold text-amber-200">3. Практика</div>
                <div className="text-xs text-slate-400 mt-1">
                  Психотерапевтическое проживание, выход из рутины, преодоление страхов, вопросы для интроспекции.
                </div>
              </div>
            </div>
          </div>

          {/* Earth vs Spiritual */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-amber-300 text-sm">
              <Compass className="h-4 w-4" />
              <span>12 Земных уроков и 8 Духовных уроков</span>
            </div>
            <p>
              Арканы разделены точкой «золотого сечения» — <strong>XIII арканом Смерть</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>
                <strong className="text-emerald-300">0–12 арканы (Земные уроки):</strong> становление, структуризация и реализация Эго в земном социуме (воля, законы, группа, личное благо).
              </li>
              <li>
                <strong className="text-rose-400">XIII аркан (Смерть):</strong> точка перелома, инициация, порог перехода от земного к вечному.
              </li>
              <li>
                <strong className="text-indigo-300">XIV–XXI арканы (Духовные уроки):</strong> познание истины, саморефлексия, созидание и обретение Самости (Великое Делание).
              </li>
            </ul>
          </div>

          {/* Mathematical logic */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-amber-300 text-sm">
              <Binary className="h-4 w-4" />
              <span>Атомарные арканы и формулы сложения</span>
            </div>
            <p>
              В книге обосновано, что арканы, чьи номера соответствуют простым числам (2, 3, 5, 7, 11, 13, 17, 19, а также 0 и 1), являются <strong>«атомарными»</strong> — неделимыми базовыми принципами мироздания. Составные же арканы формируются через сложение:
            </p>
            <div className="font-mono text-xs text-amber-200/90 bg-slate-950/60 rounded p-2.5 space-y-0.5">
              <div>• IV Император = 2+2 (удвоение сдерживания Жрицы в закон)</div>
              <div>• VI Влюбленные = 3+3 (два треугольника: Я и Другой)</div>
              <div>• VIII Сила = 4+4 / 7+1 (две системы, право каждой быть собой)</div>
              <div>• IX Отшельник = 7+2 / 3+3+3 (восхождение над рутиной)</div>
              <div>• X Колесо Фортуны = 7+3 (история развития субъекта во времени)</div>
              <div>• XII Повешенный = 7+5 (личное благо + целостный эгрегор = жертва)</div>
              <div>• XIV Умеренность = 9+5 (Отшельник + Иерофант = интеграция)</div>
              <div>• XV Дьявол = 9+6 (Отшельник + Влюбленные = овеществление Другого)</div>
              <div>• XVI Башня = 9+7 (Отшельник + Колесница = крах ложных опор)</div>
              <div>• XX Суд = 9+11 (Отшельник + Справедливость = испытание пред истиной)</div>
              <div>• XXI Мир = 12+9 (Повешенный + Отшельник = Великое Делание)</div>
            </div>
          </div>

          {/* Slavic integration */}
          <div className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-4 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-amber-300 text-sm">
              <Sparkles className="h-4 w-4" />
              <span>Славянская мифологическая оптика</span>
            </div>
            <p>
              Образы славянских богов и мифических существ (Баба Яга, Велес, Макошь, Сварог, Перун, Морана, Кощей Бессмертный, Дева Жива, Русалка, Ярило) идеально ложатся на универсальные архетипы книги. Они наполняют сухие схемы живым колоритом: рог изобилия, веретено судеб, кузнечный молот, живая и мертвая вода, Алатырь-камень и три мира (Правь, Явь, Навь).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
