// src/components/CookieConsent.tsx
// GDPR/CCPA-compliant cookie consent banner.
// - Blocks all non-essential embeds/scripts until consent is given.
// - Stores consent preference in localStorage (consent-level + per-category opt-ins).
// - "Accept All", "Reject All", "Manage Preferences" controls.
import { useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'ubfsf_cookie_consent';

type Consent = {
  consent_level: 'necessary' | 'functional' | 'marketing';
  categories: { necessary: boolean; functional: boolean; marketing: boolean };
  timestamp: number;
};

const defaultConsent: Consent = {
  consent_level: 'necessary',
  categories: { necessary: true, functional: false, marketing: false },
  timestamp: 0,
};

function loadConsent(): Consent {
  if (typeof window === 'undefined') return defaultConsent;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Consent;
      if (parsed && typeof parsed.categories?.necessary === 'boolean') return parsed;
    }
  } catch { /* ignore */ }
  return defaultConsent;
}

function saveConsent(c: Consent) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(c)); } catch { /* ignore */ }
}

export default function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(loadConsent);
  const [bannerOpen, setBannerOpen] = useState<boolean>(false);

  useEffect(() => {
    if (consent.timestamp === 0) setBannerOpen(true);
  }, []);

  // Release blocked embeds/scripts when consent changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const allowedMarketing = consent.categories.marketing && consent.consent_level === 'marketing';
    const allowedFunctional = consent.categories.functional && consent.consent_level !== 'necessary';
    const effectiveFunctional = allowedFunctional || allowedMarketing;

    // Marketing-blocked tags (YouTube embeds, Beehiiv iframe)
    document.querySelectorAll<HTMLElement>('[data-ubfsf-blocked="marketing"]').forEach(tag => {
      const src = tag.getAttribute('data-ubfsf-src') || tag.getAttribute('src');
      if (allowedMarketing) {
        if (src) tag.setAttribute('src', src);
        tag.removeAttribute('data-ubfsf-blocked');
        tag.removeAttribute('aria-hidden');
      } else {
        if (src && !tag.hasAttribute('data-ubfsf-src')) tag.setAttribute('data-ubfsf-src', src);
        tag.removeAttribute('src');
        tag.setAttribute('data-ubfsf-blocked', 'marketing');
        tag.setAttribute('aria-hidden', 'true');
      }
    });

    // Functional-blocked tags (Beehiiv only, when marketing unchecked but functional=true)
    document.querySelectorAll<HTMLElement>('[data-ubfsf-blocked="functional"]').forEach(tag => {
      if (effectiveFunctional) {
        const src = tag.getAttribute('data-ubfsf-src') || tag.getAttribute('src');
        if (src) tag.setAttribute('src', src);
        tag.removeAttribute('data-ubfsf-blocked');
        tag.removeAttribute('aria-hidden');
      } else {
        const src = tag.getAttribute('src');
        if (src && !tag.hasAttribute('data-ubfsf-src')) tag.setAttribute('data-ubfsf-src', src);
        tag.removeAttribute('src');
        tag.setAttribute('data-ubfsf-blocked', 'functional');
        tag.setAttribute('aria-hidden', 'true');
      }
    });
  }, [consent]);

  const handleAcceptAll = useCallback(() => {
    const next: Consent = { consent_level: 'marketing', categories: { necessary: true, functional: true, marketing: true }, timestamp: Date.now() };
    setConsent(next); saveConsent(next); setBannerOpen(false);
  }, []);

  const handleFunctionalAck = useCallback(() => {
    const next: Consent = { consent_level: 'functional', categories: { ...consent.categories, functional: true }, timestamp: Date.now() };
    setConsent(next); saveConsent(next); setBannerOpen(false);
  }, [consent]);

  const handleMarketingAck = useCallback(() => {
    const next: Consent = { consent_level: 'marketing', categories: { ...consent.categories, functional: true, marketing: true }, timestamp: Date.now() };
    setConsent(next); saveConsent(next); setBannerOpen(false);
  }, [consent]);

  const handleManageOpen = useCallback(() => setBannerOpen(true), []);
  const handleManageClose = useCallback(() => setBannerOpen(false), []);

  const handleRejectAll = useCallback(() => {
    const next: Consent = { consent_level: 'necessary', categories: { necessary: true, functional: false, marketing: false }, timestamp: Date.now() };
    setConsent(next); saveConsent(next); setBannerOpen(false);
  }, []);
  return (
    <>
      {/* Floating banner */}
      {bannerOpen && (
        <div
          className="fixed bottom-4 left-4 right-4 z-50 bg-white dark:bg-[#1a1a1a] border border-stone-200 dark:border-white/10 rounded-xl shadow-lg p-4 max-w-4xl mx-auto md:mx-0"
          role="region"
          aria-label="Cookie consent banner"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              We use essential cookies for site functionality. Optional cookies (analytics, videos, newsletter embeds) are blocked until you consent.{' '}
              <a href="/cookies" className="text-[#D4A017] underline underline-offset-2 hover:no-underline">Read our Cookie Policy</a>
              {' '}and{' '}
              <a href="/privacy" className="text-[#D4A017] underline underline-offset-2 hover:no-underline">Privacy Policy</a>.
            </p>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-transparent text-stone-600 dark:text-stone-300 border border-stone-300 dark:border-white/20 hover:bg-stone-100 dark:hover:bg-white/5 rounded-md transition-colors"
                aria-label="Reject non-essential cookies"
              >
                Reject All
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-[#D4A017] text-black border border-[#D4A017] hover:bg-[#B98A2D] rounded-md transition-colors"
                aria-label="Accept all cookies"
              >
                Accept All
              </button>
              <button
                onClick={handleManageOpen}
                className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-transparent text-[#D4A017] border border-[#D4A017]/40 hover:bg-[#D4A017]/10 rounded-md transition-colors"
                aria-label="Manage cookie preferences"
              >
                Manage
              </button>
            </div>
          </div>
        </div>
      )}

       {/* Manage preferences modal */}
      {bannerOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Manage cookie preferences"
          onClick={e => { if (e.target === e.currentTarget) handleManageClose(); }}
        >
          <div
            className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl max-w-md w-full p-6 border border-stone-200 dark:border-white/10"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-black dark:text-white uppercase tracking-wider">Cookie Preferences</h3>
              <button
                onClick={handleManageClose}
                className="p-1 text-stone-500 hover:text-black dark:hover:text-white transition-colors"
                aria-label="Close preferences"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
              </button>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">
              Choose which optional cookies you want to allow. Essential cookies are always active.
            </p>
            {/* Necessary */}
            <div className="mb-3 p-3 rounded-lg border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-white/5 flex items-start gap-3">
              <div className="w-5 h-5 rounded border-2 border-stone-400 flex-shrink-0 mt-0.5 flex items-center justify-center">
                <input type="checkbox" disabled checked className="w-3 h-3 accent-[#D4A017]" aria-label="Necessary cookies always active" />
              </div>
              <div>
                <p className="text-sm font-bold text-black dark:text-white">Necessary Cookies</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">Required for the site to function. Always active.</p>
              </div>
            </div>
            {/* Functional */}
            <div className="mb-3 p-3 rounded-lg border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-white/5 flex items-start gap-3">
              <div className="w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center" style={{ borderColor: consent.categories.functional ? '#D4A017' : '#cbd5e1' }}>
                <input
                  type="checkbox"
                  checked={consent.categories.functional}
                  onChange={e => {
                    const next: Consent = { consent_level: consent.categories.marketing ? 'marketing' : 'functional', categories: { ...consent.categories, functional: e.target.checked }, timestamp: Date.now() };
                    setConsent(next); saveConsent(next);
                  }}
                  className="w-3 h-3 accent-[#D4A017]"
                  aria-label="Enable functional cookies"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-black dark:text-white">Functional Cookies</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">Remember your preferences and settings.</p>
              </div>
            </div>
            {/* Marketing */}
            <div className="mb-4 p-3 rounded-lg border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-white/5 flex items-start gap-3">
              <div className="w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center" style={{ borderColor: consent.categories.marketing ? '#D4A017' : '#cbd5e1' }}>
                <input
                  type="checkbox"
                  checked={consent.categories.marketing}
                  onChange={e => {
                    const next: Consent = { consent_level: e.target.checked ? 'marketing' : (consent.categories.functional ? 'functional' : 'necessary'), categories: { ...consent.categories, marketing: e.target.checked }, timestamp: Date.now() };
                    setConsent(next); saveConsent(next);
                  }}
                  className="w-3 h-3 accent-[#D4A017]"
                  aria-label="Enable marketing cookies"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-black dark:text-white">Marketing & Analytics Cookies</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">YouTube embeds, analytics, newsletter content.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleFunctionalAck}
                disabled={consent.categories.marketing}
                className="flex-1 px-4 py-2 text-xs font-bold uppercase tracking-widest bg-[#D4A017] text-black rounded-md transition-colors hover:bg-[#B98A2D] disabled:opacity-50"
              >
                Save Functional Only
              </button>
              <button
                onClick={handleMarketingAck}
                className="flex-1 px-4 py-2 text-xs font-bold uppercase tracking-widest bg-transparent text-[#D4A017] border border-[#D4A017] rounded-md transition-colors hover:bg-[#D4A017]/10"
              >
                Save All Preferences
              </button>
              <button
                onClick={handleManageClose}
                className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-transparent text-stone-600 dark:text-stone-300 border border-stone-300 dark:border-white/20 rounded-md transition-colors hover:bg-stone-100 dark:hover:bg-white/5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
