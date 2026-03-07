'use client';

import type { Suggestion } from '../types';

const suggestions: Suggestion[] = [
  { id: '1', text: 'Help me build a marketing strategy for my business', category: 'Strategy', icon: '' },
  { id: '2', text: 'What social media platforms should I focus on?', category: 'Social Media', icon: '' },
  { id: '3', text: 'Generate content ideas for my brand', category: 'Content', icon: '' },
  { id: '4', text: 'Analyze my current marketing performance', category: 'Analytics', icon: '' },
  { id: '5', text: 'Help me plan an ad campaign', category: 'Campaigns', icon: '' },
  { id: '6', text: 'How can I optimize my conversion rate?', category: 'Optimization', icon: '' },
];

interface Props {
  onSelect: (text: string) => void;
}

export default function SuggestionCards({ onSelect }: Props) {
  return (
    <div className="sa-suggestions">
      {suggestions.map((s) => (
        <button key={s.id} className="sa-suggestion-card" onClick={() => onSelect(s.text)}>
          <span className="sa-suggestion-category">{s.category}</span>
          <span className="sa-suggestion-text">{s.text}</span>
        </button>
      ))}
    </div>
  );
}
