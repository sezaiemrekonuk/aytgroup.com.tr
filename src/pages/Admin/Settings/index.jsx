import React from 'react';

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-800 font-mono">{value || '—'}</span>
    </div>
  );
}

export default function Settings() {
  const configured = Boolean(process.env.REACT_APP_FIREBASE_PROJECT_ID);

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-2xl text-slate-800">Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Firebase configuration and data management</p>
      </div>

      {/* Firebase status */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-5">
        <h2 className="font-heading font-semibold text-slate-700 mb-4">Firebase Connection</h2>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-2.5 h-2.5 rounded-full ${configured ? 'bg-green-500' : 'bg-red-400'}`} />
          <span className={`text-sm font-medium ${configured ? 'text-green-700' : 'text-red-600'}`}>
            {configured ? 'Connected' : 'Not configured — site data requires Firebase'}
          </span>
        </div>
        {!configured && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
            <p className="font-semibold mb-1">Setup required</p>
            <p>Copy <code className="bg-amber-100 px-1 rounded">.env.example</code> to{' '}
              <code className="bg-amber-100 px-1 rounded">.env.local</code> and fill in your Firebase project credentials.</p>
          </div>
        )}
        <div className="mt-4 space-y-0 divide-y divide-slate-100">
          <InfoRow label="Project ID"         value={process.env.REACT_APP_FIREBASE_PROJECT_ID} />
          <InfoRow label="Auth Domain"        value={process.env.REACT_APP_FIREBASE_AUTH_DOMAIN} />
          <InfoRow label="Storage Bucket"     value={process.env.REACT_APP_FIREBASE_STORAGE_BUCKET} />
        </div>
      </div>

      {/* Help */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-heading font-semibold text-slate-700 mb-3">Firebase Auth Setup</h2>
        <p className="text-sm text-slate-500 mb-3">
          To create an admin account, go to your Firebase Console and add a user under Authentication → Users.
        </p>
        <ol className="text-sm text-slate-600 space-y-1.5 list-decimal list-inside">
          <li>Open Firebase Console → your project</li>
          <li>Go to <strong>Authentication</strong> → <strong>Users</strong></li>
          <li>Click <strong>Add user</strong> and enter email + password</li>
          <li>Use those credentials to log in here</li>
        </ol>
      </div>
    </div>
  );
}
