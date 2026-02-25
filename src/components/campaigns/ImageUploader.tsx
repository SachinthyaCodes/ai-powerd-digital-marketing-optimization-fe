'use client';

import { useRef, useState } from 'react';
import { extractTextFromImage } from '@/services/campaignApiService';
import styles from './ImageUploader.module.css';

interface Props {
  onTextExtracted: (text: string) => void;
}

export default function ImageUploader({ onTextExtracted }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setSource(null);

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setLoading(true);
    try {
      const result = await extractTextFromImage(file);
      setSource(result.source);
      onTextExtracted(result.text);
    } catch (err: any) {
      setError(err.message ?? 'Failed to extract text from image.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemove = () => {
    setPreview(null);
    setSource(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={styles.wrapper}>
      {!preview ? (
        <div
          className={styles.dropZone}
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className={styles.dropIcon}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <p className={styles.dropTitle}>Upload Content Image</p>
          <p className={styles.dropSubtitle}>Drag &amp; drop or click to browse</p>
          <p className={styles.dropHint}>Supports JPEG, PNG, WEBP · Max 10 MB</p>
          <p className={styles.dropHint}>Text in Sinhala or English will be extracted automatically</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className={styles.hiddenInput}
            onChange={handleChange}
          />
        </div>
      ) : (
        <div className={styles.previewWrapper}>
          <img src={preview} alt="Uploaded content" className={styles.previewImage} />
          <div className={styles.previewOverlay}>
            {loading && (
              <div className={styles.extractingBadge}>
                <span className={styles.spinner} />
                Extracting text…
              </div>
            )}
            {!loading && source && (
              <div className={styles.sourceBadge}>
                ✓ Text extracted via {source === 'easyocr' ? 'OCR' : 'AI Vision'}
              </div>
            )}
            {!loading && error && (
              <div className={styles.errorBadge}>⚠ {error}</div>
            )}
          </div>
          <button
            type="button"
            className={styles.removeBtn}
            onClick={handleRemove}
            aria-label="Remove image"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
