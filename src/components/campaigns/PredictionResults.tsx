'use client';

import { PredictionResult } from '@/services/campaignApiService';
import styles from './PredictionResults.module.css';

interface Props {
  results: PredictionResult;
}

interface MetricCard {
  key: keyof PredictionResult;
  label: string;
  icon: string;
  color: string;
  format: (v: number) => string;
  description: string;
}

const METRIC_CARDS: MetricCard[] = [
  {
    key: 'likes',
    label: 'Likes',
    icon: '❤️',
    color: '#f43f5e',
    format: (v) => Math.round(v).toLocaleString(),
    description: 'Predicted likes for this post',
  },
  {
    key: 'comments',
    label: 'Comments',
    icon: '💬',
    color: '#3b82f6',
    format: (v) => Math.round(v).toLocaleString(),
    description: 'Predicted comment count',
  },
  {
    key: 'shares',
    label: 'Shares',
    icon: '🔁',
    color: '#8b5cf6',
    format: (v) => Math.round(v).toLocaleString(),
    description: 'Predicted shares / reposts',
  },
  {
    key: 'clicks',
    label: 'Clicks',
    icon: '🖱️',
    color: '#f59e0b',
    format: (v) => Math.round(v).toLocaleString(),
    description: 'Predicted link or ad clicks',
  },
  {
    key: 'timing_quality_score',
    label: 'Timing Quality',
    icon: '⏰',
    color: '#22c55e',
    format: (v) => v.toFixed(2),
    description: 'Post timing quality score',
  },
];

function ScoreBar({ value }: { value: number }) {
  // Normalise to 0–100 for display (clamped)
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className={styles.scoreBarTrack}>
      <div className={styles.scoreBarFill} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function PredictionResults({ results }: Props) {
  const total =
    Math.round(results.likes) +
    Math.round(results.comments) +
    Math.round(results.shares) +
    Math.round(results.clicks);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Predicted Performance</h2>
        <div className={styles.totalBadge}>
          Total Engagement: <strong>{total.toLocaleString()}</strong>
        </div>
      </div>

      <div className={styles.cardGrid}>
        {METRIC_CARDS.map((card) => {
          const value = results[card.key];
          return (
            <div
              key={card.key}
              className={styles.card}
              style={{ '--card-accent': card.color } as React.CSSProperties}
            >
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>{card.icon}</span>
                <span className={styles.cardLabel}>{card.label}</span>
              </div>
              <div className={styles.cardValue} style={{ color: card.color }}>
                {card.format(value)}
              </div>
              <p className={styles.cardDesc}>{card.description}</p>
              {card.key === 'timing_quality_score' && (
                <ScoreBar value={value * 10} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
