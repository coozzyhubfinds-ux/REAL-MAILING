/**
 * @typedef {Object} Campaign
 * @property {string} id
 * @property {string} name
 * @property {string} template_id
 * @property {string[]} lead_ids
 * @property {Object} schedule
 * @property {string} created_at
 */

export const sanitizeCampaignPayload = (payload = {}) => {
  const result = {
    name: payload.name?.trim() || 'Untitled Campaign',
    template_id: payload.templateId || payload.template_id,
    lead_ids: Array.isArray(payload.leadIds || payload.lead_ids) ? [...new Set(payload.leadIds || payload.lead_ids)] : [],
    schedule: payload.schedule || {}
  };

  if (!result.template_id) {
    throw new Error('templateId is required');
  }

  if (result.lead_ids.length === 0) {
    throw new Error('At least one leadId is required');
  }

  return result;
};

export default {
  sanitizeCampaignPayload
};

