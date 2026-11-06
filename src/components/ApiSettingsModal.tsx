import React, { useState, useEffect } from 'react';
import { X, Check, Link2, RefreshCw, AlertCircle, Database, CheckCircle2 } from 'lucide-react';
import { env } from '../config/env';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUrlUpdated: () => void;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
  isOpen,
  onClose,
  onUrlUpdated,
}) => {
  const [apiUrl, setApiUrl] = useState<string>('');
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setApiUrl(env.getApiUrl());
      setSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    env.setApiUrl(apiUrl);
    setSaved(true);
    onUrlUpdated();
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    env.setApiUrl('');
    setApiUrl('');
    setSaved(true);
    onUrlUpdated();
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  const isConfigured = Boolean(apiUrl && apiUrl.trim().length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md">
      <div className="glass-panel rounded-3xl border border-white/90 bg-white/90 backdrop-blur-2xl shadow-2xl max-w-lg w-full p-6 relative animate-in fade-in zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center shadow-2xs">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Google Apps Script Backend URL</h3>
            <p className="text-xs text-slate-500">Configure connection to your single Web App endpoint</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="input-api-url" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Web App Deployment URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Link2 className="w-4 h-4 text-slate-400" />
              </div>
              <input
                id="input-api-url"
                type="url"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="glass-input w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-mono text-slate-900 outline-none transition"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Can also be permanently set in your environment as <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-700">VITE_ANYFIX_API_URL</code>.
            </p>
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-100/80 rounded-xl text-xs text-slate-700 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-[#1D4ED8] shrink-0" />
              <span>Status: {isConfigured ? 'Live Connection Connected' : 'API URL Not Configured'}</span>
            </div>
            <p className="text-[11px] text-slate-600">
              {isConfigured
                ? 'The frontend makes live HTTP calls directly to your deployed Apps Script.'
                : 'Please provide your Google Apps Script Web App deployment URL.'}
            </p>
          </div>

          {saved && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-medium">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Configuration saved successfully!</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            {isConfigured && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition cursor-pointer"
              >
                Reset to Default
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="glass-btn-primary px-5 py-2 rounded-xl text-white text-xs font-bold transition cursor-pointer"
            >
              Save Endpoint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
