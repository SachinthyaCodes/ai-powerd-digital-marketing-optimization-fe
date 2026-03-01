'use client';

import { useState } from 'react';
import Aurora from '@/components/Aurora';
import PredictionForm, { type PredictionOutput, type FormValues } from '@/components/campaigns/PredictionForm';
import PredictionResults from '@/components/campaigns/PredictionResults';
import ExplainabilityPanel from '@/components/campaigns/ExplainabilityPanel';
import styles from './styles/campaigns.module.css';

export default function CampaignsPage() {
  const [showPredictor, setShowPredictor] = useState(false);
  const [loading, setLoading]             = useState(false);
  const [result, setResult]               = useState<PredictionOutput | null>(null);
  const [savedForm, setSavedForm]         = useState<FormValues | null>(null);
  const [activeTab, setActiveTab]         = useState<'results' | 'explain'>('results');

  const handleResult = (prediction: PredictionOutput, formValues: FormValues) => {
    setResult(prediction);
    setSavedForm(formValues);
    setActiveTab('results');
  };

  const handleReset = () => {
    setResult(null);
    setSavedForm(null);
    setActiveTab('results');
  };

  // ─── Hero Landing View ─────────────────────────────────────────────
  if (!showPredictor) {
    return (
      <div className={styles.heroBg}>
        <div className={styles.auroraLayer}>
          <Aurora
            colorStops={['#22C55E', '#064e3b', '#0B0F14']}
            blend={0.6}
            amplitude={1.2}
            speed={0.25}
          />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroInner}>
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeDot} />
              AI-Powered · Transformer Model
            </div>

            <h1 className={styles.heroTitle}>
              Predict Social Media<br />
              <span className={styles.heroTitleAccent}>Campaign Performance</span><br />
              Before Publishing
            </h1>

            <p className={styles.heroDescription}>
              Our deep learning Transformer model analyses your post details — caption,
              content, platform, timing, followers and ad boost — to predict Likes,
              Comments, Shares, Clicks and Timing Quality Score in real time.
            </p>

            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <p className={styles.statValue}>5</p>
                <p className={styles.statLabel}>Metrics Predicted</p>
              </div>
              <span className={styles.statDivider} />
              <div className={styles.statItem}>
                <p className={styles.statValue}>6</p>
                <p className={styles.statLabel}>Platforms Supported</p>
              </div>
              <span className={styles.statDivider} />
              <div className={styles.statItem}>
                <p className={styles.statValue}>AI</p>
                <p className={styles.statLabel}>Explainability</p>
              </div>
            </div>

            <button
              className={styles.tryNowBtn}
              onClick={() => setShowPredictor(true)}
            >
              TRY NOW
              <svg className={styles.tryNowArrow} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5-5 5M6 12h12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Predictor View ────────────────────────────────────────────────
  return (
    <div className={styles.predictorPage}>
      <div className={styles.predictorCenter}>

        {/* Page heading */}
        <div className={styles.centeredHeader}>
          <h1 className={styles.centeredTitle}>Campaign Performance Predictor</h1>
          <p className={styles.centeredSubtitle}>
            Enter your post details to predict engagement and get AI-powered recommendations.
          </p>
        </div>

        {/* Form card */}
        <PredictionForm
          onResult={handleResult}
          onLoading={setLoading}
          loading={loading}
        />

        {/* Results + Explainability – appear below the form once ready */}
        {result && (
          <div className={styles.resultsSection}>
            <div className={styles.tabsRow}>
              <button
                className={`${styles.tab} ${activeTab === 'results' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('results')}
              >
                Predictions
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'explain' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('explain')}
              >
                Explainability
              </button>
            </div>

            {activeTab === 'results' && (
              <PredictionResults
                result={result}
                platform={savedForm?.platform || ''}
                loading={loading}
                onReset={handleReset}
              />
            )}

            {activeTab === 'explain' && savedForm && (
              <ExplainabilityPanel
                prediction={result}
                formValues={savedForm}
              />
            )}
          </div>
        )}

        {/* Back to landing */}
        <button
          className={styles.backLinkBtn}
          onClick={() => { setShowPredictor(false); handleReset(); }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to overview
        </button>

      </div>
    </div>
  );
}