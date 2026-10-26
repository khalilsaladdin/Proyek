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

  // ── KALKULATOR JARAK GEOLOKASI (HAVERSINE FORMULA) ────────
  calculateDistanceKm(lat1, lon1, lat2, lon2) {
    if (lat1 === null || lon1 === null || lat2 === null || lon2 === null) return null;
    const l1 = parseFloat(lat1);
    const o1 = parseFloat(lon1);
    const l2 = parseFloat(lat2);
    const o2 = parseFloat(lon2);
    if (isNaN(l1) || isNaN(o1) || isNaN(l2) || isNaN(o2)) return null;

    const R = 6371; // Jari-jari bumi dalam kilometer
    const dLat = (l2 - l1) * Math.PI / 180;
    const dLon = (o2 - o1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(l1 * Math.PI / 180) * Math.cos(l2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c;
    return Math.round(dist * 10) / 10; // 1 angka di belakang koma (contoh: 1.4 km)
  },

  // ── FAIDAH ILMIAH ──────────────────────────────────────────
  faidah: {
    async getAll() {
      const client = initSupabaseClient();
      const parseItem = (f) => {
        const rawTags = Array.isArray(f.tags) ? f.tags : [];
        const likes = rawTags.filter(t => typeof t === 'string' && t.startsWith('like:')).map(t => t.replace('like:', ''));
        const comments = rawTags.filter(t => t && typeof t === 'object' && t.type === 'cmt');
        const photoObj = rawTags.find(t => t && typeof t === 'object' && t.type === 'photo');
        const privacyObj = rawTags.find(t => t && typeof t === 'object' && t.type === 'privacy');
        const cleanTags = rawTags.filter(t => typeof t === 'string' && !t.startsWith('like:') && !t.startsWith('privacy:') && !t.startsWith('photo:'));

        const fotoUrl = f.fotoUrl || f.foto_url || (photoObj ? photoObj.url : null);
        const isPrivate = f.isPrivate !== undefined ? !!f.isPrivate : (privacyObj ? !!privacyObj.isPrivate : rawTags.includes('privacy:private'));

        return {
          id: f.id,
          userId: f.user_id || f.userId,
          authorName: f.author_name || f.authorName,
          judul: f.judul,
          kategori: f.kategori,
          arabicText: f.arabic_text || f.arabicText,
          isi: f.isi,
          sumber: f.sumber,
          fotoUrl: fotoUrl,
          isPrivate: isPrivate,
          tags: cleanTags,
          likes: likes,
          likesCount: likes.length,
          comments: comments,
          commentsCount: comments.length,
          isPinned: !!(f.is_pinned || f.isPinned),
          tanggal: f.created_at ? f.created_at.split('T')[0] : (f.tanggal || todayStr())
        };
      };

      if (!client) {
        // Fallback lokal
        const local = JSON.parse(localStorage.getItem('misykah_guest_faidah') || '[]');
        return local.map(parseItem);
      }
      try {
        const { data, error } = await client
          .from('faidah')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(parseItem);
      } catch (err) {
        console.warn('[Misykah Cloud] Faidah fetch error, fallback ke lokal:', err);
        const local = JSON.parse(localStorage.getItem('misykah_guest_faidah') || '[]');
        return local.map(parseItem);
      }
    },

    async insert(item) {
      const client = initSupabaseClient();
      // Siapkan tags kombinasi (clean tags + likes + comments + photo + privacy)
      const cleanTags = Array.isArray(item.tags) ? item.tags.filter(t => typeof t === 'string' && !t.startsWith('like:') && !t.startsWith('privacy:') && !t.startsWith('photo:')) : [];
      const likesList = Array.isArray(item.likes) ? item.likes.map(u => `like:${u}`) : [];
      const commentsList = Array.isArray(item.comments) ? item.comments : [];
      const combinedTags = [...cleanTags, ...likesList, ...commentsList];
      if (item.fotoUrl) {
        combinedTags.push({ type: 'photo', url: item.fotoUrl });
      }
      if (item.isPrivate) {
        combinedTags.push({ type: 'privacy', isPrivate: true });
      }

      if (!client) {
        const local = JSON.parse(localStorage.getItem('misykah_guest_faidah') || '[]');
        const idx = local.findIndex(x => x.id === item.id);
        const savedItem = { 
          ...item, 
          tags: cleanTags, 
          fotoUrl: item.fotoUrl || null,
          isPrivate: !!item.isPrivate,
          likes: item.likes || [], 
          likesCount: (item.likes || []).length,
          comments: commentsList,
          commentsCount: commentsList.length
        };
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

    async addComment(id, comment) {
      const client = initSupabaseClient();
      const newCmt = {
        type: 'cmt',
        id: generateId(),
        author: comment.author || 'Santri Misykah',
        authorId: comment.authorId || null,
        text: comment.text,
        time: todayStr()
      };

      if (!client) {
        let local = JSON.parse(localStorage.getItem('misykah_guest_faidah') || '[]');
        const f = local.find(x => x.id === id);
        if (f) {
          if (!Array.isArray(f.comments)) f.comments = [];
          f.comments.push(newCmt);
          f.commentsCount = f.comments.length;
          localStorage.setItem('misykah_guest_faidah', JSON.stringify(local));
        }
        return newCmt;
      }

      try {
        const { data: current, error: fetchErr } = await client.from('faidah').select('tags').eq('id', id).single();
        if (fetchErr) throw fetchErr;

        let tags = (current && Array.isArray(current.tags)) ? [...current.tags] : [];
        tags.push(newCmt);

        const { error: updateErr } = await client.from('faidah').update({ tags }).eq('id', id);
        if (updateErr) throw updateErr;
        return newCmt;
      } catch(e) {
        console.error('[Misykah Cloud] Faidah addComment error:', e);
        return false;
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

  // ── RUANG HALAQAH & BELAJAR MANDIRI (PUBLIK / PRIVAT PIN + RANGE JARAK) ────
  halaqah: {
    _parseMetadata(rawDeskripsi, rawLink) {
      let cleanDeskripsi = (rawDeskripsi || '').trim();
      let meta = {
        isPrivate: false,
        kode: '',
        mode: (rawLink && /^https?:\/\//i.test((rawLink || '').trim())) ? 'online' : 'offline',
        lat: null,
        lng: null,
        locationName: ''
      };

      const match = cleanDeskripsi.match(/<!--misykah_meta:(\{.*?\})-->/);
      if (match) {
        try {
          const parsed = JSON.parse(match[1]);
          meta = Object.assign(meta, parsed);
          cleanDeskripsi = cleanDeskripsi.replace(match[0], '').trim();
        } catch(e) {}
      }
      return { deskripsi: cleanDeskripsi, meta };
    },

    _encodeMetadata(deskripsi, meta) {
      const cleanDesc = (deskripsi || '').replace(/<!--misykah_meta:\{.*?\}-->/g, '').trim();
      const metaObj = {
        isPrivate: !!meta.isPrivate,
        kode: meta.kode ? String(meta.kode).trim().toUpperCase() : '',
        mode: meta.mode || 'online',
        lat: (meta.lat !== null && meta.lat !== undefined && meta.lat !== '') ? parseFloat(meta.lat) : null,
        lng: (meta.lng !== null && meta.lng !== undefined && meta.lng !== '') ? parseFloat(meta.lng) : null,
        locationName: meta.locationName ? String(meta.locationName).trim() : ''
      };
      return cleanDesc + '\n<!--misykah_meta:' + JSON.stringify(metaObj) + '-->';
    },

    async getAll() {
      const client = initSupabaseClient();
      if (!client) {
        const local = getGlobalData('halaqah_rooms') || [];
        return local.map(h => {
          const parsed = this._parseMetadata(h.deskripsi, h.link);
          return {
            id: h.id,
            judul: h.judul,
            materi: h.materi,
            waktu: h.waktu,
            max: h.max || h.max_participants || 8,
            link: h.link,
            status: h.status || 'upcoming',
            deskripsi: parsed.deskripsi,
            creatorName: h.creatorName || h.creator_name,
            participants: h.participants || [],
            isPrivate: h.isPrivate !== undefined ? h.isPrivate : parsed.meta.isPrivate,
            kode: h.kode || parsed.meta.kode,
            mode: h.mode || parsed.meta.mode,
            lat: (h.lat !== undefined && h.lat !== null) ? h.lat : parsed.meta.lat,
            lng: (h.lng !== undefined && h.lng !== null) ? h.lng : parsed.meta.lng,
            locationName: h.locationName || parsed.meta.locationName
          };
        });
      }
      try {
        const { data, error } = await client
          .from('halaqah')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(h => {
          const parsed = this._parseMetadata(h.deskripsi, h.link);
          return {
            id: h.id,
            judul: h.judul,
            materi: h.materi,
            waktu: h.waktu,
            max: h.max_participants || 8,
            link: h.link,
            status: h.status || 'upcoming',
            deskripsi: parsed.deskripsi,
            creatorName: h.creator_name,
            participants: h.participants || [],
            isPrivate: parsed.meta.isPrivate,
            kode: parsed.meta.kode,
            mode: parsed.meta.mode,
            lat: parsed.meta.lat,
            lng: parsed.meta.lng,
            locationName: parsed.meta.locationName
          };
        });
      } catch(err) {
        console.warn('[Misykah Cloud] Halaqah fetch error:', err);
        return getGlobalData('halaqah_rooms') || [];
      }
    },

    async insert(item) {
      const client = initSupabaseClient();
      const meta = {
        isPrivate: !!item.isPrivate,
        kode: item.kode || '',
        mode: item.mode || 'online',
        lat: item.lat,
        lng: item.lng,
        locationName: item.locationName || ''
      };
      const encodedDeskripsi = this._encodeMetadata(item.deskripsi, meta);

      if (!client) {
        const local = getGlobalData('halaqah_rooms') || [];
        const toSave = {
          ...item,
          deskripsi: encodedDeskripsi,
          isPrivate: meta.isPrivate,
          kode: meta.kode,
          mode: meta.mode,
          lat: meta.lat,
          lng: meta.lng,
          locationName: meta.locationName
        };
        local.unshift(toSave);
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
        deskripsi: encodedDeskripsi,
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
        let local = getGlobalData('halaqah_rooms') || [];
        const h = local.find(x => x.id === id);
        if (!h) return false;
        if (!Array.isArray(h.participants)) h.participants = [];
        const idx = h.participants.indexOf(studentName);
        if (idx !== -1) h.participants.splice(idx, 1);
        else {
          if (h.participants.length >= (max || h.max || 8)) return 'full';
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

    async joinWithCode(id, studentName, inputCode) {
      const client = initSupabaseClient();
      const codeClean = (inputCode || '').trim().toUpperCase();

      if (!client) {
        let local = getGlobalData('halaqah_rooms') || [];
        const h = local.find(x => x.id === id);
        if (!h) return { success: false, reason: 'not_found' };
        const parsed = this._parseMetadata(h.deskripsi, h.link);
        const expectedCode = (h.kode || parsed.meta.kode || '').trim().toUpperCase();
        if (expectedCode && expectedCode !== codeClean) {
          return { success: false, reason: 'wrong_code' };
        }
        if (!Array.isArray(h.participants)) h.participants = [];
        if (h.participants.length >= (h.max || 8)) return { success: false, reason: 'full' };
        if (!h.participants.includes(studentName)) {
          h.participants.push(studentName);
          saveGlobalData('halaqah_rooms', local);
        }
        return { success: true };
      }

      try {
        const { data: h, error } = await client.from('halaqah').select('*').eq('id', id).single();
        if (error || !h) return { success: false, reason: 'not_found' };
        const parsed = this._parseMetadata(h.deskripsi, h.link);
        const expectedCode = (parsed.meta.kode || '').trim().toUpperCase();
        if (expectedCode && expectedCode !== codeClean) {
          return { success: false, reason: 'wrong_code' };
        }
        const list = h.participants || [];
        if (list.length >= (h.max_participants || 8)) return { success: false, reason: 'full' };
        if (!list.includes(studentName)) {
          list.push(studentName);
          await client.from('halaqah').update({ participants: list }).eq('id', id);
        }
        return { success: true };
      } catch(err) {
        console.error('[Misykah Cloud] joinWithCode error:', err);
        return { success: false, reason: 'error' };
      }
    },

    async delete(id) {
      const client = initSupabaseClient();
      if (!client) {
        saveGlobalData('halaqah_rooms', (getGlobalData('halaqah_rooms') || []).filter(x => x.id !== id));
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

    async complete(id) {
      const client = initSupabaseClient();
      if (!client) {
        let local = getGlobalData('tasmi_requests');
        const t = local.find(x => x.id === id);
        if (t) {
          t.status = 'completed';
          saveGlobalData('tasmi_requests', local);
        }
        return true;
      }
      const { error } = await client
        .from('tasmi_requests')
        .update({ status: 'completed' })
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

  // ── AUTENTIKASI & SINKRONISASI AKUN LINTAS PERANGKAT ───────
  auth: {
    _syncTimer: null,

    async _restFetch(endpoint, options = {}) {
      const config = typeof getSupabaseConfig === 'function' ? getSupabaseConfig() : null;
      if (!config || !config.url || !config.anonKey) return null;
      const url = `${config.url}/rest/v1/${endpoint}`;
      const headers = {
        'apikey': config.anonKey,
        'Authorization': `Bearer ${config.anonKey}`,
        'Accept': 'application/json',
        ...(options.headers || {})
      };
      try {
        const res = await fetch(url, { ...options, headers });
        return res;
      } catch(err) {
        console.warn('[Misykah Cloud REST] Fetch error:', err);
        return null;
      }
    },

    async getUserByUsername(username) {
      if (!username) return null;
      const uname = String(username).trim().toLowerCase();

      // 1. Coba menggunakan Supabase JS SDK jika tersedia
      const client = initSupabaseClient();
      if (client) {
        try {
          const { data, error } = await client
            .from('santri_accounts')
            .select('id, name, username, password_hash, role, metadata, created_at')
            .eq('username', uname)
            .maybeSingle();

          if (!error && data) {
            return {
              id: data.id,
              name: data.name,
              username: data.username,
              password: data.password_hash,
              role: data.role || 'santri',
              metadata: data.metadata || {},
              createdAt: data.created_at
            };
          }
        } catch (err) {
          console.warn('[Misykah Cloud Auth] Exception with Supabase SDK, falling back to direct REST:', err);
        }
      }

      // 2. Direct REST Fallback (Bebas dari ketergantungan CDN JS)
      try {
        const res = await this._restFetch(`santri_accounts?username=eq.${encodeURIComponent(uname)}&select=id,name,username,password_hash,role,metadata,created_at`);
        if (res && res.ok) {
          const rows = await res.json();
          if (Array.isArray(rows) && rows.length > 0) {
            const data = rows[0];
            return {
              id: data.id,
              name: data.name,
              username: data.username,
              password: data.password_hash,
              role: data.role || 'santri',
              metadata: data.metadata || {},
              createdAt: data.created_at
            };
          }
        }
      } catch(restErr) {
        console.warn('[Misykah Cloud Auth] Direct REST fetch failed:', restErr);
      }

      return null;
    },

    async register(name, username, password) {
      const uname = username.trim().toLowerCase();
      if (uname.length < 3) throw new Error('Username minimal 3 karakter.');
      if (password.length < 6) throw new Error('Password minimal 6 karakter.');

      // Cek apakah username sudah ada di Cloud
      const existing = await this.getUserByUsername(uname);
      if (existing) {
        throw new Error(`Username @${uname} sudah digunakan oleh santri lain.`);
      }

      const hashedPassword = await hashPassword(password);
      const newUser = {
        id: generateId(),
        name: name.trim(),
        username: uname,
        password: hashedPassword,
        role: uname === 'admin' ? 'ustadz' : 'santri',
        metadata: {},
        createdAt: todayStr()
      };

      let savedToCloud = false;
      const client = initSupabaseClient();
      if (client) {
        try {
          const row = {
            id: newUser.id,
            name: newUser.name,
            username: newUser.username,
            password_hash: newUser.password,
            role: newUser.role,
            metadata: {}
          };
          const { error } = await client.from('santri_accounts').insert([row]);
          if (error) {
            if (error.code === '23505' || String(error.message).includes('duplicate') || String(error.message).includes('unique')) {
              throw new Error(`Username @${uname} sudah digunakan oleh santri lain.`);
            }
          } else {
            savedToCloud = true;
            console.log(`[Misykah Cloud Auth] Akun @${uname} berhasil didaftarkan di Supabase Cloud via SDK! 🚀`);
          }
        } catch(cloudErr) {
          if (cloudErr.message && cloudErr.message.includes('sudah digunakan')) {
            throw cloudErr;
          }
        }
      }

      // Jika SDK belum menyimpan ke cloud, gunakan direct REST API
      if (!savedToCloud) {
        try {
          const res = await this._restFetch('santri_accounts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              id: newUser.id,
              name: newUser.name,
              username: newUser.username,
              password_hash: newUser.password,
              role: newUser.role,
              metadata: {}
            })
          });
          if (res && (res.status === 201 || res.status === 200)) {
            savedToCloud = true;
            console.log(`[Misykah Cloud Auth] Akun @${uname} berhasil didaftarkan via direct REST! 🚀`);
          } else if (res && (res.status === 409 || res.status === 400)) {
            const errBody = await res.text();
            if (errBody.includes('duplicate') || errBody.includes('unique') || errBody.includes('23505')) {
              throw new Error(`Username @${uname} sudah digunakan oleh santri lain.`);
            }
          }
        } catch(restErr) {
          if (restErr.message && restErr.message.includes('sudah digunakan')) throw restErr;
          console.warn('[Misykah Cloud Auth] Direct REST register error:', restErr);
        }
      }

      // Simpan ke daftar lokal untuk fallback offline
      let users = getUsers();
      const existingIdx = users.findIndex(u => u.username.toLowerCase() === uname);
      if (existingIdx !== -1) {
        users[existingIdx] = newUser;
      } else {
        users.push(newUser);
      }
      saveUsers(users);

      return newUser;
    },

    async login(username, password) {
      const uname = username.trim().toLowerCase();
      let users = getUsers();
      let targetUser = null;

      // 1. Cari di Supabase Cloud terlebih dahulu (Multi-Device Single Source of Truth)
      try {
        const cloudUser = await this.getUserByUsername(uname);
        if (cloudUser) {
          targetUser = cloudUser;
          // Sinkronkan data user dari cloud ke cache browser lokal
          const idx = users.findIndex(u => u.username.toLowerCase() === uname);
          if (idx !== -1) users[idx] = cloudUser;
          else users.push(cloudUser);
          saveUsers(users);
        }
      } catch(e) {
        console.warn('[Misykah Cloud Auth] Gagal fetch user dari cloud saat login:', e);
      }

      // 2. Jika offline / belum ditemukan di cloud, cari di penyimpanan lokal perangkat ini
      if (!targetUser) {
        const localUser = users.find(u => u.username.toLowerCase() === uname);
        if (localUser) {
          targetUser = localUser;
        }
      }

      if (!targetUser) {
        throw new Error(`Username "@${uname}" belum terdaftar. Silakan klik tab "Daftar Akun Baru" di atas.`);
      }

      // 3. Verifikasi kata sandi
      let isValid = await verifyPassword(password, targetUser.password);
      if (!isValid) {
        // Cek cloud jika password baru saja diubah di perangkat lain
        const freshCloud = await this.getUserByUsername(uname);
        if (freshCloud && freshCloud.password !== targetUser.password) {
          const cloudOk = await verifyPassword(password, freshCloud.password);
          if (cloudOk) {
            isValid = true;
            targetUser = freshCloud;
            const idx = users.findIndex(u => u.username.toLowerCase() === uname);
            if (idx !== -1) users[idx] = freshCloud;
            else users.push(freshCloud);
            saveUsers(users);
          }
        }
      }

      if (!isValid) {
        throw new Error('Kata sandi yang Anda masukkan salah. Periksa kembali huruf besar/kecil.');
      }

      // 4. PENTING: Jika akun ini ada di lokal tapi belum ada di Cloud, otomatis upload sekarang!
      try {
        const existsOnCloud = await this.getUserByUsername(uname);
        if (!existsOnCloud) {
          const meta = this.gatherUserMetadata(targetUser.id);
          const payload = {
            id: targetUser.id,
            name: targetUser.name,
            username: targetUser.username.toLowerCase(),
            password_hash: targetUser.password,
            role: targetUser.role || 'santri',
            metadata: meta
          };
          const client = initSupabaseClient();
          if (client) {
            await client.from('santri_accounts').insert([payload]);
          } else {
            await this._restFetch('santri_accounts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
          }
          console.log(`[Misykah Cloud Auth] Akun @${uname} berhasil diunggah ke Supabase Cloud! ☁️`);
        }
      } catch(upErr) {
        console.warn('[Misykah Cloud Auth] Auto-upload local account on login:', upErr);
      }

      // 5. Jika ada metadata di Cloud, pulihkan ke penyimpanan lokal perangkat ini
      if (targetUser.metadata && typeof targetUser.metadata === 'object') {
        this.hydrateLocalStorage(targetUser.id, targetUser.metadata);
      }

      return targetUser;
    },

    async syncAllLocalAccountsToCloud() {
      const users = getUsers();
      if (!users || users.length === 0) return;

      for (const u of users) {
        if (!u.username) continue;
        try {
          const cloudUser = await this.getUserByUsername(u.username);
          if (!cloudUser) {
            const meta = this.gatherUserMetadata(u.id);
            const payload = {
              id: u.id,
              name: u.name,
              username: u.username.toLowerCase(),
              password_hash: u.password,
              role: u.role || 'santri',
              metadata: meta
            };
            const client = initSupabaseClient();
            if (client) {
              await client.from('santri_accounts').insert([payload]);
            } else {
              await this._restFetch('santri_accounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
            }
            console.log(`[Misykah Cloud Auth] Akun lokal @${u.username} otomatis disinkronkan ke Cloud! ☁️`);
          }
        } catch(err) {
          console.warn('[Misykah Cloud Auth] Auto-sync local account error:', err);
        }
      }
    },

    hydrateLocalStorage(userId, meta) {
      if (!meta || typeof meta !== 'object') return;
      const keys = ['targets', 'target', 'records', 'bookmarks', 'murojaah', 'books', 'muhadharah', 'faidah'];
      keys.forEach(k => {
        if (meta[k] !== undefined) {
          try {
            localStorage.setItem(`misykah_${k}_${userId}`, JSON.stringify(meta[k]));
          } catch(e) {}
        }
      });
    },

    gatherUserMetadata(userId) {
      const meta = {};
      const keys = ['targets', 'target', 'records', 'bookmarks', 'murojaah', 'books', 'muhadharah', 'faidah'];
      keys.forEach(k => {
        try {
          const raw = localStorage.getItem(`misykah_${k}_${userId}`);
          if (raw) meta[k] = JSON.parse(raw);
        } catch(e) {}
      });
      return meta;
    },

    async syncUserData(userId) {
      const client = initSupabaseClient();
      if (!client || !userId) return;
      const meta = this.gatherUserMetadata(userId);
      try {
        await client
          .from('santri_accounts')
          .update({ 
            metadata: meta, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', userId);
      } catch(err) {
        console.warn('[Misykah Cloud Auth] Sync error:', err);
      }
    },

    syncUserDataDebounced(userId) {
      if (this._syncTimer) clearTimeout(this._syncTimer);
      this._syncTimer = setTimeout(() => {
        this.syncUserData(userId);
      }, 2000);
    },

    async syncPullUserData(userId) {
      const client = initSupabaseClient();
      if (!client || !userId) return;
      try {
        const { data, error } = await client
          .from('santri_accounts')
          .select('metadata')
          .eq('id', userId)
          .maybeSingle();

        if (data && data.metadata) {
          this.hydrateLocalStorage(userId, data.metadata);
        }
      } catch(e) {}
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
    // Bersihkan teks teknis database agar antarmuka santri bersih dan tenang
    container.innerHTML = '';
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

// Jalankan auto-sinkronisasi akun lokal ke Supabase Cloud di latar belakang
if (typeof window !== 'undefined') {
  setTimeout(() => {
    if (window.MisykahCloud && MisykahCloud.auth && typeof MisykahCloud.auth.syncAllLocalAccountsToCloud === 'function') {
      MisykahCloud.auth.syncAllLocalAccountsToCloud();
    }
  }, 1200);
}
