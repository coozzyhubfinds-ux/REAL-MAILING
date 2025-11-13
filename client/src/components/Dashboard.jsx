import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAnalytics, getLeads } from '../utils/api.js';

const statCards = [
  { key: 'leads', label: 'Total Leads' },
  { key: 'emailsSent', label: 'Emails Sent' },
  { key: 'opens', label: 'Opens' },
  { key: 'replies', label: 'Replies' }
];

const Dashboard = ({ apiUrl }) => {
  const [stats, setStats] = useState({ totals: {}, openRate: 0, replyRate: 0, recentActivity: [] });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [analytics, leadsResponse] = await Promise.all([
          getAnalytics(apiUrl),
          getLeads(apiUrl, { limit: 5 })
        ]);

        setStats(analytics);
        setRecentLeads(leadsResponse.leads || []);
      } catch (error) {
        console.error('Dashboard load failed', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [apiUrl]);

  if (loading) {
    return <div className="text-white/70">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ key, label }, index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card p-6"
          >
            <p className="text-sm uppercase tracking-widest text-electricPink/90">{label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">
              {stats.totals?.[key] ?? 0}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card xl:col-span-2 p-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <div className="flex gap-3 text-sm text-white/70">
              <span>Open Rate: {(stats.openRate * 100).toFixed(0)}%</span>
              <span>Reply Rate: {(stats.replyRate * 100).toFixed(0)}%</span>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {stats.recentActivity?.length ? (
              stats.recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-xl bg-midnight/60 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold capitalize">{activity.type.replace('_', ' ')}</p>
                    <p className="text-xs text-white/60">{new Date(activity.timestamp).toLocaleString()}</p>
                  </div>
                  <span className="rounded-full bg-neonPink/20 px-3 py-1 text-xs text-electricPink">Lead {activity.leadId?.slice(0, 6) ?? 'N/A'}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-white/60">No activity yet. Send your first campaign!</p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold">Latest Leads</h3>
          <div className="mt-4 space-y-3">
            {recentLeads.length ? recentLeads.map((lead) => (
              <div key={lead.id} className="rounded-xl bg-midnight/60 px-4 py-3">
                <p className="text-sm font-semibold">{lead.name || lead.email}</p>
                <p className="text-xs text-white/60">{lead.channel_name || 'No channel specified'}</p>
              </div>
            )) : <p className="text-sm text-white/60">No leads yet.</p>}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

