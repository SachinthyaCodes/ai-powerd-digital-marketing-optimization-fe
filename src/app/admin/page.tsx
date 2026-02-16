'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/services/apiService';

interface Submission {
  id: string;
  form_data: any;
  created_at: string;
  status: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSubmissions, setTotalSubmissions] = useState(0);

  useEffect(() => {
    fetchSubmissions();
    fetchStats();
  }, [currentPage]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSubmissions(currentPage, 10);
      setSubmissions(response.submissions);
      setTotalSubmissions(response.total);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch submissions');
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await apiService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleViewSubmission = (id: string) => {
    router.push(`/results/${id}`);
  };

  const totalPages = Math.ceil(totalSubmissions / 10);

  if (loading && submissions.length === 0) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#22C55E] mx-auto mb-4"></div>
          <p className="text-[#CBD5E1]">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F14]">
      {/* Header */}
      <header className="bg-[#0B0F14] border-b border-[#1F2933]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#F9FAFB]">
                Admin Dashboard
              </h1>
              <p className="text-[#CBD5E1] mt-1 text-sm">
                Manage marketing strategy form submissions
              </p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="w-full sm:w-auto bg-[#22C55E] text-[#0B0F14] px-4 py-2 rounded-lg hover:bg-[#16A34A] transition-colors font-medium whitespace-nowrap"
            >
              New Form
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            <div className="bg-[#0B0F14] border border-[#1F2933] p-4 sm:p-6 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-[#F9FAFB]">{stats.total_submissions}</div>
              <div className="text-xs sm:text-sm text-[#CBD5E1] mt-1">Total Submissions</div>
            </div>
            <div className="bg-[#0B0F14] border border-[#1F2933] p-4 sm:p-6 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-[#22C55E]">{stats.submitted}</div>
              <div className="text-xs sm:text-sm text-[#CBD5E1] mt-1">Submitted</div>
            </div>
            <div className="bg-[#0B0F14] border border-[#1F2933] p-4 sm:p-6 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-blue-500">{stats.processed}</div>
              <div className="text-xs sm:text-sm text-[#CBD5E1] mt-1">Processed</div>
            </div>
            <div className="bg-[#0B0F14] border border-[#1F2933] p-4 sm:p-6 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-orange-500">{stats.pending}</div>
              <div className="text-xs sm:text-sm text-[#CBD5E1] mt-1">Pending</div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-500 mr-3">⚠️</div>
              <div>
                <h3 className="text-red-400 font-medium">Error Loading Data</h3>
                <p className="text-red-300 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submissions Table */}
        <div className="bg-[#0B0F14] border border-[#1F2933] rounded-lg overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-[#1F2933]">
            <h3 className="text-base sm:text-lg font-semibold text-[#F9FAFB]">Recent Submissions</h3>
          </div>
          
          {submissions.length === 0 ? (
            <div className="p-6 text-center">
              <div className="text-[#CBD5E1] text-4xl mb-4">📝</div>
              <h3 className="text-base sm:text-lg font-medium text-[#F9FAFB] mb-2">No Submissions Yet</h3>
              <p className="text-[#CBD5E1] text-sm">Form submissions will appear here once users start submitting data.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-[#1F2933]">
                <thead className="bg-[#0B0F14]">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-[#CBD5E1] uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-[#CBD5E1] uppercase tracking-wider">
                      Business Info
                    </th>
                    <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-[#CBD5E1] uppercase tracking-wider">
                      Language
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-[#CBD5E1] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-[#CBD5E1] uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-[#CBD5E1] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#0B0F14] divide-y divide-[#1F2933]">
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-[#1F2933]/20">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span className="text-xs sm:text-sm font-mono text-[#F9FAFB]">
                          {submission.id.substring(0, 8)}...
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4">
                        <div className="text-xs sm:text-sm text-[#F9FAFB]">
                          {submission.form_data.business_profile?.business_name || 
                           submission.form_data.business_profile?.business_type || 
                           'Unknown Business'}
                        </div>
                        <div className="text-[10px] sm:text-xs text-[#CBD5E1] mt-1 hidden sm:block">
                          {submission.form_data.business_profile?.location || 'Location not specified'}
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-[#F9FAFB]">
                          {submission.form_data.form_language === 'si' ? 'Sinhala' : 
                           submission.form_data.form_language === 'en' ? 'English' : 'Mixed'}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          submission.status === 'submitted' ? 'bg-[#22C55E]/20 text-[#22C55E]' :
                          submission.status === 'processed' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-[#CBD5E1]/20 text-[#CBD5E1]'
                        }`}>
                          {submission.status}
                        </span>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-[#F9FAFB]">
                        {formatDate(submission.created_at)}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                        <button
                          onClick={() => handleViewSubmission(submission.id)}
                          className="text-[#22C55E] hover:text-[#16A34A]"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 sm:px-6 py-4 border-t border-[#1F2933]">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                <div className="text-xs sm:text-sm text-[#CBD5E1]">
                  Page {currentPage} of {totalPages} ({totalSubmissions} total)
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm bg-[#1F2933] border border-[#1F2933] text-[#F9FAFB] rounded-md hover:bg-[#1F2933]/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm bg-[#1F2933] border border-[#1F2933] text-[#F9FAFB] rounded-md hover:bg-[#1F2933]/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}