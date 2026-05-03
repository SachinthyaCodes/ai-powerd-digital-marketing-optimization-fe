'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  CalendarIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import {
  generateCalendar,
  getLatestCalendar,
  completeTask,
  CalendarPlan,
  CalendarTask,
} from '@/services/calendarService';
import { loadStrategyFromStorage } from '@/services/strategyApiService';

// ── Platform colours ─────────────────────────────────────────────────────────
const PLATFORM_COLORS: Record<string, string> = {
  Instagram: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  Facebook: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  WhatsApp: 'bg-green-500/10 text-green-400 border-green-500/20',
  LinkedIn: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  Twitter: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  TikTok: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20',
  YouTube: 'bg-red-500/10 text-red-400 border-red-500/20',
  Google: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
};

const OBJECTIVE_COLORS: Record<string, string> = {
  Engagement: 'text-emerald-400',
  Awareness: 'text-blue-400',
  Sales: 'text-amber-400',
  Community: 'text-purple-400',
};

const TIME_RANGE_OPTIONS = [
  { value: '1_week', label: '1 Week', days: 7 },
  { value: '2_weeks', label: '2 Weeks', days: 14 },
  { value: '1_month', label: '1 Month', days: 30 },
  { value: '2_months', label: '2 Months', days: 60 },
  { value: '3_months', label: '3 Months', days: 90 },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDateShort(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getDayName(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'long' });
}

function isToday(iso: string) {
  const today = new Date();
  const d = new Date(iso);
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

function isPast(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

/** Group tasks WITH their global index by ISO week. */
type IndexedTask = { task: CalendarTask; globalIndex: number };

function groupByWeekIndexed(items: IndexedTask[]): IndexedTask[][] {
  if (!items.length) return [];
  const weeks: IndexedTask[][] = [];
  let currentWeek: IndexedTask[] = [];
  let lastWeekNum = -1;

  for (const item of items) {
    const d = new Date(item.task.date);
    const startOfYear = new Date(d.getFullYear(), 0, 1);
    const weekNum = Math.ceil(
      ((d.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7,
    );
    if (weekNum !== lastWeekNum && currentWeek.length) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(item);
    lastWeekNum = weekNum;
  }
  if (currentWeek.length) weeks.push(currentWeek);
  return weeks;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const router = useRouter();

  const [calendar, setCalendar] = useState<CalendarPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState('1_month');
  const [filterPlatform, setFilterPlatform] = useState<string | null>(null);
  const [currentWeekIdx, setCurrentWeekIdx] = useState(0);
  const [viewMode, setViewMode] = useState<'week' | 'list'>('week');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [strategyId, setStrategyId] = useState<string | null>(null);
  // Task completion
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
  // Staleness (plan was built on a previous strategy version)
  const [isStale, setIsStale] = useState(false);
  const [dismissedStale, setDismissedStale] = useState(false);
  const [staleStrategyVersion, setStaleStrategyVersion] = useState<number | null>(null);

  // ── Load existing calendar or show empty state ──
  useEffect(() => {
    const stored = loadStrategyFromStorage();
    const sid = stored?.strategy?.strategy_id ?? null;
    setStrategyId(sid);

    if (!sid) {
      setLoading(false);
      return;
    }

    getLatestCalendar(sid)
      .then((result) => {
        if (result) {
          setCalendar(result.calendar);
          setSelectedRange(result.calendar.time_range);
          setCompletedTasks(new Set(result.calendar.completed_tasks ?? []));
          if (result.is_stale) {
            setIsStale(true);
            const stored = loadStrategyFromStorage();
            setStaleStrategyVersion(stored?.strategy?.version ?? null);
          }
        }
      })
      .catch((err) => {
        console.warn('Failed to load calendar:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Generate / regenerate ──
  const handleGenerate = useCallback(async () => {
    if (!strategyId) return;
    setGenerating(true);
    setError(null);
    try {
      const plan = await generateCalendar(strategyId, selectedRange);
      setCalendar(plan);
      // Reset completion state and staleness for the new plan
      setCompletedTasks(new Set(plan.completed_tasks ?? []));
      setIsStale(false);
      setDismissedStale(false);
      setCurrentWeekIdx(0);
      setFilterPlatform(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setGenerating(false);
    }
  }, [strategyId, selectedRange]);

  // Mark a task as done — optimistic update, persisted to DB
  const handleCompleteTask = useCallback(async (taskIndex: number) => {
    if (!calendar) return;
    // Optimistic
    setCompletedTasks((prev) => new Set([...prev, taskIndex]));
    try {
      const updated = await completeTask(calendar.id, taskIndex);
      setCompletedTasks(new Set(updated));
    } catch {
      // Revert on failure
      setCompletedTasks((prev) => {
        const next = new Set(prev);
        next.delete(taskIndex);
        return next;
      });
    }
  }, [calendar]);

  // ── Derived data ──
  const tasks: CalendarTask[] = calendar?.plan_json ?? [];
  // Pair every task with its stable global index (position in plan_json)
  const tasksWithIndex: IndexedTask[] = tasks.map((task, i) => ({ task, globalIndex: i }));
  const filteredTasksWithIndex = filterPlatform
    ? tasksWithIndex.filter(({ task }) => task.platform === filterPlatform)
    : tasksWithIndex;
  const weeks = groupByWeekIndexed(filteredTasksWithIndex);
  const platforms = Array.from(new Set(tasks.map((t) => t.platform)));

  const totalTasks = tasks.length;
  const completedCount = completedTasks.size;
  const upcomingTasks = tasks.filter((t, i) => !isPast(t.date) && !completedTasks.has(i)).length;
  const platformBreakdown = platforms.map((p) => ({
    name: p,
    count: tasks.filter((t) => t.platform === p).length,
  }));

  // ── Loading state ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#22C55E] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[#CBD5E1]">Loading your calendar...</p>
        </div>
      </div>
    );
  }

  // ── No strategy ──
  if (!strategyId) {
    return (
      <div className="min-h-screen bg-[#0B0F14]">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-[#1F2933] flex items-center justify-center mx-auto">
            <CalendarIcon className="h-10 w-10 text-[#CBD5E1]" />
          </div>
          <h1 className="text-2xl font-semibold text-[#F9FAFB]">
            Create your strategy first
          </h1>
          <p className="text-[#CBD5E1] max-w-md mx-auto">
            Your marketing calendar is built from your strategy. Fill out the
            business form to get your personalised strategy, then come back
            here for your day-by-day action plan.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-[#22C55E] text-[#0B0F14] rounded-xl font-medium hover:bg-[#16A34A] transition-all"
          >
            Create My Strategy
          </button>
        </div>
      </div>
    );
  }

  // ── No calendar yet (but strategy exists) ──
  if (!calendar && !generating) {
    return (
      <div className="min-h-screen bg-[#0B0F14]">
        <div className="max-w-3xl mx-auto px-6 py-16 space-y-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-[#1F2933] rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 text-[#CBD5E1]" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-[#F9FAFB]">
                Marketing Calendar
              </h1>
              <p className="text-sm text-[#CBD5E1] mt-1">
                Your day-by-day marketing action plan
              </p>
            </div>
          </div>

          <div className="bg-[#1F2933] border border-[#2D3748] rounded-2xl p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#22C55E]/10 flex items-center justify-center mx-auto">
              <SparklesIcon className="h-8 w-8 text-[#22C55E]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-[#F9FAFB]">
                Ready to plan your marketing?
              </h2>
              <p className="text-[#CBD5E1] max-w-md mx-auto">
                We&apos;ll create a step-by-step action plan based on your
                strategy — telling you exactly what to post, where, and when.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-[#CBD5E1]">
                How far ahead do you want to plan?
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {TIME_RANGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedRange(opt.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedRange === opt.value
                        ? 'bg-[#22C55E] text-[#0B0F14]'
                        : 'bg-[#0B0F14] text-[#CBD5E1] border border-[#2D3748] hover:border-[#22C55E]/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-8 py-3 bg-[#22C55E] text-[#0B0F14] rounded-xl font-medium hover:bg-[#16A34A] transition-all disabled:opacity-50 flex items-center gap-2 mx-auto"
            >
              <SparklesIcon className="h-5 w-5" />
              Create My Action Plan
            </button>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Generating state ──
  if (generating) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-16 h-16 border-3 border-[#22C55E] border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-[#F9FAFB]">
              Building your action plan...
            </h2>
            <p className="text-[#CBD5E1]">
              Our AI is creating a personalised day-by-day marketing plan
              based on your strategy. This usually takes about 30 seconds.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Full calendar view ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0B0F14]">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-[#1F2933] rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 text-[#CBD5E1]" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-[#F9FAFB]">
                Marketing Calendar
              </h1>
              <p className="text-sm text-[#CBD5E1] mt-1">
                {formatDateShort(calendar!.start_date)} –{' '}
                {formatDateShort(calendar!.end_date)}
                {calendar!.auto_generated && (
                  <span className="ml-2 text-[#22C55E]">• Auto-updated</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="px-3 py-2 bg-[#1F2933] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] focus:outline-none focus:border-[#22C55E]"
            >
              {TIME_RANGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <div className="flex bg-[#1F2933] border border-[#2D3748] rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-2 text-sm transition-all ${
                  viewMode === 'week'
                    ? 'bg-[#22C55E] text-[#0B0F14] font-medium'
                    : 'text-[#CBD5E1] hover:text-[#F9FAFB]'
                }`}
              >
                Week View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm transition-all ${
                  viewMode === 'list'
                    ? 'bg-[#22C55E] text-[#0B0F14] font-medium'
                    : 'text-[#CBD5E1] hover:text-[#F9FAFB]'
                }`}
              >
                List View
              </button>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-4 py-2 bg-[#22C55E] text-[#0B0F14] rounded-lg font-medium hover:bg-[#16A34A] transition-all text-sm flex items-center gap-2 disabled:opacity-50"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Regenerate
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Staleness banner — shown when strategy was updated after this plan was made */}
        {isStale && !dismissedStale && (
          <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <ExclamationTriangleIcon className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-300">Your strategy has been updated</p>
              <p className="text-sm text-amber-300/70 mt-0.5">
                This content plan was built for{' '}
                {staleStrategyVersion == null
                  ? 'a previous strategy version'
                  : `a previous strategy version (your strategy is now v${staleStrategyVersion})`}.
                {' '}Tasks you’ve already completed are preserved.
                Recreating the plan will generate a fresh calendar based on your current strategy.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="px-3 py-1.5 bg-amber-500 text-[#0B0F14] rounded-lg text-xs font-semibold hover:bg-amber-400 transition-all disabled:opacity-50"
              >
                Recreate Plan
              </button>
              <button
                onClick={() => setDismissedStale(true)}
                className="p-1.5 hover:bg-amber-500/20 rounded-lg transition-all text-amber-400"
                aria-label="Dismiss"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#1F2933] border border-[#2D3748] rounded-xl p-4">
            <div className="text-sm text-[#CBD5E1]">Total Tasks</div>
            <div className="text-2xl font-semibold text-[#F9FAFB] mt-1">
              {totalTasks}
            </div>
          </div>
          <div className="bg-[#1F2933] border border-[#2D3748] rounded-xl p-4">
            <div className="text-sm text-[#CBD5E1]">Completed</div>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-2xl font-semibold text-[#22C55E]">{completedCount}</span>
              {totalTasks > 0 && (
                <span className="text-sm text-[#64748B] pb-0.5">
                  / {totalTasks} ({Math.round((completedCount / totalTasks) * 100)}%)
                </span>
              )}
            </div>
            {totalTasks > 0 && (
              <div className="mt-2 h-1 bg-[#0B0F14] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#22C55E] rounded-full transition-all"
                  style={{ width: `${Math.round((completedCount / totalTasks) * 100)}%` }}
                />
              </div>
            )}
          </div>
          <div className="bg-[#1F2933] border border-[#2D3748] rounded-xl p-4">
            <div className="text-sm text-[#CBD5E1]">Upcoming</div>
            <div className="text-2xl font-semibold text-[#F9FAFB] mt-1">
              {upcomingTasks}
            </div>
          </div>
          <div className="bg-[#1F2933] border border-[#2D3748] rounded-xl p-4">
            <div className="text-sm text-[#CBD5E1]">Platforms</div>
            <div className="flex flex-wrap gap-1 mt-2">
              {platformBreakdown.map((p) => (
                <span
                  key={p.name}
                  className={`text-xs px-2 py-0.5 rounded-full border ${
                    PLATFORM_COLORS[p.name] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                  }`}
                >
                  {p.name} ({p.count})
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Platform filter */}
        {platforms.length > 1 && (
          <div className="flex items-center gap-2 flex-wrap">
            <FunnelIcon className="h-4 w-4 text-[#CBD5E1]" />
            <button
              onClick={() => setFilterPlatform(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterPlatform
                  ? 'bg-[#1F2933] text-[#CBD5E1] hover:text-[#F9FAFB]'
                  : 'bg-[#22C55E] text-[#0B0F14]'
              }`}
            >
              All
            </button>
            {platforms.map((p) => (
              <button
                key={p}
                onClick={() =>
                  setFilterPlatform(filterPlatform === p ? null : p)
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterPlatform === p
                    ? 'bg-[#22C55E] text-[#0B0F14]'
                    : 'bg-[#1F2933] text-[#CBD5E1] hover:text-[#F9FAFB]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Week View */}
        {viewMode === 'week' && weeks.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() =>
                  setCurrentWeekIdx(Math.max(0, currentWeekIdx - 1))
                }
                disabled={currentWeekIdx === 0}
                className="p-2 hover:bg-[#1F2933] rounded-lg transition-colors disabled:opacity-30"
              >
                <ChevronLeftIcon className="h-5 w-5 text-[#CBD5E1]" />
              </button>
              <span className="text-sm font-medium text-[#F9FAFB]">
                Week {currentWeekIdx + 1} of {weeks.length}
                {weeks[currentWeekIdx] && (
                  <span className="text-[#CBD5E1] ml-2">
                    ({formatDateShort(weeks[currentWeekIdx][0].date)} –{' '}
                    {formatDateShort(
                      weeks[currentWeekIdx][weeks[currentWeekIdx].length - 1]
                        .date,
                    )}
                    )
                  </span>
                )}
              </span>
              <button
                onClick={() =>
                  setCurrentWeekIdx(
                    Math.min(weeks.length - 1, currentWeekIdx + 1),
                  )
                }
                disabled={currentWeekIdx >= weeks.length - 1}
                className="p-2 hover:bg-[#1F2933] rounded-lg transition-colors disabled:opacity-30"
              >
                <ChevronRightIcon className="h-5 w-5 text-[#CBD5E1]" />
              </button>
            </div>

            <div className="space-y-3">
              {(weeks[currentWeekIdx] || []).map(({ task, globalIndex }) => (
                <TaskCard
                  key={globalIndex}
                  task={task}
                  globalIndex={globalIndex}
                  isDone={completedTasks.has(globalIndex)}
                  onDone={handleCompleteTask}
                  expanded={expandedTask === String(globalIndex)}
                  onToggle={() =>
                    setExpandedTask(
                      expandedTask === String(globalIndex)
                        ? null
                        : String(globalIndex),
                    )
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-3">
            {filteredTasksWithIndex.map(({ task, globalIndex }) => (
              <TaskCard
                key={globalIndex}
                task={task}
                globalIndex={globalIndex}
                isDone={completedTasks.has(globalIndex)}
                onDone={handleCompleteTask}
                expanded={expandedTask === String(globalIndex)}
                onToggle={() =>
                  setExpandedTask(
                    expandedTask === String(globalIndex)
                      ? null
                      : String(globalIndex),
                  )
                }
              />
            ))}
          </div>
        )}

        {filteredTasksWithIndex.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#CBD5E1]">
              No tasks found
              {filterPlatform ? ` for ${filterPlatform}` : ''}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Task Card helpers ────────────────────────────────────────────────────────

function taskBorderClass(isDone: boolean, today: boolean): string {
  if (isDone) return 'border-[#22C55E]/20';
  if (today) return 'border-[#22C55E]/50 ring-1 ring-[#22C55E]/20';
  return 'border-[#2D3748] hover:border-[#22C55E]/30';
}

function taskOpacityClass(isDone: boolean, past: boolean): string {
  if (isDone) return 'opacity-50 grayscale';
  if (past) return 'opacity-65';
  return '';
}

function dateBadgeClass(isDone: boolean, today: boolean, past: boolean): string {
  if (isDone || past) return 'bg-[#0B0F14] text-[#64748B]';
  if (today) return 'bg-[#22C55E]/20 text-[#22C55E]';
  return 'bg-[#0B0F14] text-[#F9FAFB]';
}

// ── Task Card ────────────────────────────────────────────────────────────────

function TaskCard({
  task,
  globalIndex,
  isDone,
  onDone,
  expanded,
  onToggle,
}: Readonly<{
  task: CalendarTask;
  globalIndex: number;
  isDone: boolean;
  onDone: (index: number) => void;
  expanded: boolean;
  onToggle: () => void;
}>) {
  const past = isPast(task.date);
  const today = isToday(task.date);

  return (
    <div
      className={`bg-[#1F2933] border rounded-xl transition-all ${taskBorderClass(isDone, today)} ${taskOpacityClass(isDone, past)}`}
    >
      {/* Card header */}
      <div className="flex items-start gap-4 p-4">
        {/* Date badge — clickable area to expand (not when done) */}
        <button
          type="button"
          disabled={isDone}
          onClick={isDone ? undefined : onToggle}
          className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl flex-shrink-0 ${dateBadgeClass(isDone, today, past)} ${isDone ? 'cursor-default' : 'cursor-pointer'}`}
        >
          <span className="text-[10px] uppercase font-medium leading-none">
            {new Date(task.date).toLocaleDateString('en-US', { month: 'short' })}
          </span>
          <span className="text-lg font-bold leading-tight">
            {new Date(task.date).getDate()}
          </span>
          <span className="text-[9px] uppercase leading-none">
            {new Date(task.date).toLocaleDateString('en-US', { weekday: 'short' })}
          </span>
        </button>

        {/* Main content — clickable to expand */}
        <button
          type="button"
          disabled={isDone}
          onClick={isDone ? undefined : onToggle}
          className={`flex-1 min-w-0 space-y-2 text-left ${isDone ? 'cursor-default' : 'cursor-pointer'}`}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                PLATFORM_COLORS[task.platform] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'
              }`}
            >
              {task.platform}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#0B0F14] text-[#CBD5E1] border border-[#2D3748]">
              {task.content_type}
            </span>
            <span className={`text-xs font-medium ${OBJECTIVE_COLORS[task.objective] || 'text-[#CBD5E1]'}`}>
              {task.objective}
            </span>
            {today && !isDone && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#22C55E] text-[#0B0F14]">
                TODAY
              </span>
            )}
          </div>
          <h3 className={`font-medium truncate ${isDone ? 'line-through text-[#64748B]' : 'text-[#F9FAFB]'}`}>
            {task.title}
          </h3>
          {!expanded && (
            <div className="flex items-center gap-3 text-xs text-[#CBD5E1]">
              <span className="flex items-center gap-1">
                <ClockIcon className="h-3.5 w-3.5" />
                {task.best_time}
              </span>
              {task.tags?.length > 0 && (
                <span className="truncate">
                  {task.tags.slice(0, 3).map((t) => `#${t}`).join(' ')}
                </span>
              )}
            </div>
          )}
        </button>

        {/* Done indicator / Mark Done button */}
        <div className="flex-shrink-0 flex items-center ml-1">
          {isDone ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-lg">
              <LockClosedIcon className="h-3.5 w-3.5 text-[#22C55E]" />
              <span className="text-xs text-[#22C55E] font-medium">Done</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDone(globalIndex);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#0B0F14] border border-[#2D3748] rounded-lg text-xs font-medium text-[#CBD5E1] hover:border-[#22C55E]/50 hover:text-[#22C55E] hover:bg-[#22C55E]/5 transition-all"
            >
              <CheckCircleIcon className="h-3.5 w-3.5" />
              Mark Done
            </button>
          )}
        </div>
      </div>

      {/* Expanded details — only when not done */}
      {expanded && !isDone && (
        <div className="px-4 pb-4 pt-0 space-y-3 border-t border-[#2D3748]">
          <div className="pt-3">
            <p className="text-sm text-[#CBD5E1] leading-relaxed">{task.description}</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-[#CBD5E1]">
              <ClockIcon className="h-3.5 w-3.5" />
              Best time: <span className="text-[#F9FAFB] font-medium">{task.best_time}</span>
            </span>
            <span className="text-[#CBD5E1]">
              Day: <span className="text-[#F9FAFB] font-medium">{getDayName(task.date)}</span>
            </span>
          </div>
          {task.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-md bg-[#0B0F14] text-[#CBD5E1] border border-[#2D3748]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => onDone(globalIndex)}
            className="flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-lg text-sm font-medium text-[#22C55E] hover:bg-[#22C55E]/20 transition-all w-full justify-center"
          >
            <CheckCircleIcon className="h-4 w-4" />
            Mark as Done
          </button>
        </div>
      )}
    </div>
  );
}
