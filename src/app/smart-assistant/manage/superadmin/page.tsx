'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getMe,
  getToken,
  clearAuth,
  getUser,
  getSuperadminDashboard,
  getSuperadminStats,
  getSuperadminUsers,
  promoteToAdmin,
  promoteToSuperadmin,
  demoteToUser,
  toggleUserActive,
  deleteSuperadminUser,
  createService,
  listServices,
  deleteService,
} from '@/features/smart_assistant/api';
import type { AuthUser, SAService } from '@/features/smart_assistant/types';
import '@/features/smart_assistant/smart-assistant.css';

type Tab = 'overview' | 'users' | 'services';

function fmt(val: number | undefined): string {
  if (val === undefined || val === null) return '—';
  return val.toLocaleString();
}

function fmtDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export default function SuperadminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [me, setMe] = useState<AuthUser | null>(null);
  const [actionMsg, setActionMsg] = useState('');

  // Overview
  const [platformStats, setPlatformStats] = useState<{
    totalAdmins: number;
    totalUsers: number;
    totalServices: number;
    activeServices: number;
    pendingServices: number;
  } | null>(null);
  const [userCounts, setUserCounts] = useState<{
    total_users: number;
    active_users: number;
    admins: number;
    regular_users: number;
    inactive_users: number;
  } | null>(null);

  // Users tab
  const [allUsers, setAllUsers] = useState<AuthUser[]>([]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');

  // Services tab
  const [services, setServices] = useState<SAService[]>([]);
  const [servicesLoaded, setServicesLoaded] = useState(false);
  const [newSvc, setNewSvc] = useState({ name: '', assignedEmail: '', storeName: '', storeCategory: '' });
  const [creatingService, setCreatingService] = useState(false);

  useEffect(() => {
    if (!getToken()) { router.replace('/smart-assistant/manage'); return; }

    async function init() {
      try {
        const user = await getMe();
        if (user.role !== 'superadmin') {
          router.replace('/smart-assistant/manage');
          return;
        }
        setMe(user);

        const [dash, stats] = await Promise.allSettled([
          getSuperadminDashboard(),
          getSuperadminStats(),
        ]);

        if (dash.status === 'fulfilled') setPlatformStats(dash.value.stats);
        if (stats.status === 'fulfilled') setUserCounts(stats.value as unknown as typeof userCounts);
      } catch {
        setError('Failed to load dashboard. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [router]);

  async function loadTab(tab: Tab) {
    setActiveTab(tab);
    if (tab === 'users' && !usersLoaded) {
      try {
        setAllUsers(await getSuperadminUsers());
        setUsersLoaded(true);
      } catch { flash('Failed to load users.'); }
    }
    if (tab === 'services' && !servicesLoaded) {
      try {
        setServices(await listServices());
        setServicesLoaded(true);
      } catch { flash('Failed to load services.'); }
    }
  }

  function handleLogout() { clearAuth(); router.replace('/smart-assistant/manage'); }
  function flash(msg: string) { setActionMsg(msg); setTimeout(() => setActionMsg(''), 3500); }

  async function handleToggle(userId: string) {
    try {
      const updated = await toggleUserActive(userId);
      setAllUsers(prev => prev.map(u => u.id === userId ? updated : u));
      flash(updated.is_active ? 'User activated.' : 'User deactivated.');
    } catch (err: unknown) { flash(err instanceof Error ? err.message : 'Action failed.'); }
  }

  async function handleRoleAction(userId: string, action: 'promote-admin' | 'promote-superadmin' | 'demote') {
    try {
      let updated: AuthUser;
      if (action === 'promote-admin') updated = await promoteToAdmin(userId);
      else if (action === 'promote-superadmin') updated = await promoteToSuperadmin(userId);
      else updated = await demoteToUser(userId);
      setAllUsers(prev => prev.map(u => u.id === userId ? updated : u));
      flash('Role updated.');
    } catch (err: unknown) { flash(err instanceof Error ? err.message : 'Action failed.'); }
  }

  async function handleDeleteUser(userId: string) {
    if (!confirm('Delete this user permanently?')) return;
    try {
      await deleteSuperadminUser(userId);
      setAllUsers(prev => prev.filter(u => u.id !== userId));
      flash('User deleted.');
    } catch (err: unknown) { flash(err instanceof Error ? err.message : 'Delete failed.'); }
  }

  async function handleCreateService(e: React.FormEvent) {
    e.preventDefault();
    if (!newSvc.name || !newSvc.assignedEmail) { flash('Name and email are required.'); return; }
    setCreatingService(true);
    try {
      const created = await createService(newSvc);
      setServices(prev => [created, ...prev]);
      setNewSvc({ name: '', assignedEmail: '', storeName: '', storeCategory: '' });
      flash('Service created.');
    } catch (err: unknown) { flash(err instanceof Error ? err.message : 'Create failed.'); }
    finally { setCreatingService(false); }
  }

  async function handleDeleteService(id: string) {
    if (!confirm('Delete this service?')) return;
    try {
      await deleteService(id);
      setServices(prev => prev.filter(s => s._id !== id));
      flash('Service deleted.');
    } catch (err: unknown) { flash(err instanceof Error ? err.message : 'Delete failed.'); }
  }

  const filteredUsers = roleFilter === 'all' ? allUsers : allUsers.filter(u => u.role === roleFilter);

  if (loading) {
    return (
      <div className="sa-dash-loading">
        <div className="sa-spinner" />
        <span>Loading platform dashboard…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sa-dash-page">
        <div className="sa-dash-error">
          <div className="sa-dash-error-title">Something went wrong</div>
          <div>{error}</div>
          <button className="sa-dash-retry-btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const cachedUser = me ?? getUser();

  return (
    <div className="sa-dash-page">
      {/* Top bar */}
      <div className="sa-dash-topbar">
        <div>
          <h1 className="sa-dash-title">Platform Overview</h1>
          <p className="sa-dash-subtitle">Superadmin dashboard · {cachedUser?.email}</p>
        </div>
        <div className="sa-dash-topbar-right">
          {actionMsg && <span className="sa-dash-flash">{actionMsg}</span>}
          <span className="sa-dash-role-badge sa-dash-role-badge--superadmin">superadmin</span>
          <button className="sa-dash-logout-btn" onClick={handleLogout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="sa-dash-tabs">
        {(['overview', 'users', 'services'] as Tab[]).map(t => (
          <button
            key={t}
            className={`sa-dash-tab-btn${activeTab === t ? ' sa-dash-tab-btn--active' : ''}`}
            onClick={() => loadTab(t)}
          >
            {t === 'overview' && '📊 Overview'}
            {t === 'users' && '👥 All Users'}
            {t === 'services' && '🔧 Services'}
          </button>
        ))}
      </div>

      {/* ── Overview tab ── */}
      {activeTab === 'overview' && (
        <div className="sa-dash-stats">
          <div className="sa-stat-card"><div className="sa-stat-label">Total Admins</div><div className="sa-stat-value">{fmt(platformStats?.totalAdmins ?? userCounts?.admins)}</div></div>
          <div className="sa-stat-card"><div className="sa-stat-label">Total Users</div><div className="sa-stat-value">{fmt(platformStats?.totalUsers ?? userCounts?.total_users)}</div></div>
          <div className="sa-stat-card"><div className="sa-stat-label">Active Users</div><div className="sa-stat-value sa-stat-value--accent">{fmt(userCounts?.active_users)}</div></div>
          <div className="sa-stat-card"><div className="sa-stat-label">Inactive Users</div><div className="sa-stat-value">{fmt(userCounts?.inactive_users)}</div></div>
          <div className="sa-stat-card"><div className="sa-stat-label">Total Services</div><div className="sa-stat-value">{fmt(platformStats?.totalServices)}</div></div>
          <div className="sa-stat-card"><div className="sa-stat-label">Active Services</div><div className="sa-stat-value sa-stat-value--accent">{fmt(platformStats?.activeServices)}</div></div>
          <div className="sa-stat-card"><div className="sa-stat-label">Pending Services</div><div className="sa-stat-value">{fmt(platformStats?.pendingServices)}</div></div>
          <div className="sa-stat-card"><div className="sa-stat-label">Regular Users</div><div className="sa-stat-value">{fmt(userCounts?.regular_users)}</div></div>
        </div>
      )}

      {/* ── All Users tab ── */}
      {activeTab === 'users' && (
        <>
          <div className="sa-filter-bar">
            <span className="sa-filter-label">Filter:</span>
            {['all', 'superadmin', 'admin', 'user'].map(r => (
              <button
                key={r}
                className={`sa-filter-btn${roleFilter === r ? ' sa-filter-btn--active' : ''}`}
                onClick={() => setRoleFilter(r)}
              >
                {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
            <span className="sa-filter-count">{filteredUsers.length} shown</span>
          </div>

          <div className="sa-dash-table-wrap">
            {!usersLoaded ? (
              <div className="sa-empty-state">Loading users…</div>
            ) : filteredUsers.length === 0 ? (
              <div className="sa-empty-state">No users found.</div>
            ) : (
              <div className="sa-dash-table-scroll">
                <table className="sa-dash-table">
                  <thead>
                    <tr><th>Name</th><th>Email</th><th>Role</th><th>Active</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div className="sa-table-name">{u.full_name || u.username}</div>
                          <div className="sa-table-username">@{u.username}</div>
                        </td>
                        <td className="sa-table-muted">{u.email}</td>
                        <td><span className={`sa-role-badge sa-role-badge--${u.role}`}>{u.role}</span></td>
                        <td>
                          <span className={`sa-active-badge ${u.is_active ? 'sa-active-badge--green' : 'sa-active-badge--gray'}`}>
                            {u.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="sa-action-row">
                            <button className="sa-btn-sm sa-btn-sm--ghost" onClick={() => handleToggle(u.id)}>
                              {u.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                            {u.role === 'user' && (
                              <button className="sa-btn-sm sa-btn-sm--ghost" onClick={() => handleRoleAction(u.id, 'promote-admin')}>
                                Make Admin
                              </button>
                            )}
                            {u.role === 'admin' && (
                              <>
                                <button className="sa-btn-sm sa-btn-sm--ghost" onClick={() => handleRoleAction(u.id, 'promote-superadmin')}>
                                  Make Superadmin
                                </button>
                                <button className="sa-btn-sm sa-btn-sm--ghost" onClick={() => handleRoleAction(u.id, 'demote')}>
                                  Demote
                                </button>
                              </>
                            )}
                            <button className="sa-btn-sm sa-btn-sm--danger" onClick={() => handleDeleteUser(u.id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Services tab ── */}
      {activeTab === 'services' && (
        <>
          <div className="sa-info-card">
            <p className="sa-info-card-title">Create New Service</p>
            <form className="sa-service-form" onSubmit={handleCreateService}>
              <div className="sa-form-grid">
                <label className="sa-auth-label">
                  Service Name *
                  <input
                    className="sa-auth-input"
                    value={newSvc.name}
                    onChange={e => setNewSvc(p => ({ ...p, name: e.target.value }))}
                    placeholder="My Store Assistant"
                    required
                  />
                </label>
                <label className="sa-auth-label">
                  Admin Email *
                  <input
                    className="sa-auth-input"
                    type="email"
                    value={newSvc.assignedEmail}
                    onChange={e => setNewSvc(p => ({ ...p, assignedEmail: e.target.value }))}
                    placeholder="admin@store.com"
                    required
                  />
                </label>
                <label className="sa-auth-label">
                  Store Name
                  <input
                    className="sa-auth-input"
                    value={newSvc.storeName}
                    onChange={e => setNewSvc(p => ({ ...p, storeName: e.target.value }))}
                    placeholder="Optional"
                  />
                </label>
                <label className="sa-auth-label">
                  Store Category
                  <input
                    className="sa-auth-input"
                    value={newSvc.storeCategory}
                    onChange={e => setNewSvc(p => ({ ...p, storeCategory: e.target.value }))}
                    placeholder="e.g. Electronics"
                  />
                </label>
              </div>
              <button className="sa-btn-primary" type="submit" disabled={creatingService}>
                {creatingService ? 'Creating…' : '+ Create Service'}
              </button>
            </form>
          </div>

          <div className="sa-dash-table-wrap">
            <p className="sa-dash-table-title">All Services ({services.length})</p>
            {!servicesLoaded ? (
              <div className="sa-empty-state">Loading services…</div>
            ) : services.length === 0 ? (
              <div className="sa-empty-state">No services found.</div>
            ) : (
              <div className="sa-dash-table-scroll">
                <table className="sa-dash-table">
                  <thead>
                    <tr><th>Name</th><th>Assigned Email</th><th>Store</th><th>Status</th><th>Admin</th><th>Created</th><th></th></tr>
                  </thead>
                  <tbody>
                    {services.map(s => (
                      <tr key={s._id}>
                        <td><div className="sa-table-name">{s.name}</div></td>
                        <td className="sa-table-muted">{s.assignedEmail || '—'}</td>
                        <td>{s.storeName || '—'}</td>
                        <td>
                          <span className={`sa-active-badge ${s.status === 'active' ? 'sa-active-badge--green' : 'sa-active-badge--gray'}`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="sa-table-muted">
                          {s.adminId && typeof s.adminId === 'object' ? s.adminId.email : '—'}
                        </td>
                        <td className="sa-table-muted">{fmtDate(s.createdAt)}</td>
                        <td>
                          <button className="sa-btn-sm sa-btn-sm--danger" onClick={() => handleDeleteService(s._id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
