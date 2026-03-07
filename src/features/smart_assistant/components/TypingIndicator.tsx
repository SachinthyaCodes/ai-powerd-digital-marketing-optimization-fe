'use client';

export default function TypingIndicator() {
  return (
    <div className="sa-bubble-row sa-bubble-row--assistant">
      <div className="sa-bubble-avatar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      </div>
      <div className="sa-bubble sa-bubble--assistant sa-typing">
        <span className="sa-dot" />
        <span className="sa-dot" />
        <span className="sa-dot" />
      </div>
    </div>
  );
}
