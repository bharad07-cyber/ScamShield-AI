import React from 'react';

interface HighlightedTextProps {
  text: string;
  phrases?: string[];
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({ text, phrases = [] }) => {
  if (!phrases || phrases.length === 0) {
    return <p className="text-gray-300 leading-relaxed font-mono text-sm whitespace-pre-wrap">{text}</p>;
  }

  // Escape special regex characters
  const escapedPhrases = phrases.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).filter(Boolean);
  if (escapedPhrases.length === 0) {
    return <p className="text-gray-300 leading-relaxed font-mono text-sm whitespace-pre-wrap">{text}</p>;
  }

  const regex = new RegExp(`(${escapedPhrases.join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <div className="bg-black/50 p-4 rounded-xl border border-white/10 font-mono text-sm leading-relaxed text-gray-200 whitespace-pre-wrap">
      {parts.map((part, idx) => {
        const isMatched = phrases.some(p => p.toLowerCase() === part.toLowerCase());
        if (isMatched) {
          return (
            <mark
              key={idx}
              className="bg-red-500/30 text-red-300 border border-red-500/50 px-1.5 py-0.5 rounded font-semibold transition-all hover:bg-red-500/40 cursor-help inline-block mx-0.5"
              title="Flagged by ScamShield AI: Suspicious Scam Trigger Phrase"
            >
              {part}
            </mark>
          );
        }
        return <span key={idx}>{part}</span>;
      })}
    </div>
  );
};
