import OpenAI from 'openai';
import { logError } from '../utils/logger.js';

let client = null;
const { OPENAI_API_KEY } = process.env;

if (OPENAI_API_KEY) {
  client = new OpenAI({ apiKey: OPENAI_API_KEY });
}

export const generateIntro = async (lead = {}) => {
  if (!client) {
    return 'I checked out your channel and loved the latest content!';
  }

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You craft concise, warm intros for cold outreach emails.'
        },
        {
          role: 'user',
          content: `Create a 2 sentence intro for contacting ${lead.name || 'a creator'} who runs ${lead.channel_name || 'a channel'} on ${lead.platform || 'their platform'}.`
        }
      ],
      max_tokens: 80,
      temperature: 0.7
    });

    return response.choices[0]?.message?.content?.trim() || 'I checked out your channel and loved the latest content!';
  } catch (error) {
    logError('OpenAI personalization failed', { error: error.message });
    return 'I checked out your channel and loved the latest content!';
  }
};

export default {
  generateIntro
};

