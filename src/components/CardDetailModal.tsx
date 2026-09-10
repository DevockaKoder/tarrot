import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  Compass,
  Shield,
  Palette,
  HelpCircle,
  Edit3,
  Check,
  RotateCcw,
  Plus,
  Trash2,
} from 'lucide-react';
import { TarotCard, ColorSwatch, SymbolDetail } from '../types';

interface CardDetailModalProps {
  card: TarotCard | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSaveCard: (updatedCard: TarotCard) => void;
  onResetCard: (cardId: number) => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  onClose,
  onPrev,
  onNext,
  onSaveCard,
  onResetCard,
}) => {
  if (!card) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<TarotCard>({ ...card });
  const [newSymbol, setNewSymbol] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  // Sync formData when card changes
  useEffect(() => {
    if (card) {
      setFormData({
        ...card,
        slavicSymbols: [...card.slavicSymbols],
        colorPalette: card.colorPalette.map((c) => ({ ...c })),
        symbolsExplanation: card.symbolsExplanation.map((s) => ({ ...s })),
      });
      setIsEditing(false);
    }
  }, [card?.id]);

  const handleSave = () => {
    onSaveCard({
      ...formData,
      isModified: true,
    });
    setIsEditing(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleCancel = () => {
    setFormData({
      ...card,
      slavicSymbols: [...card.slavicSymbols],
      colorPalette: card.colorPalette.map((c) => ({ ...c })),
      symbolsExplanation: card.symbolsExplanation.map((s) => ({ ...s })),
    });
    setIsEditing(false);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Сбросить изменения этой карты к исходным данным из книги?')) {
      onResetCard(card.id);
      setIsEditing(false);
    }
  };

  const handleAddSymbol = () => {
    if (!newSymbol.trim()) return;
    setFormData((prev) => ({
      ...prev,
      slavicSymbols: [...prev.slavicSymbols, newSymbol.trim()],
    }));
    setNewSymbol('');
  };

  const handleRemoveSymbol = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      slavicSymbols: prev.slavicSymbols.filter((_, idx) => idx !== index),
    }));
  };

  const handleColorChange = (index: number, field: keyof ColorSwatch, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.colorPalette];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, colorPalette: updated };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl rounded-2xl border border-amber-900/40 bg-[#121622] text-slate-100 shadow-2xl shadow-black/80 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative border-b border-slate-800 bg-gradient-to-r from-[#171d2c] via-[#1a2133] to-[#141824] px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
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
                {card.isModified && (
                  <span className="rounded bg-amber-950/80 px-2 py-0.5 text-[10px] text-amber-300 border border-amber-700/40 font-semibold">
                    Изменено
                  </span>
                )}
              </div>

              {!isEditing ? (
                <>
                  <h2 className="text-2xl sm:text-3xl font-bold text-amber-100 font-serif-cormorant">
                    {card.slavicName}
                  </h2>
                  <p className="text-sm text-amber-300/80 italic">
                    {card.slavicTitleSubtitle} — Мир {card.slavicRealm}
                  </p>
                </>
              ) : (
                <div className="pt-2 space-y-2">
                  <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    Редактирование славянского образа:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formData.slavicName}
                      onChange={(e) => setFormData({ ...formData, slavicName: e.target.value })}
                      placeholder="Имя славянского персонажа"
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-amber-100 focus:border-amber-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={formData.slavicTitleSubtitle}
                      onChange={(e) => setFormData({ ...formData, slavicTitleSubtitle: e.target.value })}
                      placeholder="Эпитет / титул"
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-200 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Мир:</span>
                    <select
                      value={formData.slavicRealm}
                      onChange={(e) => setFormData({ ...formData, slavicRealm: e.target.value as any })}
                      className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-200 focus:border-amber-500"
                    >
                      <option value="Правь">Правь</option>
                      <option value="Явь">Явь</option>
                      <option value="Навь">Навь</option>
                      <option value="Вне миров / Ирий">Вне миров / Ирий</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2 self-end sm:self-start">
              {saveToast && (
                <span className="inline-flex items-center gap-1 rounded bg-emerald-950 px-2.5 py-1 text-xs font-medium text-emerald-300 border border-emerald-700 animate-in fade-in">
                  <Check className="h-3.5 w-3.5" />
                  <span>Сохранено!</span>
                </span>
              )}

              {!isEditing ? (
                <>
                  <button
                    id="btn-edit-card"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-amber-700/60 bg-amber-950/50 px-3 py-1.5 text-xs font-medium text-amber-200 transition hover:bg-amber-900/60"
                    title="Редактировать эту карту"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Редактировать</span>
                  </button>

                  {card.isModified && (
                    <button
                      onClick={handleResetToDefault}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white"
                      title="Сбросить к исходным данным из книги"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Сброс</span>
                    </button>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    id="btn-cancel-edit"
                    onClick={handleCancel}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white"
                  >
                    Отмена
                  </button>
                  <button
                    id="btn-save-edit"
                    onClick={handleSave}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-600 shadow"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Сохранить</span>
                  </button>
                </div>
              )}

              <button
                onClick={onClose}
                className="rounded-full bg-slate-800/80 p-2 text-slate-400 transition hover:bg-slate-700 hover:text-white"
                title="Закрыть"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="max-h-[75vh] overflow-y-auto px-6 py-6 space-y-6">
          {/* View Mode Content */}
          {!isEditing ? (
            <>
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
                <div className="flex flex-wrap gap-2 mb-3">
                  {card.slavicSymbols.map((sym, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-slate-800 px-3 py-1 text-xs text-amber-200 border border-slate-700"
                    >
                      {sym}
                    </span>
                  ))}
                </div>
                {card.symbolsExplanation.length > 0 && (
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
                )}
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
            </>
          ) : (
            /* Edit Mode Form */
            <div className="space-y-5 text-xs sm:text-sm">
              <div className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-4 text-xs text-amber-200">
                Отредактируйте любые поля аркана. После нажатия кнопки <strong>«Сохранить»</strong> обновленная информация сохранится в вашей сессии и будет включена во все последующие экспорты (Google Таблицы, CSV, JSON, Markdown).
              </div>

              {/* Arche & Archetype edits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Архэ (первооснова):</label>
                  <input
                    type="text"
                    value={formData.arche}
                    onChange={(e) => setFormData({ ...formData, arche: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Архетип:</label>
                  <input
                    type="text"
                    value={formData.archetype}
                    onChange={(e) => setFormData({ ...formData, archetype: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Question & Practice */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Вопрос вопрошания («Расклад наоборот»):</label>
                  <textarea
                    rows={2}
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs sm:text-sm text-slate-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Практика проживания (Уровень 3):</label>
                  <textarea
                    rows={2}
                    value={formData.practice}
                    onChange={(e) => setFormData({ ...formData, practice: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs sm:text-sm text-slate-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Slavic Symbols Editor */}
              <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <label className="text-xs font-semibold text-amber-400 block">
                  Славянские символы и атрибуты (список):
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.slavicSymbols.map((sym, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-amber-200 border border-slate-700"
                    >
                      <span>{sym}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSymbol(idx)}
                        className="text-slate-400 hover:text-rose-400 transition"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSymbol}
                    onChange={(e) => setNewSymbol(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSymbol()}
                    placeholder="Добавить новый славянский символ..."
                    className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSymbol}
                    className="inline-flex items-center gap-1 rounded-lg bg-amber-900/60 px-3 py-1.5 text-xs font-medium text-amber-200 hover:bg-amber-800"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Добавить</span>
                  </button>
                </div>
              </div>

              {/* Colors Editor */}
              <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <label className="text-xs font-semibold text-amber-400 block">
                  Цветовая палитра и сакральные обоснования:
                </label>
                <div className="space-y-2.5">
                  {formData.colorPalette.map((color, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={color.hex}
                          onChange={(e) => handleColorChange(idx, 'hex', e.target.value)}
                          className="h-7 w-7 rounded cursor-pointer border border-slate-700 bg-transparent p-0"
                        />
                        <input
                          type="text"
                          value={color.name}
                          onChange={(e) => handleColorChange(idx, 'name', e.target.value)}
                          placeholder="Цвет"
                          className="w-28 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 focus:border-amber-500"
                        />
                      </div>
                      <input
                        type="text"
                        value={color.role}
                        onChange={(e) => handleColorChange(idx, 'role', e.target.value)}
                        placeholder="Роль в карте"
                        className="w-28 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 focus:border-amber-500"
                      />
                      <input
                        type="text"
                        value={color.bookJustification}
                        onChange={(e) => handleColorChange(idx, 'bookJustification', e.target.value)}
                        placeholder="Обоснование из книги"
                        className="flex-1 w-full sm:w-auto rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 focus:border-amber-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Deep Metaphysics, Philosophy & Slavic Context */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Метафизическое значение (Уровень 1):</label>
                  <textarea
                    rows={3}
                    value={formData.metaphysics}
                    onChange={(e) => setFormData({ ...formData, metaphysics: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Философский смысл (Уровень 2):</label>
                  <textarea
                    rows={3}
                    value={formData.philosophy}
                    onChange={(e) => setFormData({ ...formData, philosophy: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Славянский мифологический контекст:</label>
                  <textarea
                    rows={3}
                    value={formData.slavicMythologicalContext}
                    onChange={(e) => setFormData({ ...formData, slavicMythologicalContext: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
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
