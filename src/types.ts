export interface ColorSwatch {
  name: string;
  hex: string;
  role: string;
  bookJustification: string;
}

export interface SymbolDetail {
  symbol: string;
  meaning: string;
}

export interface TarotCard {
  id: number;
  numberRoman: string;
  waiteName: string;
  slavicName: string;
  slavicTitleSubtitle: string;
  arche: string; // Архэ (Сингулярность, Желание, Знание...)
  archetype: string; // Архетип по книге (Обнуление, Проводник, Хранительница...)
  practice: string; // Практика аркана по книге
  question: string; // Вопрос вопрошания из книги
  lessonType: 'earth' | 'spiritual'; // Земной урок (0-12) / Духовный урок (13-21)
  isAtomic: boolean; // Атомарный аркан (простое число или 0/1 по книге)
  compositionFormula: string; // Например "7+2", "3+3", "Атомарный"
  triad: string;
  slavicRealm: 'Правь' | 'Явь' | 'Навь' | 'Вне миров / Ирий';
  slavicSymbols: string[];
  colorPalette: ColorSwatch[];
  primaryColorHex: string;
  metaphysics: string;
  philosophy: string;
  slavicMythologicalContext: string;
  symbolsExplanation: SymbolDetail[];
  isModified?: boolean;
}

export type FilterLessonType = 'all' | 'earth' | 'spiritual';
export type FilterAtomicType = 'all' | 'atomic' | 'composite';
export type FilterRealm = 'all' | 'Правь' | 'Явь' | 'Навь' | 'Вне миров / Ирий';
