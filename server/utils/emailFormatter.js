const safeGet = (obj, key) => {
  const value = obj?.[key];
  return value == null ? '' : String(value);
};

const PLACEHOLDERS = ['name', 'email', 'channel_name', 'platform', 'personal_intro', 'recent_video_url'];

export const fillTemplate = (templateString = '', data = {}) => {
  let output = templateString;

  PLACEHOLDERS.forEach((placeholder) => {
    const regex = new RegExp(`{{\\s*${placeholder}\\s*}}`, 'gi');
    output = output.replace(regex, safeGet(data, placeholder));
  });

  // Remove any remaining {{ unknown }} placeholders
  output = output.replace(/{{\s*[\w.-]+\s*}}/g, '');

  return output;
};

export const previewForLead = (template, lead, personalIntro = '') => {
  const subject = fillTemplate(template.subject, { ...lead, personal_intro: personalIntro });
  const body = fillTemplate(template.body, { ...lead, personal_intro: personalIntro });
  return { subject, body };
};

export default {
  fillTemplate,
  previewForLead
};

