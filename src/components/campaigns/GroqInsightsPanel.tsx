'use client';

import { useState } from 'react';
import { GroqInsights } from '@/services/campaignApiService';
import styles from './GroqInsightsPanel.module.css';

interface Props {
  insights: GroqInsights;
}

const EXPLAIN_META = [
  {
    fieldKey: 'likes_explanation' as const,
    label: 'Likes',
    icon: '❤️',
    color: '#f43f5e',
    bg: '#1a0a0e',
    border: '#f43f5e22',
    headerBg: '#2a0a12',
  },
  {
    fieldKey: 'comments_explanation' as const,
    label: 'Comments',
    icon: '💬',
    color: '#3b82f6',
    bg: '#0a0e1a',
    border: '#3b82f622',
    headerBg: '#0a1228',
  },
  {
    fieldKey: 'shares_explanation' as const,
    label: 'Shares',
    icon: '🔁',
    color: '#8b5cf6',
    bg: '#110a1a',
    border: '#8b5cf622',
    headerBg: '#1a0a2a',
  },
];

function HashtagGrid({ hashtags }: { hashtags: string[] }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (tag: string) => {
    const clean = tag.startsWith('#') ? tag : `#${tag}`;
    navigator.clipboard.writeText(clean).catch(() => {});
    setCopied(clean);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className={styles.hashtagGrid}>
      {hashtags.map((tag, i) => {
        const clean = tag.startsWith('#') ? tag : `#${tag}`;
        const isCopied = copied === clean;
        return (
          <span
            key={i}
            className={`${styles.hashtagBadge} ${isCopied ? styles.copied : ''}`}
            onClick={() => copy(tag)}
            title="Click to copy"
          >
            {clean}
            <span className={styles.copyHint}>{isCopied ? '✓' : '⎘'}</span>
          </span>
        );
      })}
    </div>
  );
}

function ExplainAccordion({
  fieldKey,
  label,
  icon,
  color,
  bg,
  border,
  headerBg,
  text,
}: (typeof EXPLAIN_META)[0] & { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={styles.explainCard}
      style={{ borderColor: border, background: bg }}
    >
      <button
        type="button"
        className={styles.explainHeader}
        style={{ background: open ? headerBg : 'transparent' }}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <div className={styles.explainLeft}>
          <span className={styles.explainIcon}>{icon}</span>
          <span className={styles.explainMetric} style={{ color }}>
            How to increase {label}
          </span>
        </div>
        <span
          className={`${styles.explainChevron} ${open ? styles.explainChevronOpen : ''}`}
        >
          ▾
        </span>
      </button>
      {open && (
        <div className={styles.explainBody}>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
}

export default function GroqInsightsPanel({ insights }: Props) {
  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <div className={styles.titleRow}>
            <h2 className={styles.title}>AI Deep Explanation</h2>
            <span className={styles.groqBadge}>
              <span className={styles.groqDot} />
             
            </span>
          </div>
          <p className={styles.subtitle}>
            Hashtag suggestions, peak times, best dates and deep metric explanations.
          </p>
        </div>
      </div>

      {/* Hashtags */}
      {insights.hashtags.length > 0 && (
        <div className={styles.card}>
          <p className={styles.cardTitle}>
            <span className={styles.cardIcon}>#</span>
            Suggested Hashtags — click to copy
          </p>
          <HashtagGrid hashtags={insights.hashtags} />
        </div>
      )}

      {/* Peak Times + Best Dates */}
      {(insights.peak_times.length > 0 || insights.best_dates.length > 0) && (
        <div className={styles.timeDateGrid}>
          {insights.peak_times.length > 0 && (
            <div className={styles.timeCard}>
              <p className={styles.timeCardTitle}>
                <span>⏰</span> Peak Posting Times
              </p>
              <ul className={styles.timeList}>
                {insights.peak_times.map((t, i) => (
                  <li key={i} className={styles.timeItem}>
                    <span className={styles.timeBullet} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {insights.best_dates.length > 0 && (
            <div className={styles.dateCard}>
              <p className={styles.dateCardTitle}>
                <span>📅</span> Best Days to Post
              </p>
              <ul className={styles.dateList}>
                {insights.best_dates.map((d, i) => (
                  <li key={i} className={styles.dateItem}>
                    <span className={styles.dateBullet} />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Deep Explanations */}
      <div>
        <p className={styles.cardTitle} style={{ marginBottom: '12px' }}>
          <span className={styles.cardIcon}>🧠</span>
          How to Improve — Detailed Explanations
        </p>
        <div className={styles.explanations}>
          {EXPLAIN_META.map((meta) => {
            const text = insights[meta.fieldKey];
            if (!text) return null;
            return (
              <ExplainAccordion
                key={meta.fieldKey}
                {...meta}
                text={text}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
