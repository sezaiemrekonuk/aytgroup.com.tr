import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { COLLECTIONS, SERVICES } from '../../../constants';

function fromDoc(snap) {
  return { id: snap.id, ...snap.data() };
}

const ICON_OPTIONS = [
  'HardHat', 'City', 'Home', 'Office', 'Factory', 'Wrench',
  'Building', 'Crane', 'Tools', 'Blueprint',
];
const COLOR_OPTIONS = ['accent', 'primary', 'cta'];

const COLOR_PREVIEW = {
  accent:  'bg-accent/20 text-accent',
  primary: 'bg-primary/20 text-primary',
  cta:     'bg-cta/20 text-cta',
};

function EditModal({ service, onSave, onClose }) {
  const [form, setForm] = useState({
    key:         service?.key      ?? '',
    icon:        service?.icon     ?? 'HardHat',
    color:       service?.color    ?? 'accent',
    featured:    service?.featured ?? false,
    order:       service?.order    ?? 1,
    title_tr:    service?.title?.tr ?? '',
    title_en:    service?.title?.en ?? '',
    desc_tr:     service?.desc?.tr  ?? '',
    desc_en:     service?.desc?.en  ?? '',
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!form.key.trim()) { alert('Key is required.'); return; }
    setSaving(true);
    try {
      await onSave({
        key:      form.key.trim().replace(/\s+/g, '_'),
        icon:     form.icon,
        color:    form.color,
        featured: form.featured,
        order:    Number(form.order) || 1,
        title:    { tr: form.title_tr, en: form.title_en },
        desc:     { tr: form.desc_tr,  en: form.desc_en  },
      });
      onClose();
    } catch (e) {
      alert('Save failed: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-xl border border-slate-200 p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <h3 className="font-heading font-semibold text-slate-800 mb-5">
          {service ? 'Edit Service' : 'New Service'}
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Key (unique ID)</label>
              <input
                value={form.key}
                onChange={(e) => setForm((f) => ({ ...f, key: e.target.value }))}
                placeholder="e.g. contracting"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Sort Order</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Icon</label>
              <select
                value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              >
                {ICON_OPTIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Color</label>
              <select
                value={form.color}
                onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              >
                {COLOR_OPTIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Title (TR)</label>
              <input value={form.title_tr} onChange={(e) => setForm((f) => ({ ...f, title_tr: e.target.value }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" placeholder="Türkçe başlık" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Title (EN)</label>
              <input value={form.title_en} onChange={(e) => setForm((f) => ({ ...f, title_en: e.target.value }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" placeholder="English title" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Description (TR)</label>
              <textarea value={form.desc_tr} onChange={(e) => setForm((f) => ({ ...f, desc_tr: e.target.value }))} rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none" placeholder="Türkçe açıklama…" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Description (EN)</label>
              <textarea value={form.desc_en} onChange={(e) => setForm((f) => ({ ...f, desc_en: e.target.value }))} rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none" placeholder="English description…" />
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
              className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${form.featured ? 'bg-accent' : 'bg-slate-200'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform mt-0.5 ${form.featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-sm font-medium text-slate-700">Featured on Services page</span>
          </label>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-[#1A2B3C] hover:bg-[#243A52] rounded-lg transition disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Service'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ServicesAdmin() {
  const [services,  setServices]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [editItem,  setEditItem]  = useState(null);   // null = closed, false = new, object = edit
  const [deleteId,  setDeleteId]  = useState(null);
  const [deleting,  setDeleting]  = useState(false);
  const [seeded,    setSeeded]    = useState(false);

  async function load() {
    setLoading(true);
    try {
      const q = query(collection(db, COLLECTIONS.SERVICES), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setServices(snap.docs.map(fromDoc));
      } else {
        setServices(SERVICES.map((s, i) => ({ ...s, id: s.key, order: i + 1, _fromConstants: true })));
      }
    } catch {
      setServices(SERVICES.map((s, i) => ({ ...s, id: s.key, order: i + 1, _fromConstants: true })));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSave(data) {
    if (editItem && editItem.id && !editItem._fromConstants) {
      await updateDoc(doc(db, COLLECTIONS.SERVICES, editItem.id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } else {
      await addDoc(collection(db, COLLECTIONS.SERVICES), {
        ...data,
        createdAt: serverTimestamp(),
      });
    }
    await load();
  }

  async function handleToggleFeatured(service) {
    if (service._fromConstants) {
      alert('Seed these services to Firestore first (Settings page) to edit them.');
      return;
    }
    await updateDoc(doc(db, COLLECTIONS.SERVICES, service.id), {
      featured: !service.featured,
      updatedAt: serverTimestamp(),
    });
    setServices((prev) =>
      prev.map((s) => s.id === service.id ? { ...s, featured: !s.featured } : s),
    );
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      await deleteDoc(doc(db, COLLECTIONS.SERVICES, deleteId));
      setServices((prev) => prev.filter((s) => s.id !== deleteId));
    } catch (e) {
      alert('Delete failed: ' + e.message);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  async function seedToFirestore() {
    for (const [i, s] of SERVICES.entries()) {
      await addDoc(collection(db, COLLECTIONS.SERVICES), {
        ...s,
        order:     i + 1,
        createdAt: serverTimestamp(),
      });
    }
    setSeeded(true);
    await load();
  }

  const hasSeeded = services.some((s) => !s._fromConstants);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-slate-800">Services</h1>
          <p className="text-slate-500 text-sm mt-0.5">{services.length} services</p>
        </div>
        <div className="flex gap-3">
          {!hasSeeded && (
            <button
              onClick={seedToFirestore}
              className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition"
            >
              Seed to Firestore
            </button>
          )}
          <button
            onClick={() => setEditItem(false)}
            className="inline-flex items-center gap-2 bg-[#1A2B3C] hover:bg-[#243A52] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Service
          </button>
        </div>
      </div>

      {seeded && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700 mb-5">
          Services seeded to Firestore. You can now edit them.
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-7 h-7 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => {
            const title = typeof service.title === 'object'
              ? (service.title.tr ?? service.title.en ?? service.key)
              : (service.key ?? '');
            return (
              <div key={service.id} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold ${COLOR_PREVIEW[service.color] ?? 'bg-slate-100 text-slate-600'}`}>
                    {service.icon?.charAt(0)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleFeatured(service)}
                      className={`text-xs px-2 py-1 rounded font-medium transition ${
                        service.featured
                          ? 'bg-accent/10 text-accent'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {service.featured ? 'Featured' : 'Hidden'}
                    </button>
                  </div>
                </div>
                <p className="font-semibold text-slate-800 text-sm mb-1">{title || service.key}</p>
                <p className="text-xs text-slate-400 mb-4">
                  {typeof service.desc === 'object' ? (service.desc.tr ?? '') : ''}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditItem(service)}
                    className="flex-1 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                  >
                    Edit
                  </button>
                  {!service._fromConstants && (
                    <button
                      onClick={() => setDeleteId(service.id)}
                      className="flex-1 py-1.5 text-xs font-medium bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit/New Modal */}
      {editItem !== null && (
        <EditModal
          service={editItem || null}
          onSave={handleSave}
          onClose={() => setEditItem(null)}
        />
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 w-full max-w-sm shadow-xl">
            <h3 className="font-heading font-semibold text-slate-800 mb-2">Delete service?</h3>
            <p className="text-sm text-slate-500 mb-6">This will remove the service from Firestore.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} disabled={deleting} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">Cancel</button>
              <button onClick={confirmDelete} disabled={deleting} className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition disabled:opacity-60">
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
