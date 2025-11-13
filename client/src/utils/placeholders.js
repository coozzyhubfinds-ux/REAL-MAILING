const placeholderKeys = ['name', 'email', 'channel_name', 'platform', 'personal_intro', 'recent_video_url'];

export const fillTemplate = (template = '', data = {}) => {
  let output = template;
  placeholderKeys.forEach((key) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'gi');
    output = output.replace(regex, data[key] ?? '');
  });
  return output.replace(/{{\s*[\w.-]+\s*}}/g, '');
};

export default {
  fillTemplate
};

