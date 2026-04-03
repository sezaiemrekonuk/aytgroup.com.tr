import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, deleteProject } from '../../../services/projectService';

const STATUS_COLORS = {
  completed: 'bg-green-100 text-green-700',
  ongoing:   'bg-orange-100 text-orange-700',
};
const CATEGORY_COLORS = {
  residential: 'bg-blue-100 text-blue-700',
  commercial:  'bg-purple-100 text-purple-700',
  industrial:  'bg-slate-100 text-slate-700',
};

function Badge({ label, color }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium capitalize ${color}`}>
      {label}
    </span>
  );
}

export default function ProjectsList() {
  const [projects,    setProjects]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [statusFilter,setStatusFilter]= useState('all');
  const [deleteId,    setDeleteId]    = useState(null);
  const [deleting,    setDeleting]    = useState(false);

  function load() {
    setLoading(true);
    getProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteProject(deleteId);
      setProjects((prev) => prev.filter((p) => p.id !== deleteId));
    } catch (e) {
      alert('Delete failed: ' + e.message);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  const filtered = projects.filter((p) => {
    const titleTr = typeof p.title === 'object' ? (p.title.tr ?? '') : (p.title ?? '');
    const matchSearch = titleTr.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-slate-800">Projects</h1>
          <p className="text-slate-500 text-sm mt-0.5">{projects.length} total projects</p>
        </div>
        <Link
          to="/admin/projects/new"
          className="inline-flex items-center gap-2 bg-[#1A2B3C] hover:bg-[#243A52] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Project
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="text"
          placeholder="Search projects…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent w-56"
        />
        <div className="flex rounded-lg border border-slate-200 overflow-hidden text-sm">
          {['all', 'completed', 'ongoing'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 capitalize transition ${
                statusFilter === s
                  ? 'bg-[#1A2B3C] text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-7 h-7 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">No projects found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left">
                  <th className="px-4 py-3 font-semibold text-slate-600 w-12">#</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Title</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 hidden sm:table-cell">Category</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Status</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">Featured</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((project, i) => {
                  const title = typeof project.title === 'object'
                    ? (project.title.tr ?? project.title.en ?? '')
                    : (project.title ?? '');
                  return (
                    <tr key={project.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {project.heroImage && (
                            <img
                              src={project.heroImage}
                              alt=""
                              className="w-10 h-8 object-cover rounded hidden sm:block"
                            />
                          )}
                          <span className="font-medium text-slate-800 line-clamp-1">{title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <Badge
                          label={project.category}
                          color={CATEGORY_COLORS[project.category] ?? 'bg-slate-100 text-slate-600'}
                        />
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <Badge
                          label={project.status}
                          color={STATUS_COLORS[project.status] ?? 'bg-slate-100 text-slate-600'}
                        />
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {project.featured ? (
                          <span className="text-accent text-xs font-medium">Yes</span>
                        ) : (
                          <span className="text-slate-400 text-xs">No</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/projects/${project.id}`}
                            className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => setDeleteId(project.id)}
                            className="px-3 py-1.5 text-xs font-medium bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 w-full max-w-sm shadow-xl">
            <h3 className="font-heading font-semibold text-slate-800 mb-2">Delete project?</h3>
            <p className="text-sm text-slate-500 mb-6">
              This action cannot be undone. The project will be permanently removed from Firestore.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition disabled:opacity-60"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
