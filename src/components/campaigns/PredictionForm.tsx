'use client';

import { useState, useCallback } from 'react';
import styles from './PredictionForm.module.css';
import ImageUpload from './ImageUpload';

export interface FormValues {
  caption: string;
  content: string;
  platform: string;
  post_date: string;
  post_time: string;
  followers: string;
  ad_boost: boolean;
}

export interface PredictionOutput {
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  timing_quality_score: number;
}

interface PredictionFormProps {
  onResult: (result: PredictionOutput, formValues: FormValues) => void;
  onLoading: (loading: boolean) => void;
  loading: boolean;
}

const PLATFORMS = ['Facebook', 'Instagram', 'TikTok', 'LinkedIn', 'Twitter/X', 'YouTube'];

const today = new Date().toISOString().split('T')[0];
const defaultTime = '18:00';

export default function PredictionForm({ onResult, onLoading, loading }: PredictionFormProps) {
  const [form, setForm] = useState<FormValues>({
    caption: '',
    content: '',
    platform: '',
    post_date: today,
    post_time: defaultTime,
    followers: '',
    ad_boost: false,
  });
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof FormValues, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleExtracted = useCallback((text: string) => {
    set('content', text);
  }, []);

  const isValid =
    form.platform.trim() !== '' &&
    form.post_date.trim() !== '' &&
    form.post_time.trim() !== '' &&
    form.followers.trim() !== '' &&
    Number(form.followers) > 0;

  const handleSubmit = async () => {
    if (!isValid || loading) return;
    setError(null);
    onLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          followers: Number(form.followers),
          ad_boost: form.ad_boost ? 1 : 0,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Prediction failed');
      onResult(json.prediction, form);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Prediction failed';
      setError(message);
    } finally {
      onLoading(false);
    }
  };

  const captionLen = form.caption.length;

  return (
    <div className={styles.formWrapper}>
      <h2 className={styles.formTitle}>Post Details</h2>

      {/* Image upload for content extraction */}
      <ImageUpload onExtracted={handleExtracted} />

      <hr className={styles.sectionDivider} />

      {/* Caption */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          Caption
          <span className={styles.optional}>(optional)</span>
        </label>
        <textarea
          className={styles.textarea}
          rows={3}
          placeholder="Enter your post caption here..."
          value={form.caption}
          onChange={(e) => set('caption', e.target.value)}
          maxLength={500}
        />
        <span className={`${styles.charCount} ${captionLen > 400 ? styles.charCountWarn : ''}`}>
          {captionLen} / 500
        </span>
      </div>

      {/* Content */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          Content
          <span className={styles.optional}>(extracted or type manually)</span>
        </label>
        <textarea
          className={styles.textarea}
          rows={3}
          placeholder="Image content text, or describe what the post is about..."
          value={form.content}
          onChange={(e) => set('content', e.target.value)}
        />
      </div>

      {/* Platform */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          Platform <span className={styles.required}>*</span>
        </label>
        <select
          className={styles.select}
          value={form.platform}
          onChange={(e) => set('platform', e.target.value)}
        >
          <option value="">Select platform</option>
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Post Date & Time */}
      <div className={styles.fieldRow}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            Post Date <span className={styles.required}>*</span>
          </label>
          <input
            type="date"
            className={styles.input}
            value={form.post_date}
            onChange={(e) => set('post_date', e.target.value)}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            Post Time <span className={styles.required}>*</span>
          </label>
          <input
            type="time"
            className={styles.input}
            value={form.post_time}
            onChange={(e) => set('post_time', e.target.value)}
          />
        </div>
      </div>

      {/* Followers */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          Followers <span className={styles.required}>*</span>
        </label>
        <input
          type="number"
          className={styles.input}
          placeholder="e.g. 12500"
          min={0}
          value={form.followers}
          onChange={(e) => set('followers', e.target.value)}
        />
      </div>

      {/* Ad Boost toggle */}
      <div className={styles.toggleRow}>
        <span className={styles.toggleLabel}>Ad Boost</span>
        <label className={styles.toggleSwitch}>
          <input
            type="checkbox"
            checked={form.ad_boost}
            onChange={(e) => set('ad_boost', e.target.checked)}
          />
          <span className={styles.toggleSlider} />
        </label>
      </div>

      <p className={styles.infoNote}>
        Predictions are generated by a Transformer deep learning model trained on Sri Lankan SME social media data.
      </p>

      {error && (
        <p style={{ fontSize: 12, color: '#f87171', margin: 0 }}>{error}</p>
      )}

      <button
        className={styles.submitBtn}
        onClick={handleSubmit}
        disabled={!isValid || loading}
      >
        {loading ? (
          <>
            <span className={styles.spinner} />
            Analysing...
          </>
        ) : (
          <>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Predict Performance
          </>
        )}
      </button>
    </div>
  );
}
