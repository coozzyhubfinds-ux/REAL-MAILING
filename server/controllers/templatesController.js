import { getSupabase } from '../utils/supabaseClient.js';
import { sanitizeTemplatePayload } from '../models/Template.js';
import { logError } from '../utils/logger.js';

export const listTemplates = async (_req, res) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from('templates').select('*').order('created_at', { ascending: false });
    if (error) throw error;

    res.json({ success: true, data: { templates: data } });
  } catch (error) {
    logError('Failed to list templates', { error: error.message });
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};

export const getTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();
    const { data, error } = await supabase.from('templates').select('*').eq('id', id).single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    logError('Failed to fetch template', { error: error.message });
    res.status(404).json({ success: false, error: { message: 'Template not found' } });
  }
};

export const createTemplate = async (req, res) => {
  try {
    const supabase = getSupabase();
    const payload = sanitizeTemplatePayload(req.body);
    const { data, error } = await supabase.from('templates').insert(payload).select().single();
    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (error) {
    logError('Failed to create template', { error: error.message });
    res.status(400).json({ success: false, error: { message: error.message } });
  }
};

export const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();
    const payload = sanitizeTemplatePayload(req.body);
    const { data, error } = await supabase.from('templates').update(payload).eq('id', id).select().single();
    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    logError('Failed to update template', { error: error.message });
    res.status(400).json({ success: false, error: { message: error.message } });
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();
    const { error } = await supabase.from('templates').delete().eq('id', id);
    if (error) throw error;

    res.json({ success: true, data: { id } });
  } catch (error) {
    logError('Failed to delete template', { error: error.message });
    res.status(400).json({ success: false, error: { message: error.message } });
  }
};

export default {
  listTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate
};

