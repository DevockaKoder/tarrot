import React from 'react';
import { Eye, ExternalLink, Sparkles, Shield, Compass, CircleDot } from 'lucide-react';
import { TarotCard } from '../types';

interface TarotTableProps {
  cards: TarotCard[];
  onSelectCard: (card: TarotCard) => void;
}

export const TarotTable: React.FC<TarotTableProps> = ({ cards, onSelectCard }) => {
  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-slate-800/60 p-3 text-slate-400">
          <Compass className="h-8 w-8" />
        </div>
        <h3 className="mt-3 text-base font-semibold text-slate-200">Арканы не найдены</h3>
        <p className="mt-1 text-sm text-slate-400">
          Попробуйте изменить поисковый запрос или сбросить фильтры.
        </p>
      </div>
    );
  }

  const getRealmBadge = (realm: TarotCard['slavicRealm']) => {
    switch (realm) {
      case 'Правь':
        return (
          <span className="inline-flex items-center rounded border border-sky-500/30 bg-sky-950/60 px-1.5 py-0.5 text-[11px] font-medium text-sky-300">
            Правь
          </span>
        );
      case 'Явь':
        return (
          <span className="inline-flex items-center rounded border border-emerald-500/30 bg-emerald-950/60 px-1.5 py-0.5 text-[11px] font-medium text-emerald-300">
            Явь
          </span>
        );
      case 'Навь':
        return (
          <span className="inline-flex items-center rounded border border-rose-500/30 bg-rose-950/60 px-1.5 py-0.5 text-[11px] font-medium text-rose-300">
            Навь
          </span>
        );
      case 'Вне миров / Ирий':
      default:
        return (
          <span className="inline-flex items-center rounded border border-amber-500/30 bg-amber-950/60 px-1.5 py-0.5 text-[11px] font-medium text-amber-300">
            Ирий
          </span>
        );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="border-b border-slate-800 bg-[#141926] text-[11px] font-semibold uppercase tracking-wider text-amber-300/80 sticky top-0 z-10 backdrop-blur-sm">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-2 sm:pl-6 text-center w-16">
              №
            </th>
            <th scope="col" className="px-3 py-3.5 min-w-[150px]">
              Аркан Таро (Уэйт)
            </th>
            <th scope="col" className="px-3 py-3.5 min-w-[210px]">
              Славянский Образ
            </th>
            <th scope="col" className="px-3 py-3.5 min-w-[160px]">
              Архэ и Архетип
            </th>
            <th scope="col" className="px-3 py-3.5 min-w-[240px]">
              Славянские Символы и Атрибуты
            </th>
            <th scope="col" className="px-3 py-3.5 min-w-[190px]">
              Цвета и Сакральный Смысл
            </th>
            <th scope="col" className="px-3 py-3.5 min-w-[210px]">
              Вопрос Вопрошания
            </th>
            <th scope="col" className="px-3 py-3.5 min-w-[170px]">
              Практика по книге
            </th>
            <th scope="col" className="py-3.5 pl-2 pr-4 sm:pr-6 text-center w-20">
              Инфо
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/70 bg-[#0e1117]">
          {cards.map((card) => {
            const isEarth = card.lessonType === 'earth';
            return (
              <tr
                key={card.id}
                onClick={() => onSelectCard(card)}
                className="cursor-pointer transition-colors duration-150 hover:bg-slate-800/40 group"
              >
                {/* Number & Lesson indicator */}
                <td className="py-3.5 pl-4 pr-2 sm:pl-6 text-center">
                  <div className="flex flex-col items-center">
                    <span className="font-cinzel text-base font-bold text-amber-400 group-hover:text-amber-300">
                      {card.numberRoman}
                    </span>
                    <span
                      className={`mt-0.5 text-[9px] font-semibold uppercase px-1 rounded ${
                        isEarth
                          ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/40'
                          : 'text-indigo-400 bg-indigo-950/60 border border-indigo-800/40'
                      }`}
                      title={isEarth ? 'Земной урок' : 'Духовный урок'}
                    >
                      {isEarth ? 'Земной' : 'Духов.'}
                    </span>
                  </div>
                </td>

                {/* Waite Card Name */}
                <td className="px-3 py-3.5">
                  <div className="font-semibold text-slate-100 group-hover:text-amber-200 transition-colors">
                    {card.waiteName}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {card.compositionFormula}
                    </span>
                    {card.isAtomic && (
                      <span className="inline-block rounded bg-amber-900/40 px-1 text-[10px] text-amber-300 font-mono border border-amber-700/30" title="Атомарный аркан (простое число в системе книги)">
                        Атомарный
                      </span>
                    )}
                  </div>
                </td>

                {/* Slavic Mythological Deity & Title */}
                <td className="px-3 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-amber-100 font-serif-cormorant text-base leading-snug">
                      {card.slavicName}
                    </span>
                    {getRealmBadge(card.slavicRealm)}
                  </div>
                  <div className="text-xs text-slate-400 italic">
                    {card.slavicTitleSubtitle}
                  </div>
                </td>

                {/* Arche & Archetype */}
                <td className="px-3 py-3.5">
                  <div className="font-medium text-slate-200 flex items-center gap-1">
                    <span className="text-amber-400 text-xs">Архэ:</span>
                    <span>{card.arche}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    <span className="text-slate-400">Архетип:</span> {card.archetype}
                  </div>
                </td>

                {/* Slavic Symbols */}
                <td className="px-3 py-3.5">
                  <div className="flex flex-wrap gap-1.5">
                    {card.slavicSymbols.slice(0, 2).map((sym, idx) => (
                      <span
                        key={idx}
                        className="inline-block rounded bg-slate-800/80 px-2 py-0.5 text-xs text-slate-300 border border-slate-700/50"
                      >
                        {sym}
                      </span>
                    ))}
                    {card.slavicSymbols.length > 2 && (
                      <span className="text-xs text-amber-400/80 self-center">
                        +{card.slavicSymbols.length - 2} еще
                      </span>
                    )}
                  </div>
                </td>

                {/* Color Palette & Book Meaning */}
                <td className="px-3 py-3.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    {card.colorPalette.map((color, idx) => (
                      <span
                        key={idx}
                        className="inline-block h-4 w-4 rounded-full border border-slate-700 shadow-sm"
                        style={{ backgroundColor: color.hex }}
                        title={`${color.name} (${color.role}): ${color.bookJustification}`}
                      />
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-2" title={card.colorPalette.map(c => `${c.name}: ${c.bookJustification}`).join('; ')}>
                    {card.colorPalette[0]?.name}: {card.colorPalette[0]?.bookJustification}
                  </div>
                </td>

                {/* Question from book */}
                <td className="px-3 py-3.5">
                  <div className="text-xs text-slate-300 italic line-clamp-2" title={card.question}>
                    «{card.question}»
                  </div>
                </td>

                {/* Practice */}
                <td className="px-3 py-3.5">
                  <div className="text-xs text-slate-400 line-clamp-2" title={card.practice}>
                    {card.practice}
                  </div>
                </td>

                {/* Action button */}
                <td className="py-3.5 pl-2 pr-4 sm:pr-6 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCard(card);
                    }}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-300 transition hover:bg-amber-900/40 hover:text-amber-200 border border-slate-700/60"
                    title="Смотреть подробности аркана"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
