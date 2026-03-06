'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Tool {
  id: string;
  label: string;
  description: string;
}

// ─── Tone option cards ─────────────────────────────────────────────────────────
const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional', desc: 'Formal, courteous and precise.' },
  { value: 'friendly',     label: 'Friendly',     desc: 'Warm, conversational and approachable.' },
  { value: 'concise',      label: 'Concise',      desc: 'Short, direct answers — no filler.' },
] as const;

// ─── Language options ─────────────────────────────────────────────────────────
const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'Arabic (عربي)' },
  { code: 'fr', label: 'French (Français)' },
  { code: 'es', label: 'Spanish (Español)' },
  { code: 'de', label: 'German (Deutsch)' },
  { code: 'zh', label: 'Chinese (中文)' },
  { code: 'ms', label: 'Malay (Bahasa Melayu)' },
];

export default function SettingsPage() {
  const { token } = useAuth();

  // ── State ────────────────────────────────────────────────────────────────────
  const [tools,             setTools]             = useState<Tool[]>([]);
  const [enabledTools,      setEnabledTools]      = useState<string[]>([]);
  const [assistantTone,     setAssistantTone]     = useState<string>('professional');
  const [assistantLanguage, setAssistantLanguage] = useState<string>('en');
  const [loading,           setLoading]           = useState(true);
  const [saving,            setSaving]            = useState(false);
  const [saveMsg,           setSaveMsg]           = useState('');
  const [error,             setError]             = useState('');

  // ── Load settings ─────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    if (!token) return;
    try {
      const data = await authService.getAssistantSettings(token);
      setTools(data.tools ?? []);
      setEnabledTools(data.enabledTools ?? []);
      setAssistantTone(data.assistantTone ?? 'professional');
      setAssistantLanguage(data.assistantLanguage ?? 'en');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  // ── Toggle a tool ─────────────────────────────────────────────────────────────
  const toggleTool = (id: string) => {
    setEnabledTools((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  // ── Save ──────────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    setSaveMsg('');
    setError('');
    try {
      await authService.updateAssistantSettings(token, {
        enabledTools,
        assistantTone,
        assistantLanguage,
      });
      setSaveMsg('Settings saved successfully.');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0B0F14] p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Page header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F9FAFB]">Assistant Settings</h1>
          <p className="text-[#CBD5E1] text-sm mt-1">
            Configure your Smart Assistant's tools, response tone and language.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-[#CBD5E1] text-sm">Loading settings…</div>
        ) : (
          <>
            {/* ── Section 1: Agent Tools ─────────────────────────────────────── */}
            <section className="bg-[#0D1117] border border-[#1F2933] rounded-xl p-6 space-y-4">
              <div>
                <h2 className="text-[#F9FAFB] font-semibold text-base">Agent Tools</h2>
                <p className="text-[#6B7280] text-xs mt-0.5">
                  Enable tools that let the assistant proactively answer domain-specific questions
                  by searching your knowledge base with targeted queries.
                </p>
              </div>

              <div className="grid gap-3">
                {tools.map((tool) => {
                  const active = enabledTools.includes(tool.id);
                  return (
                    <button
                      key={tool.id}
                      onClick={() => toggleTool(tool.id)}
                      className={`flex items-start gap-4 w-full text-left p-4 rounded-lg border transition-all
                        ${active
                          ? 'border-[#22C55E]/50 bg-[#22C55E]/5'
                          : 'border-[#1F2933] bg-[#0B0F14] hover:border-[#22C55E]/20'
                        }`}
                    >
                      {/* Toggle pill */}
                      <div className={`mt-0.5 flex-shrink-0 w-9 h-5 rounded-full transition-colors relative
                        ${active ? 'bg-[#22C55E]' : 'bg-[#1F2933]'}`}>
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform
                          ${active ? 'translate-x-4' : 'translate-x-0.5'}`} />
                      </div>
                      {/* Text */}
                      <div>
                        <p className={`font-medium text-sm ${active ? 'text-[#22C55E]' : 'text-[#E5E7EB]'}`}>
                          {tool.label}
                        </p>
                        <p className="text-[#6B7280] text-xs mt-0.5">{tool.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ── Section 2: Response Tone ───────────────────────────────────── */}
            <section className="bg-[#0D1117] border border-[#1F2933] rounded-xl p-6 space-y-4">
              <div>
                <h2 className="text-[#F9FAFB] font-semibold text-base">Response Tone</h2>
                <p className="text-[#6B7280] text-xs mt-0.5">Choose how the assistant communicates with your customers.</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                {TONE_OPTIONS.map((opt) => {
                  const selected = assistantTone === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setAssistantTone(opt.value)}
                      className={`p-4 rounded-lg border text-left transition-all
                        ${selected
                          ? 'border-[#22C55E]/60 bg-[#22C55E]/8 ring-1 ring-[#22C55E]/20'
                          : 'border-[#1F2933] bg-[#0B0F14] hover:border-[#22C55E]/20'
                        }`}
                    >
                      <p className={`font-medium text-sm ${selected ? 'text-[#22C55E]' : 'text-[#E5E7EB]'}`}>
                        {opt.label}
                      </p>
                      <p className="text-[#6B7280] text-xs mt-1">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ── Section 3: Language ───────────────────────────────────────── */}
            <section className="bg-[#0D1117] border border-[#1F2933] rounded-xl p-6 space-y-4">
              <div>
                <h2 className="text-[#F9FAFB] font-semibold text-base">Response Language</h2>
                <p className="text-[#6B7280] text-xs mt-0.5">
                  The assistant will always reply in this language regardless of the question's language.
                </p>
              </div>

              <select
                value={assistantLanguage}
                onChange={(e) => setAssistantLanguage(e.target.value)}
                className="w-full bg-[#0B0F14] border border-[#1F2933] text-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm
                           focus:outline-none focus:border-[#22C55E]/50 focus:ring-1 focus:ring-[#22C55E]/20"
              >
                {LANGUAGE_OPTIONS.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.label}</option>
                ))}
              </select>
            </section>

            {/* ── Save button ────────────────────────────────────────────────── */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-[#22C55E] hover:bg-[#16A34A] disabled:opacity-50
                           text-black font-semibold text-sm rounded-lg transition-colors"
              >
                {saving ? 'Saving…' : 'Save Settings'}
              </button>
              {saveMsg && <span className="text-[#22C55E] text-sm">{saveMsg}</span>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
