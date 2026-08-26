import { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, AlertTriangle, Crown, Plus, Trash2, RefreshCw, Palette, Users, ChevronDown, ChevronUp, Edit } from 'lucide-react';
import { botFetch } from '@/lib/admin-store';

const GUILD_ID = '1507091095102685277';
const IC = 'w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground outline-none transition-colors focus:border-accent/60';
const BC = 'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all active:scale-95';

export default function RolesTab({ apiUrl, apiSecret }: { apiUrl: string; apiSecret: string }) {
  const urlRef = useRef(apiUrl); urlRef.current = apiUrl;
  const secRef = useRef(apiSecret); secRef.current = apiSecret;
  const api = useCallback((p: string, m = 'GET', b?: unknown) => botFetch(urlRef.current, secRef.current, p, m, b), []);

  const [guildId, setGuildId] = useState(GUILD_ID);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actLoad, setActLoad] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#FFD700');
  const [newMentionable, setNewMentionable] = useState(false);
  const [newHoist, setNewHoist] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [editMentionable, setEditMentionable] = useState(false);
  const [editHoist, setEditHoist] = useState(false);
  const [membersTarget, setMembersTarget] = useState<string | null>(null);
  const [membersList, setMembersList] = useState<any[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);

  const showToast = (msg: string, ok: boolean) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000); };
  const load = useCallback(async () => {
    if (!urlRef.current) { setError('Bot API URL girilmemis.'); return; }
    setLoading(true); setError(null);
    const res = await api('/api/roles/' + guildId);
    if (res.ok) setRoles(res.data as any[]);
    else setError(String(res.error || 'Bilinmeyen hata'));
    setLoading(false);
  }, [guildId]);

  useEffect(() => { load(); }, []);

  async function createRole() {
    if (!newName.trim()) return;
    setActLoad('create');
    const res = await api('/api/roles/' + guildId, 'POST', { name: newName, color: newColor, mentionable: newMentionable, hoist: newHoist });
    setActLoad(null);
    if (res.ok) { showToast('Rol olusturuldu', true); setNewName(''); load(); } else showToast(String(res.error || 'hata'), false);
  }

  async function deleteRole(roleId: string) {
    setActLoad(roleId + 'del');
    const res = await api('/api/roles/' + guildId + '/' + roleId, 'DELETE');
    setActLoad(null);
    if (res.ok) { showToast('Rol silindi', true); load(); } else showToast(String(res.error || 'hata'), false);
  }

  async function saveEdit(roleId: string) {
    setActLoad(roleId + 'edit');
    const res = await api('/api/roles/' + guildId + '/' + roleId, 'PATCH', { name: editName, color: editColor, mentionable: editMentionable, hoist: editHoist });
    setActLoad(null);
    if (res.ok) { showToast('Rol guncellendi', true); setEditId(null); load(); } else showToast(String(res.error || 'hata'), false);
  }

  async function loadMembers(roleId: string) {
    if (membersTarget === roleId) { setMembersTarget(null); return; }
    setMembersTarget(roleId);
    setMembersLoading(true);
    const res = await api('/api/roles/' + guildId + '/' + roleId + '/members');
    if (res.ok) setMembersList(res.data as any[]);
    setMembersLoading(false);
  }
  return (
    <div className='space-y-4'>
      {toast && (
        <div className={(toast.ok ? 'bg-emerald/20 text-emerald border border-emerald/40' : 'bg-red-500/20 text-red-400 border border-red-500/40') + ' fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow-lg'}>
          {toast.ok ? <Crown className='h-4 w-4' /> : <AlertTriangle className='h-4 w-4' />}
          {toast.msg}
        </div>
      )}
      <div className='flex flex-wrap items-end gap-3'>
        <label className='block flex-1 min-w-[200px]'>
          <span className='mb-1 block text-xs font-bold text-muted-foreground'>Sunucu ID</span>
          <input value={guildId} onChange={e => setGuildId(e.target.value)} className={IC} />
        </label>
        <button onClick={load} disabled={loading || !urlRef.current} className={BC + ' bg-gold/20 text-gold border border-gold/30 hover:bg-gold/30'}>
          {loading ? <Loader2 className='h-4 w-4 animate-spin' /> : <RefreshCw className='h-4 w-4' />} Yenile
        </button>
      </div>
      {!urlRef.current && <div className='flex items-center gap-2 rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm font-semibold text-yellow-400'><AlertTriangle className='h-4 w-4' /> Bot API URL girilmemis.</div>}
      <div className='rounded-2xl border border-border bg-surface/50 p-5'>
        <h3 className='mb-3 text-sm font-bold text-gold'>Yeni Rol Olustur</h3>
        <div className='flex flex-wrap items-end gap-3'>
          <label className='block flex-1 min-w-[200px]'>
            <span className='mb-1 block text-xs font-bold text-muted-foreground'>Rol Adi</span>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder='rol-adi' className={IC} />
          </label>
          <label className='block min-w-[100px]'>
            <span className='mb-1 block text-xs font-bold text-muted-foreground'>Renk</span>
            <div className='flex items-center gap-2'>
              <input type='color' value={newColor} onChange={e => setNewColor(e.target.value)} className='h-10 w-10 rounded-lg border border-border cursor-pointer' />
              <input value={newColor} onChange={e => setNewColor(e.target.value)} className={IC + ' w-28'} />
            </div>
          </label>
          <div className='flex items-center gap-3'>
            <label className='flex items-center gap-1 text-xs text-muted-foreground cursor-pointer'><input type='checkbox' checked={newMentionable} onChange={e => setNewMentionable(e.target.checked)} className='rounded border-border' /> Etiketlenebilir</label>
            <label className='flex items-center gap-1 text-xs text-muted-foreground cursor-pointer'><input type='checkbox' checked={newHoist} onChange={e => setNewHoist(e.target.checked)} className='rounded border-border' /> Ayri Goster</label>
          </div>
          <button onClick={createRole} disabled={!newName.trim() || actLoad === 'create'} className={BC + ' bg-gold/20 text-gold border border-gold/30 hover:bg-gold/30'}>
            {actLoad === 'create' ? <Loader2 className='h-4 w-4 animate-spin' /> : <Plus className='h-4 w-4' />} Olustur
          </button>
        </div>
      </div>
      {error && <div className='flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive'><AlertTriangle className='h-4 w-4' /> {error}</div>}
      <div className='space-y-1'>
        {roles.map(r => (
          <div key={r.id} className='rounded-xl border border-border bg-surface/50 px-4 py-3'>
            <div className='flex items-center gap-3'>
              <span className='h-4 w-4 rounded-full border border-border shrink-0' style={{ backgroundColor: r.color }} />
              {editId === r.id ? (
                <div className='flex flex-1 items-center gap-2 flex-wrap'>
                  <input value={editName} onChange={e => setEditName(e.target.value)} className={IC + ' flex-1 h-8 text-xs'} />
                  <input type='color' value={editColor} onChange={e => setEditColor(e.target.value)} className='h-8 w-8 rounded border border-border cursor-pointer' />
                  <label className='flex items-center gap-1 text-xs text-muted-foreground cursor-pointer'><input type='checkbox' checked={editMentionable} onChange={e => setEditMentionable(e.target.checked)} /> Etiket</label>
                  <label className='flex items-center gap-1 text-xs text-muted-foreground cursor-pointer'><input type='checkbox' checked={editHoist} onChange={e => setEditHoist(e.target.checked)} /> Ayri</label>
                  <button onClick={() => saveEdit(r.id)} disabled={actLoad === r.id + 'edit'} className={BC + ' bg-emerald/20 text-emerald'}>{actLoad === r.id + 'edit' ? <Loader2 className='h-3 w-3 animate-spin' /> : 'Kaydet'}</button>
                  <button onClick={() => setEditId(null)} className={BC + ' bg-gray-500/20 text-gray-400'}>Iptal</button>
                </div>
              ) : (<>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2'>
                    <p className='text-sm font-bold' style={r.color !== '#000000' ? { color: r.color } : {}}>{r.name}</p>
                    {r.mentionable && <span className='rounded bg-emerald/20 px-1 py-0.5 text-[9px] font-bold text-emerald'>Etiket</span>}
                    {r.hoist && <span className='rounded bg-blue-500/20 px-1 py-0.5 text-[9px] font-bold text-blue-400'>Ayri</span>}
                  </div>
                  <p className='text-[10px] text-muted-foreground'>{r.memberCount} uye | Sirasi: {r.position}</p>
                </div>
                <div className='flex items-center gap-1'>
                  <button onClick={() => loadMembers(r.id)} className={BC + ' bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'} title='Uyeleri Goster'>
                    {membersTarget === r.id ? <ChevronUp className='h-3.5 w-3.5' /> : <Users className='h-3.5 w-3.5' />}
                  </button>
                  <button onClick={() => { setEditId(r.id); setEditName(r.name); setEditColor(r.color); setEditMentionable(r.mentionable || false); setEditHoist(r.hoist || false); }} className={BC + ' bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'}><Palette className='h-3.5 w-3.5' /></button>
                  <button onClick={() => { if (confirm(r.name + ' silinsin mi?')) deleteRole(r.id); }} className={BC + ' bg-red-500/10 text-red-400 hover:bg-red-500/20'}><Trash2 className='h-3.5 w-3.5' /></button>
                </div>
              </>)}
            </div>
            {membersTarget === r.id && (
              <div className='mt-3 border-t border-border pt-3'>
                {membersLoading ? <Loader2 className='h-4 w-4 animate-spin text-gold mx-auto' /> : (
                  <div className='flex flex-wrap gap-2'>
                    {membersList.length === 0 && <p className='text-xs text-muted-foreground'>Bu rolu kimse tasimiyor.</p>}
                    {membersList.map(m => (
                      <div key={m.id} className='flex items-center gap-2 rounded-lg border border-border bg-background/50 px-2 py-1'>
                        <img src={m.avatar} alt='' className='h-5 w-5 rounded-full' />
                        <span className='text-[10px] font-bold'>{m.displayName || m.username}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {roles.length === 0 && !loading && !error && <p className='text-center text-sm text-muted-foreground'>Rol bulunamadi.</p>}
      </div>
    </div>
  );
}
