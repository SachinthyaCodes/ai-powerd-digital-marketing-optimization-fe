'use client';

import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import styles from './ImageUpload.module.css';

interface ImageUploadProps {
  onExtracted: (text: string) => void;
}

export default function ImageUpload({ onExtracted }: ImageUploadProps) {
  const inputRef            = useRef<HTMLInputElement>(null);
  const [file, setFile]     = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted]   = useState<string | null>(null);
  const [error, setError]           = useState<string | null>(null);

  const handleFileSelect = (selected: File) => {
    if (!selected.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, WEBP)');
      return;
    }
    setFile(selected);
    setExtracted(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(selected);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileSelect(dropped);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.files?.[0];
    if (chosen) handleFileSelect(chosen);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setExtracted(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const extractText = async () => {
    if (!file) return;
    setExtracting(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/extract`, {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Extraction failed');
      setExtracted(json.text);
      onExtracted(json.text);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Extraction failed';
      setError(message);
    } finally {
      setExtracting(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={styles.uploadWrapper}>
      <span className={styles.uploadLabel}>
        Upload Image <span style={{ color: '#4b5563', textTransform: 'none', fontWeight: 400 }}>(extract content text)</span>
      </span>

      {!file ? (
        <div
          className={`${styles.dropZone} ${isDragging ? styles.dropZoneActive : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <svg className={styles.dropIcon} width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 16.5V19a1 1 0 001 1h16a1 1 0 001-1v-2.5M12 3v13m-4-4l4-4 4 4" />
          </svg>
          <p className={styles.dropTitle}>
            Drag & drop or <span className={styles.browseLink}>browse</span>
          </p>
          <p className={styles.dropSubtitle}>JPEG, PNG, WEBP — max 10 MB</p>
        </div>
      ) : (
        <div className={styles.previewRow}>
          {preview && (
            <img src={preview} alt="preview" className={styles.previewImage} />
          )}
          <div className={styles.previewInfo}>
            <p className={styles.previewName}>{file.name}</p>
            <p className={styles.previewSize}>{formatBytes(file.size)}</p>
          </div>
          <button className={styles.clearBtn} onClick={clearFile} type="button">
            Remove
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={handleChange}
      />

      {file && (
        <button
          className={styles.extractBtn}
          onClick={extractText}
          disabled={extracting}
          type="button"
        >
          {extracting ? (
            <>
              <span className={styles.spinner} />
              Extracting text...
            </>
          ) : (
            <>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
              </svg>
              Extract Text from Image
            </>
          )}
        </button>
      )}

      {extracted && (
        <div className={styles.extractedPreview}>
          <p className={styles.extractedLabel}>Extracted Content</p>
          <p style={{ margin: 0 }}>{extracted}</p>
        </div>
      )}

      {error && <p className={styles.extractError}>{error}</p>}
    </div>
  );
}
