'use client';

interface Props {
  storeName?: string;
  onHistoryToggle: () => void;
  onLogout: () => void;
  userName?: string;
}

export default function ChatHeader({ storeName, onHistoryToggle, onLogout, userName }: Props) {
  return (
    <header className="sa-chat-header">
      <div className="sa-chat-header-left">
        <div className="sa-chat-header-avatar">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <div>
          <h1 className="sa-chat-header-title">Smart Assistant</h1>
          <span className="sa-chat-header-status">
            <span className="sa-status-dot" />
            {storeName || 'Online'}
          </span>
        </div>
      </div>
      <div className="sa-chat-header-right">
        {userName && <span className="sa-chat-header-user">{userName}</span>}
        <button className="sa-header-btn" onClick={onHistoryToggle} title="Chat history">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          History
        </button>
        <button className="sa-header-btn sa-header-btn--logout" onClick={onLogout} title="Log out">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3-3l3-3m0 0l-3-3m3 3H9" />
          </svg>
        </button>
      </div>
    </header>
  );
}
