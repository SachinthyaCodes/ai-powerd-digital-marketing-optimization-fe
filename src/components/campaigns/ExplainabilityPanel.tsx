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

interface CaptionAnalysis {
  score: string;
  strengths: string[];
  weaknesses: string[];
  rewritten_caption: string;
}

interface ContentAnalysis {
  score: string;
  current_length_verdict: string;
  improvement_tips: string[];
}

interface WorkingElement {
  element: string;
  why_it_works: string;
  impact?: string;
}

interface MissingElement {
  missing_element: string;
  why_add_it: string;
  example: string;
  expected_uplift: string;
}

interface ImprovedCaptionVersion {
  version_label: string;
  caption?: string;
  content?: string;
  changes_made: string[];
}

interface CaptionWordAnalysis {
  original: string;
  what_is_working: WorkingElement[];
  what_is_missing: MissingElement[];
  improved_versions: ImprovedCaptionVersion[];
}

interface ContentWordAnalysis {
  original: string;
  what_is_working: WorkingElement[];
  what_is_missing: MissingElement[];
  improved_versions: ImprovedCaptionVersion[];
}

interface PriorityAction {
  rank: number;
  action: string;
  why: string;
  expected_impact: string;
}

interface CombinedScore {
  score: string;
  summary: string;
  alignment_issue: string;
  top_3_priority_actions: PriorityAction[];
}

interface CaptionContentExplainability {
  caption_word_analysis: CaptionWordAnalysis;
  content_word_analysis: ContentWordAnalysis;
  combined_caption_content_score: CombinedScore;
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
  caption_analysis?: CaptionAnalysis;
  content_analysis?: ContentAnalysis;
  caption_content_explainability?: CaptionContentExplainability;
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

      {/* ── Caption & Content Explainability ───────────────────────────── */}

      {/* Caption Analysis */}
      {explanation.caption_analysis && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            Caption Analysis
            <span className={styles.scoreTag}>{explanation.caption_analysis.score}</span>
          </h3>

          {/* Strengths */}
          {explanation.caption_analysis.strengths?.length > 0 && (
            <div className={styles.subCard}>
              <p className={styles.subCardLabel}>✓ What's Working</p>
              <ul className={styles.tipList}>
                {explanation.caption_analysis.strengths.map((s, i) => (
                  <li key={i} className={styles.tipItem}>
                    <span className={`${styles.tipDot} ${styles.tipDotGreen}`} />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Weaknesses */}
          {explanation.caption_analysis.weaknesses?.length > 0 && (
            <div className={styles.subCard}>
              <p className={styles.subCardLabel}>✗ What's Missing</p>
              <ul className={styles.tipList}>
                {explanation.caption_analysis.weaknesses.map((w, i) => (
                  <li key={i} className={styles.tipItem}>
                    <span className={`${styles.tipDot} ${styles.tipDotOrange}`} />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Rewritten caption */}
          {explanation.caption_analysis.rewritten_caption && (
            <div className={styles.rewrittenBox}>
              <p className={styles.rewrittenLabel}>Improved Caption</p>
              <p className={styles.rewrittenText}>&ldquo;{explanation.caption_analysis.rewritten_caption}&rdquo;</p>
            </div>
          )}
        </div>
      )}

      {/* Content Analysis */}
      {explanation.content_analysis && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            Content Analysis
            <span className={styles.scoreTag}>{explanation.content_analysis.score}</span>
          </h3>

          {explanation.content_analysis.current_length_verdict && (
            <div className={styles.subCard}>
              <p className={styles.subCardLabel}>Length Verdict</p>
              <p className={styles.subCardText}>{explanation.content_analysis.current_length_verdict}</p>
            </div>
          )}

          {explanation.content_analysis.improvement_tips?.length > 0 && (
            <div className={styles.subCard}>
              <p className={styles.subCardLabel}>Improvement Tips</p>
              <ul className={styles.tipList}>
                {explanation.content_analysis.improvement_tips.map((tip, i) => (
                  <li key={i} className={styles.tipItem}>
                    <span className={styles.tipDot} />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Caption Deep Dive */}
      {explanation.caption_content_explainability?.caption_word_analysis && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Caption Deep Dive</h3>

          {/* Original */}
          <div className={styles.originalBox}>
            <span className={styles.originalLabel}>Original Caption</span>
            <span className={styles.originalText}>&ldquo;{explanation.caption_content_explainability.caption_word_analysis.original}&rdquo;</span>
          </div>

          {/* What's working */}
          {explanation.caption_content_explainability.caption_word_analysis.what_is_working?.length > 0 && (
            <div className={styles.subCard}>
              <p className={styles.subCardLabel}>✓ Effective Elements</p>
              {explanation.caption_content_explainability.caption_word_analysis.what_is_working.map((el, i) => (
                <div key={i} className={styles.elementRow}>
                  <p className={styles.elementPhrase}>&ldquo;{el.element}&rdquo;</p>
                  <p className={styles.elementReason}>{el.why_it_works}</p>
                  {el.impact && <span className={styles.impactTag}>{el.impact}</span>}
                </div>
              ))}
            </div>
          )}

          {/* What's missing */}
          {explanation.caption_content_explainability.caption_word_analysis.what_is_missing?.length > 0 && (
            <div className={styles.subCard}>
              <p className={styles.subCardLabel}>✗ Missing Elements</p>
              {explanation.caption_content_explainability.caption_word_analysis.what_is_missing.map((m, i) => (
                <div key={i} className={styles.missingRow}>
                  <div className={styles.missingHeader}>
                    <span className={styles.missingTag}>{m.missing_element}</span>
                    <span className={styles.upliftTag}>{m.expected_uplift}</span>
                  </div>
                  <p className={styles.missingReason}>{m.why_add_it}</p>
                  {m.example && (
                    <div className={styles.exampleBox}>
                      <span className={styles.exampleLabel}>Example: </span>
                      <span className={styles.exampleText}>{m.example}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Improved versions */}
          {explanation.caption_content_explainability.caption_word_analysis.improved_versions?.length > 0 && (
            <div className={styles.subCard}>
              <p className={styles.subCardLabel}>Improved Versions</p>
              {explanation.caption_content_explainability.caption_word_analysis.improved_versions.map((v, i) => (
                <div key={i} className={styles.versionCard}>
                  <p className={styles.versionLabel}>{v.version_label}</p>
                  <p className={styles.versionCaption}>&ldquo;{v.caption || v.content}&rdquo;</p>
                  {v.changes_made?.length > 0 && (
                    <ul className={styles.changesList}>
                      {v.changes_made.map((c, j) => (
                        <li key={j} className={styles.changesItem}>{c}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content Deep Dive */}
      {explanation.caption_content_explainability?.content_word_analysis && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Content Deep Dive</h3>

          {/* Original */}
          <div className={styles.originalBox}>
            <span className={styles.originalLabel}>Original Content</span>
            <span className={styles.originalText}>&ldquo;{explanation.caption_content_explainability.content_word_analysis.original}&rdquo;</span>
          </div>

          {/* What's working */}
          {explanation.caption_content_explainability.content_word_analysis.what_is_working?.length > 0 && (
            <div className={styles.subCard}>
              <p className={styles.subCardLabel}>✓ Effective Elements</p>
              {explanation.caption_content_explainability.content_word_analysis.what_is_working.map((el, i) => (
                <div key={i} className={styles.elementRow}>
                  <p className={styles.elementPhrase}>&ldquo;{el.element}&rdquo;</p>
                  <p className={styles.elementReason}>{el.why_it_works}</p>
                  {el.impact && <span className={styles.impactTag}>{el.impact}</span>}
                </div>
              ))}
            </div>
          )}

          {/* What's missing */}
          {explanation.caption_content_explainability.content_word_analysis.what_is_missing?.length > 0 && (
            <div className={styles.subCard}>
              <p className={styles.subCardLabel}>✗ Missing Elements</p>
              {explanation.caption_content_explainability.content_word_analysis.what_is_missing.map((m, i) => (
                <div key={i} className={styles.missingRow}>
                  <div className={styles.missingHeader}>
                    <span className={styles.missingTag}>{m.missing_element}</span>
                    <span className={styles.upliftTag}>{m.expected_uplift}</span>
                  </div>
                  <p className={styles.missingReason}>{m.why_add_it}</p>
                  {m.example && (
                    <div className={styles.exampleBox}>
                      <span className={styles.exampleLabel}>Example: </span>
                      <span className={styles.exampleText}>{m.example}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Improved versions */}
          {explanation.caption_content_explainability.content_word_analysis.improved_versions?.length > 0 && (
            <div className={styles.subCard}>
              <p className={styles.subCardLabel}>Improved Versions</p>
              {explanation.caption_content_explainability.content_word_analysis.improved_versions.map((v, i) => (
                <div key={i} className={styles.versionCard}>
                  <p className={styles.versionLabel}>{v.version_label}</p>
                  <p className={styles.versionCaption}>&ldquo;{v.caption || v.content}&rdquo;</p>
                  {v.changes_made?.length > 0 && (
                    <ul className={styles.changesList}>
                      {v.changes_made.map((c, j) => (
                        <li key={j} className={styles.changesItem}>{c}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Combined Caption + Content Score */}
      {explanation.caption_content_explainability?.combined_caption_content_score && (() => {
        const combined = explanation.caption_content_explainability!.combined_caption_content_score;
        return (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              Caption &amp; Content Combined Score
              <span className={styles.scoreTag}>{combined.score}</span>
            </h3>

            {combined.summary && (
              <div className={styles.subCard}>
                <p className={styles.subCardLabel}>Overall Verdict</p>
                <p className={styles.subCardText}>{combined.summary}</p>
              </div>
            )}

            {combined.alignment_issue && (
              <div className={styles.alignmentBox}>
                <p className={styles.alignmentLabel}>Alignment Check</p>
                <p className={styles.alignmentText}>{combined.alignment_issue}</p>
              </div>
            )}

            {combined.top_3_priority_actions?.length > 0 && (
              <div className={styles.subCard}>
                <p className={styles.subCardLabel}>Top Priority Actions</p>
                {combined.top_3_priority_actions.map((act, i) => (
                  <div key={i} className={styles.priorityRow}>
                    <span className={styles.priorityRank}>#{act.rank}</span>
                    <div className={styles.priorityContent}>
                      <p className={styles.priorityAction}>{act.action}</p>
                      <p className={styles.priorityWhy}>{act.why}</p>
                      <span className={styles.upliftTag}>{act.expected_impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

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
