import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { createLead } from '../utils/api.js';

const initialForm = {
  name: '',
  email: '',
  channel_name: '',
  platform: '',
  recent_video_url: ''
};

const Navbar = ({ onMenuToggle, apiUrl }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await createLead(apiUrl, form);
      setForm(initialForm);
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to save lead');
    } finally {
      setSaving(false);
    }
  };

  return (
    <header className="border-b border-slateGray/60 bg-slateGray/30 backdrop-blur sticky top-0 z-20">
      <div className="mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="md:hidden rounded-full bg-slateGray/60 p-2 text-white hover:bg-slateGray/80 transition"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col"
          >
            <span className="text-sm uppercase tracking-widest text-electricPink">ColdEmail</span>
            <span className="text-2xl font-semibold">Automation Suite</span>
          </motion.div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-neonPink to-electricPink px-4 py-2 text-sm font-semibold shadow-glow transition hover:brightness-110"
          >
            <PlusIcon className="h-5 w-5" />
            Quick Add Lead
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <motion.form
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg space-y-4 rounded-3xl bg-slateGray/80 p-6 shadow-glow"
            onSubmit={handleSubmit}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Add Lead</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-sm text-electricPink hover:text-neonPink"
              >
                Close
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex flex-col text-sm">
                Name
                <input
                  className="mt-1 rounded-lg bg-midnight px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neonPink/60"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label className="flex flex-col text-sm md:col-span-2">
                Email*
                <input
                  required
                  type="email"
                  className="mt-1 rounded-lg bg-midnight px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neonPink/60"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>
              <label className="flex flex-col text-sm">
                Channel
                <input
                  className="mt-1 rounded-lg bg-midnight px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neonPink/60"
                  value={form.channel_name}
                  onChange={(e) => setForm({ ...form, channel_name: e.target.value })}
                />
              </label>
              <label className="flex flex-col text-sm">
                Platform
                <input
                  className="mt-1 rounded-lg bg-midnight px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neonPink/60"
                  value={form.platform}
                  onChange={(e) => setForm({ ...form, platform: e.target.value })}
                />
              </label>
              <label className="flex flex-col text-sm md:col-span-2">
                Recent Video URL
                <input
                  className="mt-1 rounded-lg bg-midnight px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neonPink/60"
                  value={form.recent_video_url}
                  onChange={(e) => setForm({ ...form, recent_video_url: e.target.value })}
                />
              </label>
            </div>
            {error && <p className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-200">{error}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-full border border-slateGray/60 px-4 py-2 text-sm text-white hover:border-neonPink/70"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-gradient-to-r from-neonPink to-electricPink px-5 py-2 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Lead'}
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </header>
  );
};

export default Navbar;

