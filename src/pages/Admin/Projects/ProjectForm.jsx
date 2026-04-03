import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addProject, updateProject, getProject } from '../../../services/projectService';

const EMPTY = {
  title:          { tr: '', en: '', de: '' },
  description:    { tr: '', en: '', de: '' },
  location:       { tr: '', en: '', de: '' },
  category:       'residential',
  status:         'ongoing',
  sqm:            '',
  units:          '',
  startDate:      '',
  completionDate: '',
  heroImage:      '',
  gallery:        ['', '', ''],
  progress:       { foundation: 0, structure: 0, finishing: 0 },
  featured:       false,
  order:          1,
};

function Input({ label, value, onChange, type = 'text', placeholder, min, max }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, rows = 3, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition resize-none"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition bg-white"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <div className="border-b border-slate-200 pb-2 mb-4 mt-8 first:mt-0">
      <h3 className="font-heading font-semibold text-slate-700 text-sm uppercase tracking-wide">{title}</h3>
    </div>
  );
}

function ProgressSlider({ label, value, onChange }) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <label className="text-xs font-semibold text-slate-600 capitalize">{label}</label>
        <span className="text-xs font-bold text-accent">{value}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        step="5"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-amber-600"
      />
    </div>
  );
}

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id) && id !== 'new';

  const [form,    setForm]    = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (!isEdit) return;
    getProject(id)
      .then((project) => {
        if (!project) { setError('Project not found.'); return; }
        // Normalize fields
        const normalize = (field) =>
          typeof field === 'object' && field !== null
            ? field
            : { tr: field ?? '', en: field ?? '', de: '' };

        setForm({
          title:          normalize(project.title),
          description:    normalize(project.description),
          location:       normalize(project.location),
          category:       project.category ?? 'residential',
          status:         project.status ?? 'ongoing',
          sqm:            project.sqm ?? '',
          units:          project.units ?? '',
          startDate:      project.startDate ?? '',
          completionDate: project.completionDate ?? '',
          heroImage:      project.heroImage ?? '',
          gallery:        project.gallery?.length
            ? [...project.gallery, ...Array(3).fill('')].slice(0, Math.max(3, project.gallery.length))
            : ['', '', ''],
          progress: {
            foundation: project.progress?.foundation ?? 0,
            structure:  project.progress?.structure  ?? 0,
            finishing:  project.progress?.finishing  ?? 0,
          },
          featured: project.featured ?? false,
          order:    project.order ?? 1,
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  function setLang(field, lang, value) {
    setForm((f) => ({ ...f, [field]: { ...f[field], [lang]: value } }));
  }

  function setGallery(index, value) {
    setForm((f) => {
      const g = [...f.gallery];
      g[index] = value;
      return { ...f, gallery: g };
    });
  }

  function addGallerySlot() {
    setForm((f) => ({ ...f, gallery: [...f.gallery, ''] }));
  }

  function removeGallerySlot(index) {
    setForm((f) => ({ ...f, gallery: f.gallery.filter((_, i) => i !== index) }));
  }

  function setProgress(key, value) {
    setForm((f) => ({ ...f, progress: { ...f.progress, [key]: value } }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    if (!form.title.tr.trim()) { setError('Turkish title is required.'); return; }

    setSaving(true);
    try {
      const data = {
        ...form,
        sqm:     form.sqm   ? Number(form.sqm)   : null,
        units:   form.units ? Number(form.units)  : null,
        order:   Number(form.order) || 1,
        gallery: form.gallery.filter(Boolean),
        slug:    form.title.tr
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-'),
      };

      if (isEdit) {
        await updateProject(id, data);
      } else {
        await addProject(data);
      }
      navigate('/admin/projects');
    } catch (e) {
      setError('Save failed: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-7 h-7 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/admin/projects')}
          className="text-slate-400 hover:text-slate-700 transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <div>
          <h1 className="font-heading font-bold text-2xl text-slate-800">
            {isEdit ? 'Edit Project' : 'New Project'}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {isEdit ? 'Update project information' : 'Add a new project to the portfolio'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-0">
        {/* ─── Translations ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-5">
          <SectionHeader title="Title" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Turkish (TR) *" value={form.title.tr} onChange={(v) => setLang('title', 'tr', v)} placeholder="Proje adı" />
            <Input label="English (EN)" value={form.title.en} onChange={(v) => setLang('title', 'en', v)} placeholder="Project name" />
            <Input label="German (DE)" value={form.title.de} onChange={(v) => setLang('title', 'de', v)} placeholder="Projektname" />
          </div>

          <SectionHeader title="Description" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Textarea label="Turkish (TR)" value={form.description.tr} onChange={(v) => setLang('description', 'tr', v)} placeholder="Türkçe açıklama…" />
            <Textarea label="English (EN)" value={form.description.en} onChange={(v) => setLang('description', 'en', v)} placeholder="English description…" />
            <Textarea label="German (DE)" value={form.description.de} onChange={(v) => setLang('description', 'de', v)} placeholder="Deutsche Beschreibung…" />
          </div>

          <SectionHeader title="Location" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Turkish (TR)" value={form.location.tr} onChange={(v) => setLang('location', 'tr', v)} placeholder="Şehir, İlçe" />
            <Input label="English (EN)" value={form.location.en} onChange={(v) => setLang('location', 'en', v)} placeholder="City, District" />
            <Input label="German (DE)" value={form.location.de} onChange={(v) => setLang('location', 'de', v)} placeholder="Stadt, Bezirk" />
          </div>
        </div>

        {/* ─── Details ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-5">
          <SectionHeader title="Project Details" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <Select
              label="Category"
              value={form.category}
              onChange={(v) => setForm((f) => ({ ...f, category: v }))}
              options={[
                { value: 'residential', label: 'Residential' },
                { value: 'commercial',  label: 'Commercial' },
                { value: 'industrial',  label: 'Industrial' },
              ]}
            />
            <Select
              label="Status"
              value={form.status}
              onChange={(v) => setForm((f) => ({ ...f, status: v }))}
              options={[
                { value: 'ongoing',   label: 'Ongoing' },
                { value: 'completed', label: 'Completed' },
              ]}
            />
            <Input label="Area (m²)" type="number" value={form.sqm} onChange={(v) => setForm((f) => ({ ...f, sqm: v }))} placeholder="e.g. 32000" />
            <Input label="Units (optional)" type="number" value={form.units} onChange={(v) => setForm((f) => ({ ...f, units: v }))} placeholder="e.g. 180" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date (YYYY-MM)" value={form.startDate} onChange={(v) => setForm((f) => ({ ...f, startDate: v }))} placeholder="2023-06" />
            <Input label="Completion Date (YYYY-MM)" value={form.completionDate} onChange={(v) => setForm((f) => ({ ...f, completionDate: v }))} placeholder="2025-12" />
          </div>
        </div>

        {/* ─── Images ──────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-5">
          <SectionHeader title="Images" />
          <div className="mb-4">
            <Input
              label="Hero Image URL"
              value={form.heroImage}
              onChange={(v) => setForm((f) => ({ ...f, heroImage: v }))}
              placeholder="https://…"
            />
            {form.heroImage && (
              <img src={form.heroImage} alt="Hero preview" className="mt-3 h-32 rounded-lg object-cover w-full" />
            )}
          </div>
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-600">Gallery Images</label>
            {form.gallery.map((url, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setGallery(i, e.target.value)}
                  placeholder={`Image ${i + 1} URL…`}
                  className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
                />
                {form.gallery.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeGallerySlot(i)}
                    className="text-slate-400 hover:text-red-500 transition p-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addGallerySlot}
              className="text-sm text-accent hover:underline"
            >
              + Add image
            </button>
          </div>
        </div>

        {/* ─── Progress ────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-5">
          <SectionHeader title="Construction Progress" />
          <p className="text-xs text-slate-400 mb-4">Used for ongoing projects to show progress stages.</p>
          <div className="space-y-5">
            <ProgressSlider label="Foundation" value={form.progress.foundation} onChange={(v) => setProgress('foundation', v)} />
            <ProgressSlider label="Structure"  value={form.progress.structure}  onChange={(v) => setProgress('structure', v)} />
            <ProgressSlider label="Finishing"  value={form.progress.finishing}  onChange={(v) => setProgress('finishing', v)} />
          </div>
        </div>

        {/* ─── Settings ────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-5">
          <SectionHeader title="Settings" />
          <div className="flex flex-wrap gap-6 items-center">
            <label className="flex items-center gap-3 cursor-pointer">
              <button
                type="button"
                role="switch"
                aria-checked={form.featured}
                onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
                className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                  form.featured ? 'bg-accent' : 'bg-slate-200'
                }`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform mt-0.5 ${
                  form.featured ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
              <span className="text-sm font-medium text-slate-700">Featured on homepage</span>
            </label>
            <div className="w-28">
              <Input
                label="Sort Order"
                type="number"
                value={form.order}
                onChange={(v) => setForm((f) => ({ ...f, order: v }))}
                min="1"
              />
            </div>
          </div>
        </div>

        {/* ─── Actions ─────────────────────────────────────────────────── */}
        <div className="flex gap-3 justify-end pt-2 pb-8">
          <button
            type="button"
            onClick={() => navigate('/admin/projects')}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#1A2B3C] hover:bg-[#243A52] rounded-lg transition disabled:opacity-60"
          >
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}
