/**
 * @typedef {Object} Template
 * @property {string} id
 * @property {string} name
 * @property {string} subject
 * @property {string} body
 * @property {string} created_at
 */

export const sanitizeTemplatePayload = (payload = {}) => {
  const result = {
    name: payload.name?.trim() || 'Untitled Template',
    subject: payload.subject?.trim(),
    body: payload.body?.trim()
  };

  if (!result.subject) {
    throw new Error('Subject is required');
  }

  if (!result.body) {
    throw new Error('Body is required');
  }

  return result;
};

export default {
  sanitizeTemplatePayload
};

