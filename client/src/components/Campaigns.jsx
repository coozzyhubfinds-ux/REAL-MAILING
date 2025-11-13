import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  getTemplates,
  getLeads,
  createCampaign,
  sendCampaign,
  previewCampaign
} from '../utils/api.js';

const Campaigns = ({ apiUrl }) => {
  const [templates, setTemplates] = useState([]);
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({ name: '', templateId: '', leadIds: [], schedule: { batchSize: 20 } });
  const [preview, setPreview] = useState([]);
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  const [campaignId, setCampaignId] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [{ templates: tplList }, { leads: leadsList }] = await Promise.all([
          getTemplates(apiUrl),
          getLeads(apiUrl)
        ]);
        setTemplates(tplList || []);
        setLeads(leadsList || []);
      } catch (error) {
        console.error('Failed to load campaign data', error);
      }
    };
    loadData();
  }, [apiUrl]);

  const toggleLeadSelection = (id) => {
    setForm((prev) => {
      const set = new Set(prev.leadIds);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return { ...prev, leadIds: Array.from(set) };
    });
    setCampaignId(null);
  };

  const handleCreate = async () => {
    try {
      const { campaign } = await createCampaign(apiUrl, form);
      setCampaignId(campaign.id);
      setStatus(`Campaign saved: ${campaign.id}`);
    } catch (error) {
      setStatus(error.response?.data?.error?.message || 'Failed to create campaign');
    }
  };

  const handlePreview = async () => {
    try {
      let activeId = campaignId;
      if (!activeId) {
        const { campaign } = await createCampaign(apiUrl, form);
        activeId = campaign.id;
        setCampaignId(activeId);
      }
      const data = await previewCampaign(apiUrl, activeId, { limit: 3 });
      setPreview(data.previews || []);
      setStatus(`Preview generated for campaign ${activeId}`);
    } catch (error) {
      setStatus(error.response?.data?.error?.message || error.message);
    }
  };

  const handleSend = async () => {
    if (!form.templateId || form.leadIds.length === 0) {
      setStatus('Select a template and at least one lead.');
      return;
    }

    setSending(true);
    try {
      let activeId = campaignId;
      if (!activeId) {
        const { campaign } = await createCampaign(apiUrl, form);
        activeId = campaign.id;
        setCampaignId(activeId);
      }
      const summary = await sendCampaign(apiUrl, activeId);
      setStatus(`Send complete: ${summary.sent} sent / ${summary.failed} failed`);
    } catch (error) {
      setStatus(error.response?.data?.error?.message || 'Failed to send campaign');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">Campaign Builder</h2>
        <p className="text-sm text-white/60">Select leads and templates, then launch your outreach with staggered pink-glow flair.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="card lg:col-span-2 p-5 space-y-4">
          <label className="flex flex-col text-sm">
            Campaign Name
            <input
              className="mt-2 rounded-lg bg-midnight px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neonPink/60"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                setCampaignId(null);
              }}
            />
          </label>
          <label className="flex flex-col text-sm">
            Template
            <select
              className="mt-2 rounded-lg bg-midnight px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neonPink/60"
              value={form.templateId}
              onChange={(e) => {
                setForm({ ...form, templateId: e.target.value });
                setCampaignId(null);
              }}
            >
              <option value="">Select Template</option>
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>{tpl.name}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-sm">
            Batch Size
            <input
              type="number"
              min={1}
              className="mt-2 rounded-lg bg-midnight px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neonPink/60"
              value={form.schedule.batchSize || 20}
              onChange={(e) => {
                setForm({ ...form, schedule: { ...form.schedule, batchSize: Number(e.target.value) } });
                setCampaignId(null);
              }}
            />
          </label>
          <button
            onClick={handleSend}
            disabled={sending}
            className="w-full rounded-full bg-gradient-to-r from-neonPink to-electricPink px-5 py-3 text-sm font-semibold shadow-glow hover:brightness-110 disabled:opacity-60"
          >
            {sending ? 'Sending...' : 'Send Now'}
          </button>
          <button
            onClick={handleCreate}
            className="w-full rounded-full border border-neonPink/50 px-5 py-3 text-sm text-electricPink hover:bg-neonPink/10"
          >
            {campaignId ? 'Update Campaign' : 'Save Campaign'}
          </button>
          <button
            onClick={handlePreview}
            className="w-full rounded-full border border-slateGray/60 px-5 py-3 text-sm text-white/70 hover:bg-slateGray/50"
          >
            Generate Previews
          </button>
        </div>

        <div className="card lg:col-span-3 p-5 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-electricPink/80">Select Leads</h3>
          <div className="grid gap-3 max-h-[380px] overflow-auto pr-1 md:grid-cols-2">
            {leads.map((lead) => {
              const isSelected = form.leadIds.includes(lead.id);
              return (
                <button
                  key={lead.id}
                  onClick={() => toggleLeadSelection(lead.id)}
                  className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                    isSelected
                      ? 'border-neonPink/80 bg-neonPink/15 text-electricPink'
                      : 'border-slateGray/50 bg-midnight/60 text-white/70 hover:text-white'
                  }`}
                >
                  <p className="font-semibold">{lead.name || lead.email}</p>
                  <p className="text-xs text-white/50">{lead.platform || 'Unknown'} • {lead.channel_name || 'No channel'}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {status && <div className="rounded-xl border border-neonPink/40 bg-neonPink/10 px-4 py-3 text-sm text-electricPink">{status}</div>}

      {preview.length > 0 && (
        <div className="grid gap-6 md:grid-cols-3">
          {preview.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-5"
            >
              <p className="text-xs uppercase text-electricPink/80">Lead {item.leadId.slice(0, 6)}</p>
              <p className="mt-2 text-sm font-semibold text-white">{item.subject}</p>
              <pre className="mt-3 whitespace-pre-wrap text-xs text-white/70">{item.body}</pre>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Campaigns;

