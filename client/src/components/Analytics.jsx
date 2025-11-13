import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAnalytics } from '../utils/api.js';

const Analytics = ({ apiUrl }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getAnalytics(apiUrl);
        setStats(response);
      } catch (error) {
        console.error('Failed to load analytics', error);
      }
    };
    load();
  }, [apiUrl]);

  if (!stats) {
    return <div className="text-white/70">Loading analytics...</div>;
  }

  const totals = stats.totals || {};

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Analytics Overview</h2>
        <p className="text-sm text-white/60">Monitor campaign performance metrics in real-time.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Leads', value: totals.leads },
          { label: 'Emails Sent', value: totals.emailsSent },
          { label: 'Opens', value: totals.opens },
          { label: 'Replies', value: totals.replies }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card p-6"
          >
            <p className="text-xs uppercase tracking-widest text-electricPink/80">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{stat.value || 0}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-lg font-semibold">Engagement Rates</h3>
          <div className="mt-4 grid gap-4">
            <div>
              <p className="text-sm text-white/60">Open Rate</p>
              <div className="mt-2 h-3 w-full rounded-full bg-midnight/60">
                <div className="h-full rounded-full bg-gradient-to-r from-neonPink to-electricPink" style={{ width: `${(stats.openRate * 100).toFixed(0)}%` }} />
              </div>
              <p className="mt-1 text-sm font-semibold text-white">{(stats.openRate * 100).toFixed(0)}%</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Reply Rate</p>
              <div className="mt-2 h-3 w-full rounded-full bg-midnight/60">
                <div className="h-full rounded-full bg-gradient-to-r from-electricPink to-neonPink" style={{ width: `${(stats.replyRate * 100).toFixed(0)}%` }} />
              </div>
              <p className="mt-1 text-sm font-semibold text-white">{(stats.replyRate * 100).toFixed(0)}%</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold">Recent Email Activity</h3>
          <div className="mt-4 space-y-3">
            {stats.recentActivity?.length ? stats.recentActivity.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-xl bg-midnight/60 px-4 py-3 text-sm">
                <span className="capitalize text-white">{item.type.replace('_', ' ')}</span>
                <span className="text-xs text-white/60">{new Date(item.timestamp).toLocaleString()}</span>
              </div>
            )) : <p className="text-sm text-white/60">No email activity yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

