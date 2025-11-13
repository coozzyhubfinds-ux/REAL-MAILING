import { getSupabase } from '../utils/supabaseClient.js';
import { logError } from '../utils/logger.js';

export const getAnalytics = async (_req, res) => {
  try {
    const supabase = getSupabase();

    const [{ count: leadsCount }, { count: emailsCount }, { data: emailLogs }] = await Promise.all([
      supabase.from('leads').select('*', { count: 'exact', head: true }),
      supabase.from('emails').select('*', { count: 'exact', head: true }),
      supabase.from('emails').select('status, sent_at, replied_at, opened_at, lead_id').order('sent_at', { ascending: false }).limit(20)
    ]);

    const opens = emailLogs?.filter((log) => log.opened_at)?.length || 0;
    const replies = emailLogs?.filter((log) => log.replied_at)?.length || 0;
    const openRate = emailsCount ? opens / emailsCount : 0;
    const replyRate = emailsCount ? replies / emailsCount : 0;

    res.json({
      success: true,
      data: {
        totals: {
          leads: leadsCount || 0,
          emailsSent: emailsCount || 0,
          opens,
          replies
        },
        openRate,
        replyRate,
        recentActivity: (emailLogs || []).map((log) => ({
          type: log.status || 'email_sent',
          leadId: log.lead_id,
          timestamp: log.sent_at
        }))
      }
    });
  } catch (error) {
    logError('Failed to load analytics', { error: error.message });
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};

export default {
  getAnalytics
};

