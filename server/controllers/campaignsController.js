import { getSupabase } from '../utils/supabaseClient.js';
import { sanitizeCampaignPayload } from '../models/Campaign.js';
import { logError } from '../utils/logger.js';
import { previewForLead } from '../utils/emailFormatter.js';
import { generateIntro } from '../services/aiService.js';
import { runCampaignSend } from '../scripts/sendEmails.js';

export const createCampaign = async (req, res) => {
  try {
    const payload = sanitizeCampaignPayload(req.body);
    const supabase = getSupabase();
    const { data, error } = await supabase.from('campaigns').insert({
      name: payload.name,
      template_id: payload.template_id,
      lead_ids: payload.lead_ids,
      schedule: payload.schedule
    }).select().single();
    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (error) {
    logError('Failed to create campaign', { error: error.message });
    res.status(400).json({ success: false, error: { message: error.message } });
  }
};

export const getCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();
    const { data: campaign, error } = await supabase.from('campaigns').select('*').eq('id', id).single();
    if (error) throw error;

    const { data: emailLogs } = await supabase.from('emails').select('*').eq('campaign_id', id);

    res.json({
      success: true,
      data: {
        campaign,
        emails: emailLogs || []
      }
    });
  } catch (error) {
    logError('Failed to fetch campaign', { error: error.message });
    res.status(404).json({ success: false, error: { message: 'Campaign not found' } });
  }
};

export const sendCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await runCampaignSend(id);
    res.json({ success: true, data: result });
  } catch (error) {
    logError('Failed to send campaign', { error: error.message });
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};

export const previewCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 3 } = req.body;
    const supabase = getSupabase();

    const { data: campaign, error: campaignError } = await supabase.from('campaigns').select('*').eq('id', id).single();
    if (campaignError || !campaign) throw new Error('Campaign not found');

    const { data: template, error: templateError } = await supabase.from('templates').select('*').eq('id', campaign.template_id).single();
    if (templateError || !template) throw new Error('Template not found');

    const { data: leads, error: leadsError } = await supabase.from('leads').select('*').in('id', campaign.lead_ids).limit(Number(limit));
    if (leadsError) throw leadsError;

    const previews = [];
    for (const lead of leads) {
      const personalIntro = await generateIntro(lead);
      const { subject, body } = previewForLead(template, lead, personalIntro);
      previews.push({ leadId: lead.id, subject, body });
    }

    res.json({ success: true, data: { previews } });
  } catch (error) {
    logError('Failed to preview campaign', { error: error.message });
    res.status(400).json({ success: false, error: { message: error.message } });
  }
};

export default {
  createCampaign,
  getCampaign,
  sendCampaign,
  previewCampaign
};

