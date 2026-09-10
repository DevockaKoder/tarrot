import React, { useState, useMemo, useEffect } from 'react';
import { TAROT_CARDS } from './data/tarotCards';
import { TarotCard, FilterLessonType, FilterAtomicType, FilterRealm } from './types';
import { Header } from './components/Header';
import { FiltersBar } from './components/FiltersBar';
import { TarotTable } from './components/TarotTable';
import { CardDetailModal } from './components/CardDetailModal';
import { GoogleSheetsExportModal } from './components/GoogleSheetsExportModal';
import { BookContextModal } from './components/BookContextModal';
import { generateCsv, generateMarkdown } from './services/googleSheetsService';
import { Sparkles, RotateCcw, Check, Edit3, Info } from 'lucide-react';

const STORAGE_KEY = 'slavic_tarot_cards_custom_v1';

export default function App() {
  // Load persisted cards or fallback to TAROT_CARDS
  const [cards, setCards] = useState<TarotCard[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === TAROT_CARDS.length) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load cards from storage', e);
    }
    return TAROT_CARDS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<FilterLessonType>('all');
  const [selectedAtomic, setSelectedAtomic] = useState<FilterAtomicType>('all');
  const [selectedRealm, setSelectedRealm] = useState<FilterRealm>('all');

  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  // Save to localStorage whenever cards change
  const saveCardsToStorage = (updatedCards: TarotCard[]) => {
    setCards(updatedCards);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCards));
    } catch (e) {
      console.error('Failed to persist cards', e);
    }
  };

  // Card update handler
  const handleSaveCard = (updatedCard: TarotCard) => {
    const updatedCards = cards.map((c) => (c.id === updatedCard.id ? updatedCard : c));
    saveCardsToStorage(updatedCards);
    setSelectedCard(updatedCard);
  };

  // Reset single card to original book dataset
  const handleResetCard = (cardId: number) => {
    const original = TAROT_CARDS.find((c) => c.id === cardId);
    if (!original) return;
    const updatedCards = cards.map((c) => (c.id === cardId ? { ...original, isModified: false } : c));
    saveCardsToStorage(updatedCards);
    setSelectedCard({ ...original, isModified: false });
  };

  // Reset all cards to original book dataset
  const handleResetAllCards = () => {
    if (window.confirm('Сбросить все отредактированные карты к исходному канону книги?')) {
      saveCardsToStorage(TAROT_CARDS);
      localStorage.removeItem(STORAGE_KEY);
      if (selectedCard) {
        const orig = TAROT_CARDS.find((c) => c.id === selectedCard.id);
        if (orig) setSelectedCard(orig);
      }
    }
  };

  // Count modified cards
  const modifiedCount = useMemo(() => {
    return cards.filter((c) => c.isModified).length;
  }, [cards]);

  // Filtered Cards
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
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
  }, [cards, searchQuery, selectedLesson, selectedAtomic, selectedRealm]);

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
    const prev = cards.find((c) => c.id === prevId);
    if (prev) setSelectedCard(prev);
  };

  const handleNextCard = () => {
    if (!selectedCard) return;
    const nextId = (selectedCard.id + 1) % 22;
    const next = cards.find((c) => c.id === nextId);
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

      {/* Concept & Stat Banner */}
      <div className="border-b border-slate-800/80 bg-gradient-to-r from-amber-950/20 via-slate-900/60 to-slate-900/40 px-4 py-3 sm:px-6 lg:px-8">
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
            <Edit3 className="h-3.5 w-3.5 text-amber-400" />
            <span>Вы можете редактировать любой аркан — все изменения сохраняются и скачиваются</span>
          </div>
        </div>
      </div>

      {/* Modified items alert banner */}
      {modifiedCount > 0 && (
        <div className="border-b border-amber-900/40 bg-amber-950/30 px-4 py-2.5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-200">
              <Info className="h-4 w-4 text-amber-400 shrink-0" />
              <span>
                Отредактировано арканов: <strong>{modifiedCount}</strong>. Все скачивания (Google Sheets, CSV, JSON, Markdown) автоматически содержат ваши авторские правки!
              </span>
            </div>
            <button
              onClick={handleResetAllCards}
              className="inline-flex items-center gap-1 rounded border border-amber-800/80 bg-amber-900/40 px-2.5 py-1 text-xs text-amber-200 hover:bg-amber-800 transition"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Сбросить все к оригиналу книги</span>
            </button>
          </div>
        </div>
      )}

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
        totalCards={cards.length}
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
              onEditCard={(card) => setSelectedCard(card)}
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

      {/* Card Detail & Edit Modal */}
      <CardDetailModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
        onPrev={handlePrevCard}
        onNext={handleNextCard}
        onSaveCard={handleSaveCard}
        onResetCard={handleResetCard}
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
