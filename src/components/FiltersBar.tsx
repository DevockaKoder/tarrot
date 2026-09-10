import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';
import { FilterLessonType, FilterAtomicType, FilterRealm } from '../types';

interface FiltersBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedLesson: FilterLessonType;
  onLessonChange: (lesson: FilterLessonType) => void;
  selectedAtomic: FilterAtomicType;
  onAtomicChange: (atomic: FilterAtomicType) => void;
  selectedRealm: FilterRealm;
  onRealmChange: (realm: FilterRealm) => void;
  totalCards: number;
  filteredCount: number;
  onResetFilters: () => void;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedLesson,
  onLessonChange,
  selectedAtomic,
  onAtomicChange,
  selectedRealm,
  onRealmChange,
  totalCards,
  filteredCount,
  onResetFilters,
}) => {
  const isFiltered =
    searchQuery !== '' ||
    selectedLesson !== 'all' ||
    selectedAtomic !== 'all' ||
    selectedRealm !== 'all';

  return (
    <div className="border-b border-slate-800 bg-[#121620] px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-3.5">
        {/* Search & Main tabs row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="search-tarot-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Поиск по карте, славянскому образу, цвету, символу..."
              className="w-full rounded-lg border border-slate-700 bg-slate-900/90 pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 transition focus:border-amber-500/80 focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Lesson Type Tabs */}
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 p-1 text-xs">
            <button
              id="filter-lesson-all"
              onClick={() => onLessonChange('all')}
              className={`rounded-md px-3 py-1.5 font-medium transition ${
                selectedLesson === 'all'
                  ? 'bg-amber-950/80 text-amber-200 border border-amber-800/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Все арканы (22)
            </button>
            <button
              id="filter-lesson-earth"
              onClick={() => onLessonChange('earth')}
              className={`rounded-md px-3 py-1.5 font-medium transition ${
                selectedLesson === 'earth'
                  ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-800/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Земные уроки (0–12)
            </button>
            <button
              id="filter-lesson-spiritual"
              onClick={() => onLessonChange('spiritual')}
              className={`rounded-md px-3 py-1.5 font-medium transition ${
                selectedLesson === 'spiritual'
                  ? 'bg-indigo-950/80 text-indigo-200 border border-indigo-800/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Духовные уроки (13–21)
            </button>
          </div>
        </div>

        {/* Secondary filters row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            {/* Realm filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Мир:</span>
              <select
                id="filter-realm-select"
                value={selectedRealm}
                onChange={(e) => onRealmChange(e.target.value as FilterRealm)}
                className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-200 focus:border-amber-500 focus:outline-none"
              >
                <option value="all">Все миры</option>
                <option value="Правь">Правь (Божественный закон)</option>
                <option value="Явь">Явь (Земное бытие)</option>
                <option value="Навь">Навь (Тайное / Тень)</option>
                <option value="Вне миров / Ирий">Ирий / Вне миров</option>
              </select>
            </div>

            {/* Atomic nature filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Природа аркана:</span>
              <select
                id="filter-atomic-select"
                value={selectedAtomic}
                onChange={(e) => onAtomicChange(e.target.value as FilterAtomicType)}
                className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-200 focus:border-amber-500 focus:outline-none"
              >
                <option value="all">Любая</option>
                <option value="atomic">Атомарные (простые числа по книге)</option>
                <option value="composite">Составные (формулы сложения)</option>
              </select>
            </div>
          </div>

          {/* Filter status & Reset */}
          <div className="flex items-center gap-3">
            <span className="text-slate-400">
              Показано: <strong className="text-amber-200">{filteredCount}</strong> из {totalCards}
            </span>
            {isFiltered && (
              <button
                id="btn-reset-filters"
                onClick={onResetFilters}
                className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition underline underline-offset-2"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Сбросить фильтры</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
