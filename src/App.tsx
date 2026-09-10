import React, { useState, useMemo } from 'react';
import { TAROT_CARDS } from './data/tarotCards';
import { TarotCard, FilterLessonType, FilterAtomicType, FilterRealm } from './types';
import { Header } from './components/Header';
import { FiltersBar } from './components/FiltersBar';
import { TarotTable } from './components/TarotTable';
import { CardDetailModal } from './components/CardDetailModal';
import { GoogleSheetsExportModal } from './components/GoogleSheetsExportModal';
import { BookContextModal } from './components/BookContextModal';
import { generateCsv, generateMarkdown } from './services/googleSheetsService';
import { Sparkles, Compass, Shield, HeartHandshake, Eye, BookOpen, FileSpreadsheet } from 'lucide-react';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<FilterLessonType>('all');
  const [selectedAtomic, setSelectedAtomic] = useState<FilterAtomicType>('all');
  const [selectedRealm, setSelectedRealm] = useState<FilterRealm>('all');

  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  // Filtered Cards
  const filteredCards = useMemo(() => {
    return TAROT_CARDS.filter((card) => {
      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTitle =
          card.waiteName.toLowerCase().includes(q) ||
          card.slavicName.toLowerCase().includes(q) ||
          card.slavicTitleSubtitle.toLowerCase().includes(q) ||
          card.arche.toLowerCase().includes(q) ||
          card.archetype.toLowerCase().includes(q) ||
          card.numberRoman.toLowerCase() === q ||
          String(card.id) === q;

        const matchSymbols = card.slavicSymbols.some((s) => s.toLowerCase().includes(q));
        const matchColors = card.colorPalette.some(
          (c) => c.name.toLowerCase().includes(q) || c.bookJustification.toLowerCase().includes(q)
        );
        const matchPhilosophy =
          card.metaphysics.toLowerCase().includes(q) ||
          card.philosophy.toLowerCase().includes(q) ||
          card.slavicMythologicalContext.toLowerCase().includes(q);

        if (!matchTitle && !matchSymbols && !matchColors && !matchPhilosophy) {
          return false;
        }
      }

      // Lesson type
      if (selectedLesson !== 'all') {
        if (card.lessonType !== selectedLesson) return false;
      }

      // Atomic / Composite
      if (selectedAtomic === 'atomic' && !card.isAtomic) return false;
      if (selectedAtomic === 'composite' && card.isAtomic) return false;

      // Realm
      if (selectedRealm !== 'all') {
        if (card.slavicRealm !== selectedRealm) return false;
      }

      return true;
    });
  }, [searchQuery, selectedLesson, selectedAtomic, selectedRealm]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLesson('all');
    setSelectedAtomic('all');
    setSelectedRealm('all');
  };

  // Card modal navigation
  const handlePrevCard = () => {
    if (!selectedCard) return;
    const prevId = (selectedCard.id - 1 + 22) % 22;
    const prev = TAROT_CARDS.find((c) => c.id === prevId);
    if (prev) setSelectedCard(prev);
  };

  const handleNextCard = () => {
    if (!selectedCard) return;
    const nextId = (selectedCard.id + 1) % 22;
    const next = TAROT_CARDS.find((c) => c.id === nextId);
    if (next) setSelectedCard(next);
  };

  const handleDownloadCsv = () => {
    const csvData = generateCsv(filteredCards);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'slavic_tarot_symbolism_table.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdown(filteredCards);
    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#0d1017] text-slate-100 flex flex-col">
      {/* App Header */}
      <Header
        onOpenGoogleExport={() => setIsGoogleModalOpen(true)}
        onOpenBookModal={() => setIsBookModalOpen(true)}
        onDownloadCsv={handleDownloadCsv}
        onCopyMarkdown={handleCopyMarkdown}
        copiedMd={copiedMd}
      />

      {/* Hero / Concept Banner */}
      <div className="border-b border-slate-800/80 bg-gradient-to-r from-amber-950/20 via-slate-900/60 to-slate-900/40 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-slate-300">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span>
                <strong>22</strong> Старших Аркана
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>
                <strong>12</strong> Земных уроков (0–12)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-indigo-300">
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
              <span>
                <strong>8</strong> Духовных уроков (14–21)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-200">
              <span className="h-2 w-2 rounded-full bg-amber-300" />
              <span>
                <strong>10</strong> Атомарных первооснов (простые числа)
              </span>
            </div>
          </div>

          <div className="text-slate-400 text-[11px] flex items-center gap-2">
            <span className="hidden sm:inline">Нажмите на строку карты для подробного мифологического и метафизического анализа</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <FiltersBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedLesson={selectedLesson}
        onLessonChange={setSelectedLesson}
        selectedAtomic={selectedAtomic}
        onAtomicChange={setSelectedAtomic}
        selectedRealm={selectedRealm}
        onRealmChange={setSelectedRealm}
        totalCards={TAROT_CARDS.length}
        filteredCount={filteredCards.length}
        onResetFilters={handleResetFilters}
      />

      {/* Main Table Content */}
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-slate-800 bg-[#10141d] shadow-xl overflow-hidden">
            <TarotTable
              cards={filteredCards}
              onSelectCard={(card) => setSelectedCard(card)}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0a0d13] px-4 py-6 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl space-y-2">
          <p>
            Славянское Таро: система символизма и цветовой семантики Старших Арканов
          </p>
          <p className="text-[11px] text-slate-400">
            Скомпоновано по монографии: Тереза Славович-Досаева, Олеся Сидоренко «Загадочное Таро Уэйта. Глубинный смысл каждой карты» (Издательство АСТ, 2023).
          </p>
        </div>
      </footer>

      {/* Card Detail Modal */}
      <CardDetailModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
        onPrev={handlePrevCard}
        onNext={handleNextCard}
      />

      {/* Google Sheets Export Modal */}
      <GoogleSheetsExportModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        cards={filteredCards}
      />

      {/* Book Context & Methodology Modal */}
      <BookContextModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
      />
    </div>
  );
}
