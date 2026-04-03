import React, { useEffect, useState } from 'react';
import { getContacts, updateContactStatus, deleteContact } from '../../../services/contactAdminService';

const STATUS_STYLES = {
  new:     { badge: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500' },
  read:    { badge: 'bg-slate-100 text-slate-500',  dot: 'bg-slate-400' },
  replied: { badge: 'bg-green-100 text-green-700',  dot: 'bg-green-500' },
};

function formatDate(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ContactsAdmin() {
  const [contacts,   setContacts]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [filter,     setFilter]     = useState('all');
  const [expanded,   setExpanded]   = useState(null);
  const [deleteId,   setDeleteId]   = useState(null);
  const [deleting,   setDeleting]   = useState(false);

  useEffect(() => {
    getContacts()
      .then(setContacts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function markStatus(id, status) {
    await updateContactStatus(id, status);
    setContacts((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      await deleteContact(deleteId);
      setContacts((prev) => prev.filter((c) => c.id !== deleteId));
      if (expanded === deleteId) setExpanded(null);
    } catch (e) {
      alert('Delete failed: ' + e.message);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  const newCount     = contacts.filter((c) => c.status === 'new').length;
  const readCount    = contacts.filter((c) => c.status === 'read').length;
  const repliedCount = contacts.filter((c) => c.status === 'replied').length;

  const filtered = filter === 'all'
    ? contacts
    : contacts.filter((c) => c.status === filter);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl text-slate-800">Contacts</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          {contacts.length} total — {newCount} new
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { key: 'all',     label: `All (${contacts.length})` },
          { key: 'new',     label: `New (${newCount})` },
          { key: 'read',    label: `Read (${readCount})` },
          { key: 'replied', label: `Replied (${repliedCount})` },
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

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-7 h-7 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">No contacts found.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((contact) => {
              const s = STATUS_STYLES[contact.status] ?? STATUS_STYLES.read;
              const isOpen = expanded === contact.id;
              return (
                <div key={contact.id}>
                  {/* Row */}
                  <div
                    className={`flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-slate-50 transition ${
                      contact.status === 'new' ? 'bg-blue-50/40' : ''
                    }`}
                    onClick={() => {
                      setExpanded(isOpen ? null : contact.id);
                      if (!isOpen && contact.status === 'new') markStatus(contact.id, 'read');
                    }}
                  >
                    {/* Dot */}
                    <div className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-bold text-xs">
                        {contact.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-slate-800">{contact.name}</p>
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${s.badge}`}>
                          {contact.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate">{contact.email}</p>
                    </div>
                    <div className="hidden md:block text-xs text-slate-600 font-medium max-w-[160px] truncate">
                      {contact.subject}
                    </div>
                    <div className="hidden sm:block text-xs text-slate-400 shrink-0">
                      {formatDate(contact.createdAt)}
                    </div>
                    {/* Chevron */}
                    <svg
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>

                  {/* Expanded content */}
                  {isOpen && (
                    <div className="px-6 pb-5 bg-slate-50 border-t border-slate-100">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 mb-4 text-sm">
                        <div>
                          <p className="text-xs font-semibold text-slate-500 mb-0.5">Email</p>
                          <a href={`mailto:${contact.email}`} className="text-accent hover:underline">
                            {contact.email}
                          </a>
                        </div>
                        {contact.phone && (
                          <div>
                            <p className="text-xs font-semibold text-slate-500 mb-0.5">Phone</p>
                            <a href={`tel:${contact.phone}`} className="text-slate-700 hover:underline">
                              {contact.phone}
                            </a>
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-semibold text-slate-500 mb-0.5">Subject</p>
                          <p className="text-slate-700 capitalize">{contact.subject}</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg border border-slate-200 p-4 text-sm text-slate-700 leading-relaxed mb-4">
                        {contact.message}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {contact.status !== 'read' && (
                          <button
                            onClick={() => markStatus(contact.id, 'read')}
                            className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                          >
                            Mark as Read
                          </button>
                        )}
                        {contact.status !== 'replied' && (
                          <button
                            onClick={() => markStatus(contact.id, 'replied')}
                            className="px-3 py-1.5 text-xs font-medium bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition"
                          >
                            Mark as Replied
                          </button>
                        )}
                        <a
                          href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                          className="px-3 py-1.5 text-xs font-medium bg-accent/10 hover:bg-accent/20 text-accent rounded-lg transition"
                        >
                          Reply via Email
                        </a>
                        <button
                          onClick={() => setDeleteId(contact.id)}
                          className="px-3 py-1.5 text-xs font-medium bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition ml-auto"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 w-full max-w-sm shadow-xl">
            <h3 className="font-heading font-semibold text-slate-800 mb-2">Delete message?</h3>
            <p className="text-sm text-slate-500 mb-6">This contact submission will be permanently deleted.</p>
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
