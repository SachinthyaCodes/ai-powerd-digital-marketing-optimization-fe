/**
 * Calendar action-plan API service.
 * Mirrors the FastAPI /api/v1/calendar/* endpoints.
 */

const PRODUCTION_BACKEND = 'https://sachinthya-marketing-stratergy-recommender.hf.space';

const API_BASE =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_STRATEGY_BASE_URL) ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? PRODUCTION_BACKEND
    : 'http://localhost:8000');

// ── Types ────────────────────────────────────────────────────────────────────

export interface CalendarTask {
  date: string;          // YYYY-MM-DD
  day_label: string;     // "Day 1 - Monday"
  platform: string;
  content_type: string;
  title: string;
  description: string;
  objective: string;     // Engagement | Awareness | Sales | Community
  best_time: string;     // "19:00"
  tags: string[];
}

export interface CalendarPlan {
  id: string;
  strategy_id: string;
  submission_id: string;
  time_range: string;
  plan_json: CalendarTask[];
  total_tasks: number;
  start_date: string;
  end_date: string;
  auto_generated: boolean;
  strategy_version: number;          // which strategy version built this plan
  completed_tasks: number[];         // 0-based indices of tasks marked Done
  created_at: string;
  updated_at: string;
}

export interface CalendarPlanSummary {
  id: string;
  strategy_id: string;
  time_range: string;
  total_tasks: number;
  start_date: string;
  end_date: string;
  created_at: string;
  auto_generated: boolean;
}

export interface TimeRangeOption {
  value: string;
  label: string;
  days: number;
}

// ── API calls ────────────────────────────────────────────────────────────────

/** Generate a new calendar action plan from a strategy. */
export async function generateCalendar(
  strategyId: string,
  timeRange: string = '1_month',
  startDate?: string,
): Promise<CalendarPlan> {
  const body: Record<string, string> = {
    strategy_id: strategyId,
    time_range: timeRange,
  };
  if (startDate) body.start_date = startDate;

  const response = await fetch(`${API_BASE}/api/v1/calendar/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to generate calendar plan');
  }
  return response.json();
}

/** Fetch the latest calendar plan for a strategy.
 * Returns the plan plus an is_stale flag (true when the plan was built
 * from an older strategy version and the strategy has since been updated).
 */
export async function getLatestCalendar(
  strategyId: string,
): Promise<{ calendar: CalendarPlan; is_stale: boolean } | null> {
  const response = await fetch(
    `${API_BASE}/api/v1/calendar/latest?strategy_id=${encodeURIComponent(strategyId)}`,
  );
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to fetch calendar');
  }
  const data = await response.json();
  if (!data.calendar) return null;
  return { calendar: data.calendar as CalendarPlan, is_stale: data.is_stale ?? false };
}

/** Mark a task as done (locked in the UI). Idempotent.
 * Returns the updated array of completed task indices.
 */
export async function completeTask(
  calendarId: string,
  taskIndex: number,
): Promise<number[]> {
  const response = await fetch(
    `${API_BASE}/api/v1/calendar/${encodeURIComponent(calendarId)}/tasks/${taskIndex}/done`,
    { method: 'PATCH' },
  );
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to mark task complete');
  }
  const data = await response.json();
  return data.completed_tasks as number[];
}

/** List all calendars for a submission. */
export async function listCalendars(
  submissionId: string,
): Promise<CalendarPlanSummary[]> {
  const response = await fetch(
    `${API_BASE}/api/v1/calendar/list?submission_id=${encodeURIComponent(submissionId)}`,
  );
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to list calendars');
  }
  const data = await response.json();
  return data.calendars ?? [];
}

/** Fetch a specific calendar plan by ID. */
export async function getCalendarById(
  calendarId: string,
): Promise<CalendarPlan> {
  const response = await fetch(
    `${API_BASE}/api/v1/calendar/${encodeURIComponent(calendarId)}`,
  );
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to fetch calendar');
  }
  return response.json();
}

/** Get available time range options. */
export async function getTimeRanges(): Promise<TimeRangeOption[]> {
  const response = await fetch(`${API_BASE}/api/v1/calendar/time-ranges`);
  if (!response.ok) return DEFAULT_TIME_RANGES;
  const data = await response.json();
  return data.time_ranges ?? DEFAULT_TIME_RANGES;
}

// Fallback if the endpoint isn't available
const DEFAULT_TIME_RANGES: TimeRangeOption[] = [
  { value: '1_week', label: '1 Week', days: 7 },
  { value: '2_weeks', label: '2 Weeks', days: 14 },
  { value: '1_month', label: '1 Month', days: 30 },
  { value: '2_months', label: '2 Months', days: 60 },
  { value: '3_months', label: '3 Months', days: 90 },
];
