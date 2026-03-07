'use client';

interface Props {
  onStart: () => void;
}

const capabilities = [
  { title: 'Marketing Strategy', desc: 'Get tailored marketing strategies for your business' },
  { title: 'Social Media', desc: 'Optimize your social media presence and engagement' },
  { title: 'Content Creation', desc: 'Generate compelling content ideas and copy' },
  { title: 'Analytics', desc: 'Understand your marketing performance data' },
  { title: 'Campaigns', desc: 'Plan and optimize ad campaigns effectively' },
  { title: 'Private & Secure', desc: 'Your business data stays confidential' },
];

export default function AssistantLanding({ onStart }: Props) {
  return (
    <div className="sa-landing">
      <div className="sa-landing-header">
        <div className="sa-landing-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
        <h1 className="sa-landing-title">Smart Assistant</h1>
        <p className="sa-landing-desc">
          Your AI-powered digital marketing advisor. Ask questions, get strategies,
          and grow your business with data-driven insights.
        </p>
      </div>

      <div className="sa-capabilities">
        {capabilities.map((c) => (
          <div key={c.title} className="sa-capability-card">
            <span className="sa-capability-icon">{c.title.charAt(0)}</span>
            <h3>{c.title}</h3>
            <p>{c.desc}</p>
          </div>
        ))}
      </div>

      <button className="sa-start-btn" onClick={onStart}>
        Start Chatting
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </button>
    </div>
  );
}
