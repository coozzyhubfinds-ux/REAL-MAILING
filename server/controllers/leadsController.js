import { getSupabase } from '../utils/supabaseClient.js';
import { sanitizeLeadPayload } from '../models/Lead.js';
import { logError } from '../utils/logger.js';

export const listLeads = async (req, res) => {
  try {
    const { limit = 100, status, search } = req.query;
    const supabase = getSupabase();
    let query = supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(Number(limit));

    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,channel_name.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json({ success: true, data: { leads: data } });
  } catch (error) {
    logError('Failed to list leads', { error: error.message });
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};

export const createLead = async (req, res) => {
  try {
    const supabase = getSupabase();
    const payload = sanitizeLeadPayload(req.body);

    const { data, error } = await supabase.from('leads').insert(payload).select().single();
    if (error) throw error;

    res.status(201).json({ success: true, data: data });
  } catch (error) {
    logError('Failed to create lead', { error: error.message });
    res.status(400).json({ success: false, error: { message: error.message } });
  }
};

export const importLeads = async (leads) => {
  const supabase = getSupabase();
  const inserted = [];
  const duplicates = [];

  for (const entry of leads) {
    try {
      const payload = sanitizeLeadPayload(entry);
    const { data, error } = await supabase.from('leads').insert(payload).select().single();
    if (error) {
      if (error.code === '23505') {
        duplicates.push(payload.email);
      } else {
        throw error;
      }
    } else {
      inserted.push(data);
    }
    } catch (error) {
      duplicates.push(entry.email);
    }
  }

  return { inserted: inserted.length, duplicates: duplicates.length };
};

export const updateLead = async (req, res) => {
  try {
    const supabase = getSupabase();
    const { id } = req.params;
    const payload = req.body;
    const { data, error } = await supabase.from('leads').update(payload).eq('id', id).select().single();
    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    logError('Failed to update lead', { error: error.message });
    res.status(400).json({ success: false, error: { message: error.message } });
  }
};

export const deleteLead = async (req, res) => {
  try {
    const supabase = getSupabase();
    const { id } = req.params;
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) throw error;

    res.json({ success: true, data: { id } });
  } catch (error) {
    logError('Failed to delete lead', { error: error.message });
    res.status(400).json({ success: false, error: { message: error.message } });
  }
};

export default {
  listLeads,
  createLead,
  importLeads,
  updateLead,
  deleteLead
};

