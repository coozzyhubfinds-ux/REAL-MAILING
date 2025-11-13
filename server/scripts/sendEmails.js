import { fileURLToPath } from 'url';
import path from 'path';

import { getSupabase } from '../utils/supabaseClient.js';
import { logError, logInfo } from '../utils/logger.js';
import { previewForLead } from '../utils/emailFormatter.js';
import { generateIntro } from '../services/aiService.js';
import { sendWithDelay } from '../services/gmailService.js';

export const runCampaignSend = async (campaignId) => {
  const supabase = getSupabase();

  const { data: campaign, error: campaignError } = await supabase.from('campaigns').select('*').eq('id', campaignId).single();
  if (campaignError || !campaign) {
    throw new Error('Campaign not found');
  }

  const { data: template, error: templateError } = await supabase.from('templates').select('*').eq('id', campaign.template_id).single();
  if (templateError || !template) {
    throw new Error('Template not found');
  }

  const { data: leads, error: leadsError } = await supabase.from('leads').select('*').in('id', campaign.lead_ids);
  if (leadsError) {
    throw leadsError;
  }

  const messages = [];
  for (const lead of leads) {
    const personalIntro = await generateIntro(lead);
    const { subject, body } = previewForLead(template, lead, personalIntro);
    messages.push({
      to: lead.email,
      subject,
      text: body,
      html: body.replace(/\n/g, '<br/>'),
      leadId: lead.id,
      campaignId: campaign.id
    });
  }

  const summary = await sendWithDelay(messages);

  const contactedLeadIds = leads.map((lead) => lead.id);
  if (contactedLeadIds.length) {
    await supabase.from('leads').update({ status: 'contacted', last_contacted: new Date().toISOString() }).in('id', contactedLeadIds);
  }

  await supabase.from('campaigns').update({
    schedule: {
      ...(campaign.schedule || {}),
      lastRunAt: new Date().toISOString(),
      lastSummary: summary
    }
  }).eq('id', campaign.id);

  return {
    campaignId: campaign.id,
    attempted: summary.attempted,
    sent: summary.sent,
    failed: summary.failed,
    errors: summary.errors
  };
};

const isMainModule = () => {
  const __filename = fileURLToPath(import.meta.url);
  return process.argv[1] && path.resolve(process.argv[1]) === __filename;
};

if (isMainModule()) {
  const campaignId = process.argv[2];
  if (!campaignId) {
    console.error('Usage: node scripts/sendEmails.js <campaignId>');
    process.exit(1);
  }

  runCampaignSend(campaignId)
    .then((summary) => {
      logInfo('Campaign send summary', summary);
      process.exit(0);
    })
    .catch((error) => {
      logError('Campaign send failed', { error: error.message });
      process.exit(1);
    });
}

