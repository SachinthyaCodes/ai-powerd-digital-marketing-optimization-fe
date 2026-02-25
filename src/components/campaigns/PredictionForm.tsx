'use client';

import { useState } from 'react';
import ImageUploader from './ImageUploader';
import styles from './PredictionForm.module.css';
import { PredictionRequest } from '@/services/campaignApiService';

const PLATFORMS = ['Facebook', 'Instagram', 'TikTok', 'Twitter', 'YouTube'];

interface Props {
  onSubmit: (data: PredictionRequest) => void;
  loading: boolean;
}

const DEFAULT_FORM: PredictionRequest = {
  caption: '',
  content: '',
  platform: 'Facebook',
  post_date: new Date().toISOString().split('T')[0],
  post_time: '09:00',
  followers: 1000,
  ad_boost: 0,
};

export default function PredictionForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<PredictionRequest>(DEFAULT_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof PredictionRequest, string>>>({});

  const set = <K extends keyof PredictionRequest>(key: K, value: PredictionRequest[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!form.caption.trim()) errs.caption = 'Caption is required.';
    if (!form.content.trim()) errs.content = 'Content is required.';
    if (!form.platform) errs.platform = 'Select a platform.';
    if (!form.post_date) errs.post_date = 'Post date is required.';
    if (!form.post_time) errs.post_time = 'Post time is required.';
    if (form.followers < 0) errs.followers = 'Followers must be >= 0.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {/* Caption */}
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="caption">
          Caption
          <span className={styles.required}>*</span>
        </label>
        <textarea
          id="caption"
          className={`${styles.textarea} ${errors.caption ? styles.inputError : ''}`}
          rows={3}
          placeholder="Write an engaging caption for your post…"
          value={form.caption}
          onChange={(e) => set('caption', e.target.value)}
        />
        {errors.caption && <p className={styles.errorMsg}>{errors.caption}</p>}
      </div>

      {/* Image Upload → Content */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          Upload Image (auto-extracts content text)
        </label>
        <ImageUploader onTextExtracted={(text) => set('content', text)} />
      </div>

      {/* Content */}
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="content">
          Content
          <span className={styles.required}>*</span>
          <span className={styles.labelHint}> (auto-filled from image, or type manually)</span>
        </label>
        <textarea
          id="content"
          className={`${styles.textarea} ${errors.content ? styles.inputError : ''}`}
          rows={4}
          placeholder="Content text of your post or image…"
          value={form.content}
          onChange={(e) => set('content', e.target.value)}
        />
        {errors.content && <p className={styles.errorMsg}>{errors.content}</p>}
      </div>

      {/* Platform */}
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="platform">
          Platform <span className={styles.required}>*</span>
        </label>
        <div className={styles.platformGrid}>
          {PLATFORMS.map((p) => (
            <button
              key={p}
              type="button"
              className={`${styles.platformBtn} ${form.platform === p ? styles.platformActive : ''}`}
              onClick={() => set('platform', p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Row: Post Date + Post Time */}
      <div className={styles.row}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="post_date">
            Post Date <span className={styles.required}>*</span>
          </label>
          <input
            id="post_date"
            type="date"
            className={`${styles.input} ${errors.post_date ? styles.inputError : ''}`}
            value={form.post_date}
            onChange={(e) => set('post_date', e.target.value)}
          />
          {errors.post_date && <p className={styles.errorMsg}>{errors.post_date}</p>}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="post_time">
            Post Time <span className={styles.required}>*</span>
          </label>
          <input
            id="post_time"
            type="time"
            className={`${styles.input} ${errors.post_time ? styles.inputError : ''}`}
            value={form.post_time}
            onChange={(e) => set('post_time', e.target.value)}
          />
          {errors.post_time && <p className={styles.errorMsg}>{errors.post_time}</p>}
        </div>
      </div>

      {/* Row: Followers + Ad Boost */}
      <div className={styles.row}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="followers">
            Followers
          </label>
          <input
            id="followers"
            type="number"
            min={0}
            className={`${styles.input} ${errors.followers ? styles.inputError : ''}`}
            value={form.followers}
            onChange={(e) => set('followers', Math.max(0, parseInt(e.target.value) || 0))}
          />
          {errors.followers && <p className={styles.errorMsg}>{errors.followers}</p>}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Ad Boost</label>
          <div className={styles.toggleWrapper}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${form.ad_boost === 0 ? styles.toggleActive : ''}`}
              onClick={() => set('ad_boost', 0)}
            >
              No Boost
            </button>
            <button
              type="button"
              className={`${styles.toggleBtn} ${form.ad_boost === 1 ? styles.toggleActiveBoost : ''}`}
              onClick={() => set('ad_boost', 1)}
            >
              Boosted
            </button>
          </div>
        </div>
      </div>

      {/* Submit */}
      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? (
          <>
            <span className={styles.btnSpinner} />
            Predicting…
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            Predict Performance
          </>
        )}
      </button>
    </form>
  );
}
