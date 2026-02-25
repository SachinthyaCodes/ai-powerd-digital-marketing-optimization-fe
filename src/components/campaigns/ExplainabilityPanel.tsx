'use client';

import { useState } from 'react';
import { ExplainabilityTip } from '@/services/campaignApiService';
import styles from './ExplainabilityPanel.module.css';

interface Props {
  tips: ExplainabilityTip[];
}

const METRIC_META: Record<string, { label: string; icon: string; accent: string }> = {
  likes: { label: 'Likes', icon: '❤️', accent: '#f43f5e' },
  comments: { label: 'Comments', icon: '💬', accent: '#3b82f6' },
  shares: { label: 'Shares', icon: '🔁', accent: '#8b5cf6' },
  clicks: { label: 'Clicks', icon: '🖱️', accent: '#f59e0b' },
  timing_quality_score: { label: 'Timing Quality', icon: '⏰', accent: '#22c55e' },
};

function MetricSection({ tip }: { tip: ExplainabilityTip }) {
  const [open, setOpen] = useState(false);
  const meta = METRIC_META[tip.metric] ?? {
    label: tip.metric,
    icon: '📊',
    accent: '#64748b',
  };

  return (
    <div
      className={styles.section}
      style={{ '--accent': meta.accent } as React.CSSProperties}
    >
      <button
        type="button"
        className={styles.sectionHeader}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <div className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>{meta.icon}</span>
          <span className={styles.sectionLabel}>{meta.label}</span>
          <span className={styles.sectionScore} style={{ color: meta.accent }}>
            {tip.metric === 'timing_quality_score'
              ? Number(tip.current_value).toFixed(2)
              : Math.round(tip.current_value).toLocaleString()}
          </span>
        </div>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>
          ▾
        </span>
      </button>

      {open && (
        <div className={styles.sectionBody}>
          {/* Suggestions */}
          <ul className={styles.suggestionList}>
            {tip.suggestions.map((s, i) => (
              <li key={i} className={styles.suggestionItem}>
                <span className={styles.bullet} style={{ background: meta.accent }} />
                {s}
              </li>
            ))}
          </ul>

          {/* Hashtags */}
          {tip.hashtags && tip.hashtags.length > 0 && (
            <div className={styles.hashtagBlock}>
              <p className={styles.hashtagTitle}>Suggested Hashtags</p>
              <div className={styles.hashtagList}>
                {tip.hashtags.map((h, i) => (
                  <span
                    key={i}
                    className={styles.hashtagBadge}
                    style={{ borderColor: `${meta.accent}55`, color: meta.accent }}
                  >
                    {h.startsWith('#') ? h : `#${h}`}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ExplainabilityPanel({ tips }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <span className={styles.sparkle}>✦</span>
          AI Recommendations
        </h2>
        <p className={styles.subtitle}>
          Research-grade insights on how to improve each performance metric.
          Click a metric to expand.
        </p>
      </div>

      <div className={styles.sections}>
        {tips.map((tip) => (
          <MetricSection key={tip.metric} tip={tip} />
        ))}
      </div>
    </div>
  );
}
