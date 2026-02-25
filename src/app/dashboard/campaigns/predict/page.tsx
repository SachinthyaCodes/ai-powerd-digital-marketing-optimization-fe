'use client';

import { useState } from 'react';
import PredictionForm from '@/components/campaigns/PredictionForm';
import PredictionResults from '@/components/campaigns/PredictionResults';
import ExplainabilityPanel from '@/components/campaigns/ExplainabilityPanel';
import { predictCampaign, PredictionRequest, PredictionResponse } from '@/services/campaignApiService';
import styles from './page.module.css';

type ViewState = 'form' | 'results';

export default function PredictPage() {
  const [view, setView] = useState<ViewState>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<PredictionResponse | null>(null);

  const handleSubmit = async (data: PredictionRequest) => {
    setLoading(true);
    setError(null);

    try {
      const result = await predictCampaign(data);
      setResponse(result);
      setView('results');
    } catch (err: any) {
      setError(err.message ?? 'Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setView('form');
    setResponse(null);
    setError(null);
  };

  return (
    <div className={styles.page}>
      {/* Background */}
      <div className={styles.bg} />
      <div className={styles.glow} />

      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Campaign Performance Predictor</h1>
        <p className={styles.pageSubtitle}>
          Enter your post details to predict engagement and get AI-powered recommendations.
        </p>
      </header>

      {/* Main */}
      <div className={styles.container}>
        {view === 'form' ? (
          <div className={styles.formWrapper}>
            {/* Section label */}
            <div className={styles.sectionLabel}>
              <span className={styles.labelDot} />
              TRANSFORMER MODEL — ENGAGEMENT PREDICTION
            </div>

            {/* Error */}
            {error && (
              <div className={styles.errorBanner}>
                <span>⚠</span>
                {error}
              </div>
            )}

            <PredictionForm onSubmit={handleSubmit} loading={loading} />
          </div>
        ) : (
          response && (
            <div className={styles.resultsWrapper}>
              {/* Back button */}
              <button className={styles.backBtn} onClick={handleReset}>
                ← Predict Another Post
              </button>

              {/* Results + Explainability */}
              <div className={styles.resultsGrid}>
                <div className={styles.resultsCol}>
                  <PredictionResults results={response.predictions} />
                </div>
                <div className={styles.explainCol}>
                  <ExplainabilityPanel tips={response.explainability} />
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
