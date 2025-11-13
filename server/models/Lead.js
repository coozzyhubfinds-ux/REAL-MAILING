/**
 * @typedef {Object} Lead
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} channel_name
 * @property {string} platform
 * @property {string} recent_video_url
 * @property {string} status
 * @property {string} last_contacted
 * @property {Object} metadata
 * @property {string} created_at
 */

export const sanitizeLeadPayload = (payload = {}) => {
  const result = {
    name: payload.name?.trim() || null,
    email: payload.email?.trim(),
    channel_name: payload.channel_name?.trim() || null,
    platform: payload.platform?.trim() || null,
    recent_video_url: payload.recent_video_url?.trim() || null,
    status: payload.status?.trim() || 'new',
    metadata: payload.metadata || {}
  };

  if (!result.email) {
    throw new Error('Email is required');
  }

  return result;
};

export default {
  sanitizeLeadPayload
};

