// ============================================================
// (مشكاة) — Supabase Hybrid Client Engine
// ============================================================
// Menyediakan komunikasi real-time cloud dengan fallback otomatis
// ke database lokal jika Supabase belum dikonfigurasi.

let _supabaseClient = null;

function initSupabaseClient() {
  if (_supabaseClient) return _supabaseClient;
  const config = typeof getSupabaseConfig === 'function' ? getSupabaseConfig() : null;
  if (!config || !config.url || !config.anonKey) return null;

  if (window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      _supabaseClient = window.supabase.createClient(config.url, config.anonKey);
      console.log('[Misykah Cloud] Berhasil terhubung ke Supabase! 🚀');
      return _supabaseClient;
    } catch(err) {
      console.warn('[Misykah Cloud] Gagal inisialisasi Supabase:', err);
      return null;
    }
  }
  return null;
}

const MisykahCloud = {
  isReady() {
    return initSupabaseClient() !== null;
  },

  getClient() {
    return initSupabaseClient();
  },

  // ── FAIDAH ILMIAH ──────────────────────────────────────────
  faidah: {
    async getAll() {
      const client = initSupabaseClient();
      if (!client) {
        // Fallback lokal
        const local = JSON.parse(localStorage.getItem('misykah_guest_faidah') || '[]');
        return local.map(f => {
          const rawTags = Array.isArray(f.tags) ? f.tags : [];
          const likes = rawTags.filter(t => typeof t === 'string' && t.startsWith('like:')).map(t => t.replace('like:', ''));
          const cleanTags = rawTags.filter(t => typeof t === 'string' && !t.startsWith('like:'));
          return {
            ...f,
            tags: cleanTags,
            likes: likes,
            likesCount: likes.length
          };
        });
      }
      try {
        const { data, error } = await client
          .from('faidah')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(f => {
          const rawTags = Array.isArray(f.tags) ? f.tags : [];
          const likes = rawTags.filter(t => typeof t === 'string' && t.startsWith('like:')).map(t => t.replace('like:', ''));
          const cleanTags = rawTags.filter(t => typeof t === 'string' && !t.startsWith('like:'));
          return {
            id: f.id,
            userId: f.user_id,
            authorName: f.author_name,
            judul: f.judul,
            kategori: f.kategori,
            arabicText: f.arabic_text,
            isi: f.isi,
            sumber: f.sumber,
            tags: cleanTags,
            likes: likes,
            likesCount: likes.length,
            isPinned: !!f.is_pinned,
            tanggal: f.created_at ? f.created_at.split('T')[0] : todayStr()
          };
        });
      } catch (err) {
        console.warn('[Misykah Cloud] Faidah fetch error, fallback ke lokal:', err);
        const local = JSON.parse(localStorage.getItem('misykah_guest_faidah') || '[]');
        return local.map(f => {
          const rawTags = Array.isArray(f.tags) ? f.tags : [];
          const likes = rawTags.filter(t => typeof t === 'string' && t.startsWith('like:')).map(t => t.replace('like:', ''));
          const cleanTags = rawTags.filter(t => typeof t === 'string' && !t.startsWith('like:'));
          return {
            ...f,
            tags: cleanTags,
            likes: likes,
            likesCount: likes.length
          };
        });
      }
    },

    async insert(item) {
      const client = initSupabaseClient();
      // Siapkan tags kombinasi (clean tags + likes)
      const cleanTags = Array.isArray(item.tags) ? item.tags.filter(t => !t.startsWith('like:')) : [];
      const likesList = Array.isArray(item.likes) ? item.likes.map(u => `like:${u}`) : [];
      const combinedTags = [...cleanTags, ...likesList];

      if (!client) {
        const local = JSON.parse(localStorage.getItem('misykah_guest_faidah') || '[]');
        const idx = local.findIndex(x => x.id === item.id);
        const savedItem = { ...item, tags: cleanTags, likes: item.likes || [], likesCount: (item.likes || []).length };
        if (idx !== -1) local[idx] = savedItem;
        else local.unshift(savedItem);
        localStorage.setItem('misykah_guest_faidah', JSON.stringify(local));
        return savedItem;
      }
      try {
        const row = {
          id: item.id,
          user_id: item.userId || null,
          author_name: item.authorName || 'Santri Misykah',
          judul: item.judul,
          kategori: item.kategori,
          arabic_text: item.arabicText || null,
          isi: item.isi,
          sumber: item.sumber || null,
          tags: combinedTags,
          is_pinned: !!item.isPinned
        };
        const { error } = await client.from('faidah').upsert([row]);
        if (error) throw error;
        return item;
      } catch(err) {
        console.error('[Misykah Cloud] Faidah upsert error:', err);
        throw err;
      }
    },

    async toggleLike(id, userId) {
      if (!userId) return false;
      const client = initSupabaseClient();
      const likeKey = `like:${userId}`;

      if (!client) {
        let local = JSON.parse(localStorage.getItem('misykah_guest_faidah') || '[]');
        const f = local.find(x => x.id === id);
        if (f) {
          if (!Array.isArray(f.likes)) f.likes = [];
          const idx = f.likes.indexOf(userId);
          if (idx !== -1) f.likes.splice(idx, 1);
          else f.likes.push(userId);
          f.likesCount = f.likes.length;
          localStorage.setItem('misykah_guest_faidah', JSON.stringify(local));
        }
        return true;
      }

      try {
        const { data: current, error: fetchErr } = await client.from('faidah').select('tags').eq('id', id).single();
        if (fetchErr) throw fetchErr;

        let tags = (current && Array.isArray(current.tags)) ? [...current.tags] : [];
        const idx = tags.indexOf(likeKey);
        if (idx !== -1) {
          tags.splice(idx, 1);
        } else {
          tags.push(likeKey);
        }

        const { error: updateErr } = await client.from('faidah').update({ tags }).eq('id', id);
        if (updateErr) throw updateErr;
        return true;
      } catch(err) {
        console.error('[Misykah Cloud] Faidah toggleLike error:', err);
        return false;
      }
    },

    async delete(id) {
      const client = initSupabaseClient();
      if (!client) {
        let local = JSON.parse(localStorage.getItem('misykah_guest_faidah') || '[]');
        local = local.filter(x => x.id !== id);
        localStorage.setItem('misykah_guest_faidah', JSON.stringify(local));
        return true;
      }
      const { error } = await client.from('faidah').delete().eq('id', id);
      if (error) console.error('[Misykah Cloud] Faidah delete error:', error);
      return !error;
    }
  },

  // ── GRUP KELAS ─────────────────────────────────────────────
  classes: {
    async getAll() {
      const client = initSupabaseClient();
      if (!client) {
        return getGlobalData('classes');
      }
      try {
        const { data, error } = await client
          .from('classes')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(c => ({
          id: c.id,
          nama: c.nama,
          pemateri: c.pemateri,
          kode: c.kode,
          link: c.link,
          creatorName: c.creator_name,
          creatorId: c.creator_id,
          anggota: c.anggota || []
        }));
      } catch(err) {
        console.warn('[Misykah Cloud] Classes fetch error:', err);
        return getGlobalData('classes');
      }
    },

    async insert(item) {
      const client = initSupabaseClient();
      if (!client) {
        const local = getGlobalData('classes');
        local.unshift(item);
        saveGlobalData('classes', local);
        return item;
      }
      const row = {
        id: item.id,
        nama: item.nama,
        pemateri: item.pemateri,
        kode: item.kode,
        link: item.link || null,
        creator_name: item.creatorName,
        creator_id: item.creatorId || null,
        anggota: item.anggota || []
      };
      const { error } = await client.from('classes').insert([row]);
      if (error) throw error;
      return item;
    },

    async join(id, studentName) {
      const client = initSupabaseClient();
      if (!client) {
        let local = getGlobalData('classes');
        const c = local.find(x => x.id === id);
        if (c && !c.anggota.includes(studentName)) {
          c.anggota.push(studentName);
          saveGlobalData('classes', local);
        }
        return true;
      }
      const { data: current } = await client.from('classes').select('anggota').eq('id', id).single();
      const anggota = (current && current.anggota) || [];
      if (!anggota.includes(studentName)) {
        anggota.push(studentName);
        await client.from('classes').update({ anggota }).eq('id', id);
      }
      return true;
    },

    async delete(id) {
      const client = initSupabaseClient();
      if (!client) {
        saveGlobalData('classes', getGlobalData('classes').filter(x => x.id !== id));
        return true;
      }
      const { error } = await client.from('classes').delete().eq('id', id);
      return !error;
    }
  },

  // ── RUANG HALAQAH ──────────────────────────────────────────
  halaqah: {
    async getAll() {
      const client = initSupabaseClient();
      if (!client) return getGlobalData('halaqah_rooms');
      try {
        const { data, error } = await client
          .from('halaqah')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(h => ({
          id: h.id,
          judul: h.judul,
          materi: h.materi,
          waktu: h.waktu,
          max: h.max_participants || 8,
          link: h.link,
          status: h.status || 'upcoming',
          deskripsi: h.deskripsi,
          creatorName: h.creator_name,
          participants: h.participants || []
        }));
      } catch(err) {
        console.warn('[Misykah Cloud] Halaqah fetch error:', err);
        return getGlobalData('halaqah_rooms');
      }
    },

    async insert(item) {
      const client = initSupabaseClient();
      if (!client) {
        const local = getGlobalData('halaqah_rooms');
        local.unshift(item);
        saveGlobalData('halaqah_rooms', local);
        return item;
      }
      const row = {
        id: item.id,
        judul: item.judul,
        materi: item.materi,
        waktu: item.waktu,
        max_participants: item.max,
        link: item.link || null,
        status: item.status || 'upcoming',
        deskripsi: item.deskripsi || null,
        creator_name: item.creatorName,
        participants: item.participants || []
      };
      const { error } = await client.from('halaqah').insert([row]);
      if (error) throw error;
      return item;
    },

    async toggleJoin(id, studentName, max) {
      const client = initSupabaseClient();
      if (!client) {
        let local = getGlobalData('halaqah_rooms');
        const h = local.find(x => x.id === id);
        if (!h) return false;
        const idx = h.participants.indexOf(studentName);
        if (idx !== -1) h.participants.splice(idx, 1);
        else {
          if (h.participants.length >= (max || h.max)) return 'full';
          h.participants.push(studentName);
        }
        saveGlobalData('halaqah_rooms', local);
        return true;
      }
      const { data: h } = await client.from('halaqah').select('participants, max_participants').eq('id', id).single();
      if (!h) return false;
      const list = h.participants || [];
      const idx = list.indexOf(studentName);
      if (idx !== -1) {
        list.splice(idx, 1);
      } else {
        if (list.length >= (h.max_participants || max || 8)) return 'full';
        list.push(studentName);
      }
      await client.from('halaqah').update({ participants: list }).eq('id', id);
      return true;
    },

    async delete(id) {
      const client = initSupabaseClient();
      if (!client) {
        saveGlobalData('halaqah_rooms', getGlobalData('halaqah_rooms').filter(x => x.id !== id));
        return true;
      }
      const { error } = await client.from('halaqah').delete().eq('id', id);
      return !error;
    }
  },

  // ── PARTNER TASMI' ─────────────────────────────────────────
  tasmi: {
    async getAll() {
      const client = initSupabaseClient();
      if (!client) return getGlobalData('tasmi_requests');
      try {
        const { data, error } = await client
          .from('tasmi_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(t => ({
          id: t.id,
          materi: t.materi,
          waktu: t.waktu,
          catatan: t.catatan,
          requesterName: t.requester_name,
          requesterId: t.requester_id,
          partnerName: t.partner_name,
          status: t.status
        }));
      } catch(err) {
        console.warn('[Misykah Cloud] Tasmi fetch error:', err);
        return getGlobalData('tasmi_requests');
      }
    },

    async insert(item) {
      const client = initSupabaseClient();
      if (!client) {
        const local = getGlobalData('tasmi_requests');
        local.unshift(item);
        saveGlobalData('tasmi_requests', local);
        return item;
      }
      const row = {
        id: item.id,
        materi: item.materi,
        waktu: item.waktu,
        catatan: item.catatan || null,
        requester_name: item.requesterName,
        requester_id: item.requesterId || null,
        partner_name: item.partnerName || null,
        status: item.status || 'open'
      };
      const { error } = await client.from('tasmi_requests').insert([row]);
      if (error) throw error;
      return item;
    },

    async accept(id, partnerName) {
      const client = initSupabaseClient();
      if (!client) {
        let local = getGlobalData('tasmi_requests');
        const t = local.find(x => x.id === id);
        if (t) {
          t.partnerName = partnerName;
          t.status = 'matched';
          saveGlobalData('tasmi_requests', local);
        }
        return true;
      }
      const { error } = await client
        .from('tasmi_requests')
        .update({ partner_name: partnerName, status: 'matched' })
        .eq('id', id);
      return !error;
    },

    async delete(id) {
      const client = initSupabaseClient();
      if (!client) {
        saveGlobalData('tasmi_requests', getGlobalData('tasmi_requests').filter(x => x.id !== id));
        return true;
      }
      const { error } = await client.from('tasmi_requests').delete().eq('id', id);
      return !error;
    }
  },

  // ── FORUM SANTRI ───────────────────────────────────────────
  forum: {
    async getAll() {
      const client = initSupabaseClient();
      if (!client) return getGlobalData('forum_questions');
      try {
        const { data: questions, error } = await client
          .from('forum_questions')
          .select('*, forum_answers(*)')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return (questions || []).map(q => ({
          id: q.id,
          topik: q.topik,
          pertanyaan: q.pertanyaan,
          authorName: q.author_name,
          authorId: q.author_id,
          tanggal: q.created_at ? q.created_at.split('T')[0] : todayStr(),
          answers: (q.forum_answers || []).map(a => ({
            id: a.id,
            authorName: a.author_name,
            text: a.text,
            tanggal: a.created_at ? a.created_at.split('T')[0] : todayStr()
          }))
        }));
      } catch(err) {
        console.warn('[Misykah Cloud] Forum fetch error:', err);
        return getGlobalData('forum_questions');
      }
    },

    async insertQuestion(item) {
      const client = initSupabaseClient();
      if (!client) {
        const local = getGlobalData('forum_questions');
        local.unshift(item);
        saveGlobalData('forum_questions', local);
        return item;
      }
      const row = {
        id: item.id,
        topik: item.topik,
        pertanyaan: item.pertanyaan,
        author_name: item.authorName,
        author_id: item.authorId || null
      };
      const { error } = await client.from('forum_questions').insert([row]);
      if (error) throw error;
      return item;
    },

    async insertAnswer(questionId, authorName, text) {
      const client = initSupabaseClient();
      if (!client) {
        let local = getGlobalData('forum_questions');
        const q = local.find(x => x.id === questionId);
        if (q) {
          if (!q.answers) q.answers = [];
          q.answers.push({ authorName, text, tanggal: todayStr() });
          saveGlobalData('forum_questions', local);
        }
        return true;
      }
      const row = {
        id: generateId(),
        question_id: questionId,
        author_name: authorName,
        text: text
      };
      const { error } = await client.from('forum_answers').insert([row]);
      return !error;
    },

    async deleteQuestion(id) {
      const client = initSupabaseClient();
      if (!client) {
        saveGlobalData('forum_questions', getGlobalData('forum_questions').filter(x => x.id !== id));
        return true;
      }
      const { error } = await client.from('forum_questions').delete().eq('id', id);
      return !error;
    }
  },

  // ── REALTIME SUBSCRIPTION ──────────────────────────────────
  subscribe(table, onChange) {
    const client = initSupabaseClient();
    if (!client) return null;
    try {
      const channel = client
        .channel(`public:${table}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: table }, payload => {
          console.log(`[Misykah Realtime] Update pada tabel ${table}:`, payload);
          if (typeof onChange === 'function') onChange(payload);
        })
        .subscribe();
      return channel;
    } catch(err) {
      console.warn('[Misykah Cloud] Realtime subscription error:', err);
      return null;
    }
  },

  // ── UI WIDGET: STATUS CLOUD & MODAL PENGATURAN ─────────────
  renderCloudBadge(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const isCloud = this.isReady();
    container.innerHTML = `
      <div style="display:inline-flex;align-items:center;gap:8px;background:${isCloud ? 'rgba(26,92,56,0.12)' : 'rgba(100,100,100,0.1)'};border:1px solid ${isCloud ? 'var(--primary)' : 'var(--cream-dark)'};border-radius:20px;padding:4px 12px;font-size:0.78rem;">
        <span>${isCloud ? '🟢 Cloud Aktif (Supabase)' : '⚪ Mode Lokal'}</span>
        <button onclick="MisykahCloud.openConfigModal()" style="background:none;border:none;color:var(--primary);cursor:pointer;font-weight:700;padding:0;text-decoration:underline;">
          ⚙️ Pengaturan Cloud
        </button>
      </div>
    `;
  },

  openConfigModal() {
    let modal = document.getElementById('supabaseConfigModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'supabaseConfigModal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal" style="max-width:500px;">
          <div class="modal-header">
            <div class="modal-title">⚡ Hubungkan ke Supabase Cloud</div>
            <button class="modal-close" onclick="closeModal('supabaseConfigModal')">✕</button>
          </div>
          <div style="padding:10px 0 16px;font-size:0.85rem;color:var(--text-muted);line-height:1.5;">
            Dapatkan database online gratis agar santri di seluruh Indonesia bisa saling berkomunikasi, berbagi faidah, dan bergabung ke kelas Anda secara langsung.
          </div>
          <form onsubmit="MisykahCloud.saveConfigFromModal(event)">
            <div class="form-group">
              <label class="form-label">Project URL (Supabase)</label>
              <input type="url" id="cfgSupabaseUrl" class="form-control" placeholder="https://xxxxxxxx.supabase.co" required>
            </div>
            <div class="form-group">
              <label class="form-label">Anon / Public API Key</label>
              <input type="password" id="cfgSupabaseKey" class="form-control" placeholder="eyJhbGciOi..." required>
            </div>
            <div style="background:var(--cream);padding:10px;border-radius:6px;font-size:0.75rem;color:var(--text-dark);margin-bottom:16px;">
              💡 <em>Cara ambil: Buka dashboard Supabase -> Project Settings -> API -> Salin <strong>Project URL</strong> dan <strong>anon public key</strong>.</em>
            </div>
            <div class="flex justify-between gap-1">
              <button type="button" class="btn btn-outline" onclick="closeModal('supabaseConfigModal')">Tutup</button>
              <button type="submit" class="btn btn-primary">Simpan & Hubungkan</button>
            </div>
          </form>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const current = getSupabaseConfig();
    document.getElementById('cfgSupabaseUrl').value = current.url || '';
    document.getElementById('cfgSupabaseKey').value = current.anonKey || '';
    openModal('supabaseConfigModal');
  },

  saveConfigFromModal(e) {
    e.preventDefault();
    const url = document.getElementById('cfgSupabaseUrl').value.trim();
    const key = document.getElementById('cfgSupabaseKey').value.trim();
    setSupabaseConfig(url, key);
    _supabaseClient = null; // reset client
    initSupabaseClient();
    closeModal('supabaseConfigModal');
    showToast('Konfigurasi Cloud berhasil disimpan! Memuat ulang data...', 'success');
    setTimeout(() => window.location.reload(), 1000);
  }
};
