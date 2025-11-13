import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate
} from '../utils/api.js';
import { fillTemplate } from '../utils/placeholders.js';

const defaultTemplate = {
  name: 'Creator Outreach Sample',
  subject: 'Loved {{ channel_name }} on {{ platform }}',
  body: `Hi {{ name }},

{{ personal_intro }}

I think {{ channel_name }} would be a perfect fit for our upcoming campaign.

Best,
Max from LoreLegends Lab`
};

const EmailTemplates = ({ apiUrl }) => {
  const [templates, setTemplates] = useState([]);
  const [active, setActive] = useState(defaultTemplate);
  const [previewData, setPreviewData] = useState({
    name: 'Jamie',
    channel_name: 'Future Tech Daily',
    platform: 'YouTube',
    personal_intro: 'I binged your latest breakdown on AI video editing—stellar insights!'
  });
  const [saving, setSaving] = useState(false);

  const loadTemplates = async () => {
    try {
      const response = await getTemplates(apiUrl);
      setTemplates(response.templates || []);
    } catch (error) {
      console.error('Failed to load templates', error);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, [apiUrl]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (active.id) {
        await updateTemplate(apiUrl, active.id, active);
      } else {
        await createTemplate(apiUrl, active);
      }
      await loadTemplates();
    } catch (error) {
      console.error('Failed to save template', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this template?')) return;
    await deleteTemplate(apiUrl, id);
    setActive(defaultTemplate);
    await loadTemplates();
  };

  const previewSubject = fillTemplate(active.subject, previewData);
  const previewBody = fillTemplate(active.body, previewData);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-2 space-y-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Templates</h2>
            <button
              onClick={() => setActive(defaultTemplate)}
              className="text-xs text-electricPink hover:text-neonPink"
            >
              New Template
            </button>
          </div>
          <div className="mt-3 space-y-3 max-h-[400px] overflow-auto pr-1">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setActive(tpl)}
                className={`w-full rounded-xl border px-3 py-3 text-left text-sm transition ${
                  active.id === tpl.id
                    ? 'border-neonPink/60 bg-neonPink/10 text-electricPink'
                    : 'border-slateGray/40 bg-midnight/60 text-white/70 hover:text-white'
                }`}
              >
                <p className="font-semibold">{tpl.name}</p>
                <p className="text-xs">{tpl.subject}</p>
              </button>
            ))}
            {templates.length === 0 && <p className="text-sm text-white/60">No templates saved yet.</p>}
          </div>
        </div>
        <div className="card p-5 space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-electricPink/80">Preview Data</h3>
          {Object.keys(previewData).map((key) => (
            <label key={key} className="flex flex-col text-xs uppercase tracking-widest text-white/50">
              {key.replace('_', ' ')}
              <input
                value={previewData[key]}
                onChange={(e) => setPreviewData({ ...previewData, [key]: e.target.value })}
                className="mt-1 rounded-lg bg-midnight px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-neonPink/60"
              />
            </label>
          ))}
        </div>
      </div>

      <motion.div className="card lg:col-span-3 p-6 space-y-5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <label className="flex flex-col text-sm">
          Template Name
          <input
            className="mt-2 rounded-lg bg-midnight px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neonPink/60"
            value={active.name || ''}
            onChange={(e) => setActive({ ...active, name: e.target.value })}
          />
        </label>
        <label className="flex flex-col text-sm">
          Subject
          <input
            className="mt-2 rounded-lg bg-midnight px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neonPink/60"
            value={active.subject || ''}
            onChange={(e) => setActive({ ...active, subject: e.target.value })}
          />
        </label>
        <label className="flex flex-col text-sm">
          Body
          <textarea
            rows={10}
            className="mt-2 rounded-lg bg-midnight px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neonPink/60"
            value={active.body || ''}
            onChange={(e) => setActive({ ...active, body: e.target.value })}
          />
        </label>
        <div className="flex justify-between text-xs text-white/50">
          <span>{'Placeholders: {{ }} -> name, email, channel_name, platform, personal_intro, recent_video_url'}</span>
          {active.id && (
            <button onClick={() => handleDelete(active.id)} className="text-red-300 hover:text-red-200">
              Delete
            </button>
          )}
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-gradient-to-r from-neonPink to-electricPink px-5 py-2 text-sm font-semibold shadow-glow hover:brightness-110 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Template'}
          </button>
        </div>
        <div className="rounded-xl border border-neonPink/40 bg-midnight/80 p-5">
          <h4 className="text-sm font-semibold text-electricPink">Preview</h4>
          <p className="mt-2 text-lg font-semibold text-white">{previewSubject}</p>
          <pre className="mt-3 whitespace-pre-wrap text-sm text-white/70">{previewBody}</pre>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailTemplates;

