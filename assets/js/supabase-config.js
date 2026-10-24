// ============================================================
// (مشكاة) — Konfigurasi Supabase Cloud
// ============================================================

function cleanSupabaseUrl(rawUrl) {
  if (!rawUrl) return '';
  let url = rawUrl.trim();
  url = url.replace(/\/rest\/v1\/?$/i, '');
  url = url.replace(/\/+$/, '');
  return url;
}

const MISYKAH_SUPABASE_CONFIG = {
  url: 'https://wcdobsqpgkjgimxulqkg.supabase.co',
  anonKey: 'sb_publishable_9d09Ze2nj-G4fIrGfGOtXA_pVTkuHwi'
};

function getSupabaseConfig() {
  try {
    const saved = localStorage.getItem('misykah_supabase_credentials');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) {
        return {
          url: cleanSupabaseUrl(parsed.url),
          anonKey: parsed.anonKey.trim()
        };
      }
    }
  } catch(e) {}

  return {
    url: cleanSupabaseUrl(MISYKAH_SUPABASE_CONFIG.url),
    anonKey: MISYKAH_SUPABASE_CONFIG.anonKey.trim()
  };
}

function setSupabaseConfig(url, anonKey) {
  try {
    const config = { url: cleanSupabaseUrl(url), anonKey: anonKey.trim() };
    localStorage.setItem('misykah_supabase_credentials', JSON.stringify(config));
    return true;
  } catch(e) {
    return false;
  }
}
