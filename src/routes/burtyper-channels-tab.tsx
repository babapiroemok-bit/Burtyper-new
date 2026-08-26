import { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, AlertTriangle, Hash, Lock, Unlock, Plus, Trash2, RefreshCw, Volume2, Folder, Settings, Eye, EyeOff } from 'lucide-react';
import { botFetch } from '@/lib/admin-store';

const GUILD_ID = '1507091095102685277';
const IC = 'w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground outline-none transition-colors focus:border-accent/60';
const BC = 'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all active:scale-95';

export default function ChannelsTab({ apiUrl, apiSecret }: { apiUrl: string; apiSecret: string }) {
  const urlRef = useRef(apiUrl); urlRef.current = apiUrl;
  const secRef = useRef(apiSecret); secRef.current = apiSecret;
  const api = useCallback((p: string, m = 'GET', b?: unknown) => botFetch(urlRef.current, secRef.current, p, m, b), []);

  const [guildId, setGuildId] = useState(GUILD_ID);
  const [channels, setChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actLoad, setActLoad] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('text');
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editTopic, setEditTopic] = useState('');
  const [editSlowmode, setEditSlowmode] = useState(0);
  const [editNsfw, setEditNsfw] = useState(false);
  const [search, setSearch] = useState('');

  const showToast = (msg: string, ok: boolean) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000); };

  const load = useCallback(async () => {
    if (!urlRef.current) { setError('Bot API URL girilmemis.'); return; }
    setLoading(true); setError(null);
    const res = await api('/api/channels/' + guildId);
    if (res.ok) setChannels(res.data as any[]);
    else setError(String(res.error || 'Bilinmeyen hata'));
    setLoading(false);
  }, [guildId]);

  useEffect(() => { load(); }, []);
  async function act(chId: string, action: string, body?: unknown) {
    setActLoad(chId + action);
    let res;
    if (action === 'lock' || action === 'unlock') res = await api('/api/channels/' + guildId + '/' + chId + '/' + action, 'POST');
    else if (action === 'delete') res = await api('/api/channels/' + guildId + '/' + chId, 'DELETE');
    else if (action === 'edit') res = await api('/api/channels/' + guildId + '/' + chId, 'PATCH', body);
    setActLoad(null);
    if (res && res.ok) { showToast(action + ' basarili', true); setEditId(null); load(); } else showToast(String(res?.error || 'hata'), false);
  }

  async function createChannel() {
    if (!newName.trim()) return;
    setActLoad('create');
    const res = await api('/api/channels/' + guildId, 'POST', { name: newName, type: newType });
    setActLoad(null);
    if (res.ok) { showToast('Kanal olusturuldu', true); setNewName(''); load(); } else showToast(String(res.error || 'hata'), false);
  }

  const typeIcon = (t: string) => t === 'voice' ? <Volume2 className='h-4 w-4 text-indigo-400' /> : t === 'category' ? <Folder className='h-4 w-4 text-purple-400' /> : <Hash className='h-4 w-4 text-blue-400' />;
  const typeBadge = (t: string) => t === 'voice' ? 'bg-indigo-500/20 text-indigo-400' : t === 'category' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400';
  const slowmodeLabel = (s: number) => s === 0 ? 'Yok' : s < 60 ? s + 'sn' : s < 3600 ? (s/60) + 'dk' : (s/3600) + 'sa';
  const filteredChannels = channels.filter(ch => !search || ch.name.toLowerCase().includes(search.toLowerCase()));
  const categories = filteredChannels.filter(ch => ch.type === 'category');
  const uncategorized = filteredChannels.filter(ch => ch.type !== 'category' && !ch.parent);
  const grouped = categories.map(cat => ({ ...cat, children: filteredChannels.filter(ch => ch.parent === cat.id) }));
  const renderChannel = (ch: any) => (
    <div key={ch.id} className='flex items-center gap-3 rounded-xl border border-border bg-surface/50 px-4 py-3'>
      {typeIcon(ch.type)}
      <div className='flex-1 min-w-0'>
        {editId === ch.id ? (
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <input value={editName} onChange={e => setEditName(e.target.value)} className={IC + ' flex-1 h-8 text-xs'} />
              <button onClick={() => act(ch.id, 'edit', { name: editName, topic: editTopic, rateLimitPerUser: editSlowmode, nsfw: editNsfw })} className={BC + ' bg-emerald/20 text-emerald'}>Kaydet</button>
              <button onClick={() => setEditId(null)} className={BC + ' bg-gray-500/20 text-gray-400'}>Iptal</button>
            </div>
            {ch.typeRaw === 0 && (<>
              <textarea value={editTopic} onChange={e => setEditTopic(e.target.value)} placeholder='Kanal konusu...' className={IC + ' min-h-[50px] text-xs resize-y'} />
              <div className='flex items-center gap-3'>
                <label className='text-xs text-muted-foreground'>Slowmode:</label>
                <select value={editSlowmode} onChange={e => setEditSlowmode(parseInt(e.target.value))} className={IC + ' w-auto text-xs'}>
                  <option value={0}>Yok</option><option value={5}>5 sn</option><option value={10}>10 sn</option><option value={30}>30 sn</option><option value={60}>1 dk</option><option value={120}>2 dk</option><option value={300}>5 dk</option><option value={600}>10 dk</option><option value={1800}>30 dk</option><option value={3600}>1 sa</option><option value={7200}>2 sa</option><option value={21600}>6 sa</option>
                </select>
                <label className='flex items-center gap-1 text-xs text-muted-foreground cursor-pointer'>
                  <input type='checkbox' checked={editNsfw} onChange={e => setEditNsfw(e.target.checked)} className='rounded border-border' /> NSFW
                </label>
              </div>
            </>)}
          </div>
        ) : (<>
          <p className='truncate text-sm font-bold'>{ch.name}</p>
          <div className='flex flex-wrap items-center gap-1.5 mt-0.5'>
            <span className={'inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold ' + typeBadge(ch.type)}>{ch.type}</span>
            {ch.topic && <span className='text-[10px] text-muted-foreground truncate max-w-[200px]'>Konu: {ch.topic}</span>}
            {(ch.rateLimitPerUser||0) > 0 && <span className='rounded bg-yellow-500/20 px-1.5 py-0.5 text-[10px] font-bold text-yellow-400'>Slow: {slowmodeLabel(ch.rateLimitPerUser)}</span>}
            {ch.nsfw && <span className='rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] font-bold text-red-400'>NSFW</span>}
            {ch.parentName && <span className='text-[10px] text-muted-foreground'>Kategori: {ch.parentName}</span>}
          </div>
        </>)}
      </div>
      {editId !== ch.id && (
        <div className='flex items-center gap-1'>
          <button onClick={() => { setEditId(ch.id); setEditName(ch.name); setEditTopic(ch.topic || ''); setEditSlowmode(ch.rateLimitPerUser || 0); setEditNsfw(ch.nsfw || false); }} className={BC + ' bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'} title='Duzenle'><Settings className='h-3.5 w-3.5' /></button>
          <button onClick={() => act(ch.id, 'lock')} className={BC + ' bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'} title='Kilitle'><Lock className='h-3.5 w-3.5' /></button>
          <button onClick={() => act(ch.id, 'unlock')} className={BC + ' bg-green-500/10 text-green-400 hover:bg-green-500/20'} title='Kilidi Ac'><Unlock className='h-3.5 w-3.5' /></button>
          <button onClick={() => { if (confirm(ch.name + ' silinsin mi?')) act(ch.id, 'delete'); }} className={BC + ' bg-red-500/10 text-red-400 hover:bg-red-500/20'} title='Sil'><Trash2 className='h-3.5 w-3.5' /></button>
        </div>
      )}
    </div>
  );
  return (
    <div className='space-y-4'>
      {toast && (
        <div className={(toast.ok ? 'bg-emerald/20 text-emerald border border-emerald/40' : 'bg-red-500/20 text-red-400 border border-red-500/40') + ' fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow-lg'}>
          {toast.ok ? <Lock className='h-4 w-4' /> : <AlertTriangle className='h-4 w-4' />}
          {toast.msg}
        </div>
      )}
      <div className='flex flex-wrap items-end gap-3'>
        <label className='block flex-1 min-w-[200px]'>
          <span className='mb-1 block text-xs font-bold text-muted-foreground'>Sunucu ID</span>
          <input value={guildId} onChange={e => setGuildId(e.target.value)} className={IC} />
        </label>
        <label className='block flex-1 min-w-[200px]'>
          <span className='mb-1 block text-xs font-bold text-muted-foreground'>Ara</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder='Kanal adi...' className={IC} />
        </label>
        <button onClick={load} disabled={loading || !urlRef.current} className={BC + ' bg-gold/20 text-gold border border-gold/30 hover:bg-gold/30'}>
          {loading ? <Loader2 className='h-4 w-4 animate-spin' /> : <RefreshCw className='h-4 w-4' />} Yenile
        </button>
      </div>
      {!urlRef.current && <div className='flex items-center gap-2 rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm font-semibold text-yellow-400'><AlertTriangle className='h-4 w-4' /> Bot API URL girilmemis.</div>}
      <div className='rounded-2xl border border-border bg-surface/50 p-5'>
        <h3 className='mb-3 text-sm font-bold text-gold'>Yeni Kanal Olustur</h3>
        <div className='flex flex-wrap items-end gap-3'>
          <label className='block flex-1 min-w-[200px]'>
            <span className='mb-1 block text-xs font-bold text-muted-foreground'>Kanal Adi</span>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder='kanal-adi' className={IC} />
          </label>
          <label className='block min-w-[120px]'>
            <span className='mb-1 block text-xs font-bold text-muted-foreground'>Tur</span>
            <select value={newType} onChange={e => setNewType(e.target.value)} className={IC}>
              <option value='text'>Yazi</option><option value='voice'>Ses</option><option value='category'>Kategori</option>
            </select>
          </label>
          <button onClick={createChannel} disabled={!newName.trim() || actLoad === 'create'} className={BC + ' bg-gold/20 text-gold border border-gold/30 hover:bg-gold/30'}>
            {actLoad === 'create' ? <Loader2 className='h-4 w-4 animate-spin' /> : <Plus className='h-4 w-4' />} Olustur
          </button>
        </div>
      </div>
      {error && <div className='flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive'><AlertTriangle className='h-4 w-4' /> {error}</div>}
      <div className='space-y-3'>
        {grouped.map(cat => (
          <div key={cat.id}>
            <p className='mb-1 text-xs font-bold text-purple-400 flex items-center gap-1'><Folder className='h-3 w-3' /> {cat.name}</p>
            <div className='space-y-1 ml-4'>{cat.children.map(renderChannel)}</div>
          </div>
        ))}
        {uncategorized.length > 0 && (
          <div>
            <p className='mb-1 text-xs font-bold text-muted-foreground'>Kategorisiz</p>
            <div className='space-y-1'>{uncategorized.map(renderChannel)}</div>
          </div>
        )}
        {filteredChannels.length === 0 && !loading && !error && <p className='text-center text-sm text-muted-foreground'>Kanal bulunamadi.</p>}
      </div>
    </div>
  );
}
