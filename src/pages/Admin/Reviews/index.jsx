import React, { useEffect, useState } from 'react';
import { getReviews, addReview, updateReview, deleteReview } from '../../../services/reviewService';

function Stars({ rating, onRate }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onRate && onRate(n)}
          className={`w-5 h-5 transition ${
            n <= rating ? 'text-accent' : 'text-slate-200'
          } ${onRate ? 'hover:text-accent cursor-pointer' : 'cursor-default'}`}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

const EMPTY_FORM = { name: '', role: '', content: '', rating: 5, status: 'approved' };

function ReviewModal({ review, onSave, onClose }) {
  const [form,   setForm]   = useState(review ? { ...review } : { ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!form.name.trim() || !form.content.trim()) {
      alert('Name and content are required.');
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (e) {
      alert('Save failed: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-xl border border-slate-200 p-6 w-full max-w-md shadow-xl">
        <h3 className="font-heading font-semibold text-slate-800 mb-5">
          {review ? 'Edit Review' : 'Add Review'}
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Client name"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Role / Company</label>
              <input
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                placeholder="CEO, AnyCompany Ltd."
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Review *</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              rows={4}
              placeholder="What did the client say…"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-2 block">Rating</label>
              <Stars rating={form.rating} onRate={(r) => setForm((f) => ({ ...f, rating: r }))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30"
              >
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-[#1A2B3C] hover:bg-[#243A52] rounded-lg transition disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Review'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsAdmin() {
  const [reviews,  setReviews]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [modal,    setModal]    = useState(null);  // null=closed, false=new, object=edit
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [filter,   setFilter]   = useState('all');

  useEffect(() => {
    getReviews()
      .then(setReviews)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(data) {
    if (modal && modal.id) {
      await updateReview(modal.id, data);
      setReviews((prev) => prev.map((r) => r.id === modal.id ? { ...r, ...data } : r));
    } else {
      const id = await addReview(data);
      setReviews((prev) => [{ id, ...data }, ...prev]);
    }
  }

  async function toggleStatus(review) {
    const next = review.status === 'approved' ? 'pending' : 'approved';
    await updateReview(review.id, { status: next });
    setReviews((prev) => prev.map((r) => r.id === review.id ? { ...r, status: next } : r));
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      await deleteReview(deleteId);
      setReviews((prev) => prev.filter((r) => r.id !== deleteId));
    } catch (e) {
      alert('Delete failed: ' + e.message);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  const approvedCount = reviews.filter((r) => r.status === 'approved').length;
  const pendingCount  = reviews.filter((r) => r.status === 'pending').length;

  const filtered = filter === 'all' ? reviews : reviews.filter((r) => r.status === filter);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-slate-800">Reviews</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {reviews.length} total — {approvedCount} approved · {pendingCount} pending
          </p>
        </div>
        <button
          onClick={() => setModal(false)}
          className="inline-flex items-center gap-2 bg-[#1A2B3C] hover:bg-[#243A52] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Review
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5">
        {[
          { key: 'all',      label: `All (${reviews.length})` },
          { key: 'approved', label: `Approved (${approvedCount})` },
          { key: 'pending',  label: `Pending (${pendingCount})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              filter === t.key
                ? 'bg-[#1A2B3C] text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600 mb-5">
          {error} — Make sure Firebase is configured.
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-7 h-7 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 text-center py-16 text-slate-400 text-sm">
          No reviews found. Add the first one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((review) => (
            <div
              key={review.id}
              className={`bg-white rounded-xl border p-5 ${
                review.status === 'approved' ? 'border-slate-200' : 'border-orange-200 bg-orange-50/30'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <Stars rating={review.rating} />
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                  review.status === 'approved'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {review.status}
                </span>
              </div>
              <blockquote className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-4">
                "{review.content}"
              </blockquote>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <span className="text-accent font-bold text-xs">
                    {review.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{review.name}</p>
                  {review.role && <p className="text-xs text-slate-400">{review.role}</p>}
                </div>
              </div>
              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setModal(review)}
                  className="flex-1 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleStatus(review)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition ${
                    review.status === 'approved'
                      ? 'bg-orange-50 hover:bg-orange-100 text-orange-600'
                      : 'bg-green-50 hover:bg-green-100 text-green-600'
                  }`}
                >
                  {review.status === 'approved' ? 'Unpublish' : 'Approve'}
                </button>
                <button
                  onClick={() => setDeleteId(review.id)}
                  className="px-2.5 py-1.5 text-xs font-medium bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal !== null && (
        <ReviewModal
          review={modal || null}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 w-full max-w-sm shadow-xl">
            <h3 className="font-heading font-semibold text-slate-800 mb-2">Delete review?</h3>
            <p className="text-sm text-slate-500 mb-6">This review will be permanently deleted.</p>
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
