import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  getLeads,
  updateLead,
  deleteLead,
  importLeadsCsv
} from '../utils/api.js';

const LeadsTable = ({ apiUrl }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [selected, setSelected] = useState(new Set());
  const [message, setMessage] = useState('');

  const loadLeads = async (params = {}) => {
    setLoading(true);
    try {
      const response = await getLeads(apiUrl, params);
      setLeads(response.leads || []);
    } catch (error) {
      console.error('Failed to load leads', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [apiUrl]);

  const handleSearch = async (event) => {
    const value = event.target.value;
    setSearch(value);
    await loadLeads({ search: value });
  };

  const startEdit = (lead) => {
    setEditingId(lead.id);
    setForm(lead);
  };

  const saveEdit = async () => {
    try {
      await updateLead(apiUrl, editingId, form);
      setEditingId(null);
      await loadLeads({ search });
    } catch (error) {
      console.error('Failed to update lead', error);
    }
  };

  const removeLead = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    await deleteLead(apiUrl, id);
    await loadLeads({ search });
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const result = await importLeadsCsv(apiUrl, file);
      setMessage(`Imported ${result.inserted} leads, ${result.duplicates} duplicates skipped.`);
      await loadLeads();
    } catch {
      setMessage('Failed to import leads.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Leads</h2>
          <p className="text-sm text-white/60">Manage your creator pipeline, bulk import, and quick-edit details.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 rounded-full border border-neonPink/30 px-4 py-2 text-sm text-electricPink hover:border-neonPink">
            Import CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
          </label>
          <input
            value={search}
            onChange={handleSearch}
            placeholder="Search..."
            className="rounded-full bg-midnight px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-neonPink/60"
          />
        </div>
      </div>

      {message && <p className="rounded-xl bg-electricPink/10 px-4 py-2 text-sm text-electricPink">{message}</p>}

      <div className="overflow-hidden rounded-2xl border border-slateGray/60 bg-slateGray/40">
        <table className="w-full text-left text-sm">
          <thead className="bg-midnight/60 uppercase text-white/50 tracking-wider text-xs">
            <tr>
              <th className="px-5 py-4">Select</th>
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Email</th>
              <th className="px-5 py-4">Channel</th>
              <th className="px-5 py-4">Platform</th>
              <th className="px-5 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-6 text-center text-white/60">Loading leads...</td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-6 text-center text-white/60">No leads found.</td>
              </tr>
            ) : (
              leads.map((lead, idx) => (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="border-t border-slateGray/50 hover:bg-midnight/40"
                >
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      checked={selected.has(lead.id)}
                      onChange={() => toggleSelect(lead.id)}
                      className="h-4 w-4 accent-neonPink"
                    />
                  </td>
                  <td className="px-5 py-4">
                    {editingId === lead.id
                      ? <input className="w-full rounded bg-midnight px-3 py-2" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                      : <span>{lead.name || '—'}</span>}
                  </td>
                  <td className="px-5 py-4 text-electricPink">{lead.email}</td>
                  <td className="px-5 py-4">
                    {editingId === lead.id
                      ? <input className="w-full rounded bg-midnight px-3 py-2" value={form.channel_name || ''} onChange={(e) => setForm({ ...form, channel_name: e.target.value })} />
                      : lead.channel_name || '—'}
                  </td>
                  <td className="px-5 py-4">
                    {editingId === lead.id
                      ? <input className="w-full rounded bg-midnight px-3 py-2" value={form.platform || ''} onChange={(e) => setForm({ ...form, platform: e.target.value })} />
                      : lead.platform || '—'}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {editingId === lead.id ? (
                      <div className="flex justify-end gap-3">
                        <button onClick={() => setEditingId(null)} className="text-xs text-white/60 hover:text-white">Cancel</button>
                        <button onClick={saveEdit} className="text-xs text-electricPink hover:text-neonPink">Save</button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-3">
                        <button onClick={() => startEdit(lead)} className="text-xs text-white/60 hover:text-white">Edit</button>
                        <button onClick={() => removeLead(lead.id)} className="text-xs text-red-300 hover:text-red-200">Delete</button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-neonPink/20 bg-neonPink/10 px-5 py-3 text-sm text-electricPink">
        Selected leads: {selected.size || 0} — ready to add into campaigns from the Campaigns page.
      </div>
    </div>
  );
};

export default LeadsTable;

