'use client';

import { useState, useEffect } from 'react';
import styles from './ExplainabilityPanel.module.css';
import type { PredictionOutput, FormValues } from './PredictionForm';

interface ExplainabilityPanelProps {
  prediction: PredictionOutput;
  formValues: FormValues;
}

interface Improvement {
  metric: string;
  current_score: string;
  improvement_tips: string[];
}

interface BestPostingTime {
  recommended_days: string[];
  recommended_hours: string;
  reasoning: string;
}

interface Explanation {
  overall_assessment: string;
  performance_level: string;
  improvements: Improvement[];
  caption_advice: string;
  hashtag_suggestions: string[];
  content_quality_tips: string[];
  best_posting_time: BestPostingTime;
  platform_specific_tips: string[];
  ad_boost_advice: string;
  novelty_insight: string;
}

const badgeClass: Record<string, string> = {
  Low: styles.badgeLow,
  Moderate: styles.badgeModerate,
  Good: styles.badgeGood,
  Excellent: styles.badgeExcellent,
};

export default function ExplainabilityPanel({ prediction, formValues }: ExplainabilityPanelProps) {
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetchExplanation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchExplanation() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formValues, ...prediction }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Failed to load insights');
      setExplanation(json.explanation);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to generate insights');
    } finally {
      setLoading(false);
    }
  }

  const copyHashtag = (tag: string) => {
    navigator.clipboard.writeText(tag).then(() => {
      setCopied(tag);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  if (loading) {
    return (
      <div className={styles.panel}>
        <h2 className={styles.panelTitle} style={{ margin: 0 }}>Explainability Insights</h2>
        <div className={styles.loadingBox}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingText}>Generating expert insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.panel}>
        <h2 className={styles.panelTitle} style={{ margin: 0 }}>Explainability Insights</h2>
        <p className={styles.errorBox}>{error}</p>
        <button
          style={{ fontSize: 12, color: '#22c55e', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          onClick={fetchExplanation}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!explanation) return null;

  return (
    <div className={styles.panel}>
      {/* Header */}
      <div className={styles.panelHeader}>
        <div className={styles.panelTitleGroup}>
          <h2 className={styles.panelTitle}>Explainability Insights</h2>
          <p className={styles.panelSubtitle}>
            AI-powered recommendations to maximise your post engagement
          </p>
        </div>
        <span className={`${styles.performanceBadge} ${badgeClass[explanation.performance_level] || styles.badgeModerate}`}>
          {explanation.performance_level}
        </span>
      </div>

      {/* Overall assessment */}
      <p className={styles.assessment}>{explanation.overall_assessment}</p>

      {/* Per-metric improvements */}
      {explanation.improvements && explanation.improvements.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>How to Improve Each Metric</h3>
          {explanation.improvements.map((imp, i) => (
            <div key={i} className={styles.improvementCard}>
              <div className={styles.improvementHeader}>
                <span className={styles.improvementMetric}>{imp.metric}</span>
                <span className={styles.improvementScore}>Current: {imp.current_score}</span>
              </div>
              <ul className={styles.tipList}>
                {imp.improvement_tips?.map((tip, j) => (
                  <li key={j} className={styles.tipItem}>
                    <span className={styles.tipDot} />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Caption advice */}
      {explanation.caption_advice && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Caption Recommendations</h3>
          <p className={styles.adviceText}>{explanation.caption_advice}</p>
        </div>
      )}

      {/* Hashtag suggestions */}
      {explanation.hashtag_suggestions && explanation.hashtag_suggestions.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Suggested Hashtags <span style={{ color: '#4b5563', fontWeight: 400, textTransform: 'none', fontSize: 10 }}>(click to copy)</span></h3>
          <div className={styles.hashtagGrid}>
            {explanation.hashtag_suggestions.map((tag, i) => (
              <span
                key={i}
                className={styles.hashtag}
                onClick={() => copyHashtag(tag)}
                title="Click to copy"
              >
                {copied === tag ? '✓ Copied' : tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Best posting time */}
      {explanation.best_posting_time && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Best Posting Window</h3>
          <div className={styles.timeCard}>
            <div className={styles.timeRow}>
              <span className={styles.timeKey}>Days</span>
              <span className={styles.timeValue}>
                {explanation.best_posting_time.recommended_days?.join(', ')}
              </span>
            </div>
            <div className={styles.timeRow}>
              <span className={styles.timeKey}>Hours</span>
              <span className={styles.timeValue}>
                {explanation.best_posting_time.recommended_hours}
              </span>
            </div>
            <div className={styles.timeRow}>
              <span className={styles.timeKey}>Why</span>
              <span className={styles.timeValue}>
                {explanation.best_posting_time.reasoning}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Content quality tips */}
      {explanation.content_quality_tips && explanation.content_quality_tips.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Content Quality Tips</h3>
          <ul className={styles.bulletList}>
            {explanation.content_quality_tips.map((tip, i) => (
              <li key={i} className={styles.bulletItem}>
                <span className={styles.bulletNumber}>{i + 1}</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Platform-specific tips */}
      {explanation.platform_specific_tips && explanation.platform_specific_tips.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Platform-Specific Tips</h3>
          <ul className={styles.bulletList}>
            {explanation.platform_specific_tips.map((tip, i) => (
              <li key={i} className={styles.bulletItem}>
                <span className={styles.bulletNumber}>{i + 1}</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ad boost advice */}
      {explanation.ad_boost_advice && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Ad Boost Strategy</h3>
          <p className={styles.adviceText}>{explanation.ad_boost_advice}</p>
        </div>
      )}

      {/* Novelty insight */}
      {explanation.novelty_insight && (
        <div className={styles.noveltyBox}>
          <p className={styles.noveltyLabel}>Research Insight</p>
          <p className={styles.noveltyText}>{explanation.novelty_insight}</p>
        </div>
      )}
    </div>
  );
}
