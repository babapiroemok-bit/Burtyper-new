import { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, AlertTriangle, Search, Shield, Ban, Clock, UserMinus, RefreshCw, X, AtSign, Send, Volume2, Eye, Plus, MessageSquare } from 'lucide-react';
import { botFetch } from '@/lib/admin-store';

const GUILD_ID = '1507091095102685277';
const IC = 'w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground outline-none transition-colors focus:border-accent/60';
const BC = 'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all active:scale-95';

export default function MembersTab({ apiUrl, apiSecret }: { apiUrl: string; apiSecret: string }) {
  const urlRef = useRef(apiUrl); urlRef.current = apiUrl;
  const secRef = useRef(apiSecret); secRef.current = apiSecret;
  const api = useCallback((p: string, m = 'GET', b?: unknown) => botFetch(urlRef.current, secRef.current, p, m, b), []);

  const [guildId, setGuildId] = useState(GUILD_ID);
  const [members, setMembers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [voiceChannels, setVoiceChannels] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actLoad, setActLoad] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [nickTarget, setNickTarget] = useState<string | null>(null);
  const [nickVal, setNickVal] = useState('');
  const [dmTarget, setDmTarget] = useState<string | null>(null);
  const [dmMsg, setDmMsg] = useState('');
  const [profileTarget, setProfileTarget] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [addRoleTarget, setAddRoleTarget] = useState<string | null>(null);
  const [timeoutDuration, setTimeoutDuration] = useState('600000');
  const [banReason, setBanReason] = useState('');

  const showToast = (msg: string, ok: boolean) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000); };
  const load = useCallback(async () => {
    if (!urlRef.current) { setError('Bot API URL girilmemis. Discord sekmesinden girin.'); return; }
    setLoading(true); setError(null);
    const q = search ? '&search=' + encodeURIComponent(search) : '';
    const rf = roleFilter ? '&role=' + roleFilter : '';
    const sf = statusFilter ? '&status=' + statusFilter : '';
    const res = await api('/api/members/' + guildId + '?limit=100' + q + rf + sf);
    if (res.ok) setMembers(res.data as any[]);
    else setError(String(res.error || 'Bilinmeyen hata'));
    setLoading(false);
  }, [guildId, search, roleFilter, statusFilter]);

  const loadRoles = useCallback(async () => {
    if (!urlRef.current || !guildId) return;
    const res = await api('/api/roles/' + guildId);
    if (res.ok) setRoles(res.data as any[]);
  }, [guildId]);

  const loadVoiceChannels = useCallback(async () => {
    if (!urlRef.current || !guildId) return;
    const res = await api('/api/server/' + guildId + '/voice');
    if (res.ok) setVoiceChannels(res.data as any[]);
  }, [guildId]);

  useEffect(() => { load(); loadRoles(); }, []);
  useEffect(() => { if (expanded || addRoleTarget) loadVoiceChannels(); }, [expanded, addRoleTarget]);

  async function act(userId: string, action: string, body?: unknown) {
    setActLoad(userId + action);
    const res = await api('/api/members/' + guildId + '/' + userId + '/' + action, 'POST', body);
    setActLoad(null);
    if (res.ok) { showToast(action + ' basarili', true); load(); } else showToast(String(res.error || 'hata'), false);
  }

  async function rmRole(userId: string, roleId: string) {
    setActLoad(userId + 'rm' + roleId);
    const res = await api('/api/members/' + guildId + '/' + userId + '/role/' + roleId, 'DELETE');
    setActLoad(null);
    if (res.ok) { showToast('Rol kaldirildi', true); load(); } else showToast(String(res.error || 'hata'), false);
  }

  async function addRole(userId: string, roleId: string) {
    setActLoad(userId + 'add' + roleId);
    const res = await api('/api/members/' + guildId + '/' + userId + '/role', 'POST', { roleId });
    setActLoad(null);
    if (res.ok) { showToast('Rol eklendi', true); setAddRoleTarget(null); load(); } else showToast(String(res.error || 'hata'), false);
  }

  async function changeNick(userId: string) {
    setActLoad(userId + 'nick');
    const res = await api('/api/members/' + guildId + '/' + userId + '/nickname', 'POST', { nickname: nickVal || null });
    setActLoad(null);
    if (res.ok) { showToast('Takma ad degistirildi', true); setNickTarget(null); load(); } else showToast(String(res.error || 'hata'), false);
  }

  async function sendDm(userId: string) {
    if (!dmMsg.trim()) return;
    setActLoad(userId + 'dm');
    const res = await api('/api/members/' + guildId + '/' + userId + '/dm', 'POST', { message: dmMsg });
    setActLoad(null);
    if (res.ok) { showToast('DM gonderildi', true); setDmTarget(null); setDmMsg(''); } else showToast(String(res.error || 'hata'), false);
  }

  async function viewProfile(userId: string) {
    setProfileTarget(userId);
    setProfileLoading(true);
    const res = await api('/api/members/' + guildId + '/' + userId + '/profile');
    if (res.ok) setProfileData(res.data);
    else showToast(String(res.error || 'hata'), false);
    setProfileLoading(false);
  }

  async function moveVoice(userId: string, channelId: string) {
    setActLoad(userId + 'move');
    const res = await api('/api/members/' + guildId + '/' + userId + '/move', 'POST', { channelId });
    setActLoad(null);
    if (res.ok) { showToast('Tasindi', true); load(); } else showToast(String(res.error || 'hata'), false);
  }

  const sc = (s: string) => s === 'online' ? 'bg-emerald' : s === 'idle' ? 'bg-yellow-500' : s === 'dnd' ? 'bg-red-500' : 'bg-gray-500';
  const onlineCount = members.filter(m => m.status === 'online').length;
  const boostCount = members.filter(m => m.isBoosting).length;
  return (
    <div className='space-y-4'>
      {toast && (
        <div className={(toast.ok ? 'bg-emerald/20 text-emerald border border-emerald/40' : 'bg-red-500/20 text-red-400 border border-red-500/40') + ' fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow-lg'}>
          {toast.ok ? <Shield className='h-4 w-4' /> : <AlertTriangle className='h-4 w-4' />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className='flex flex-wrap items-end gap-3'>
        <label className='block flex-1 min-w-[200px]'>
          <span className='mb-1 block text-xs font-bold text-muted-foreground'>Sunucu ID</span>
          <input value={guildId} onChange={e => setGuildId(e.target.value)} className={IC} />
        </label>
        <label className='block flex-1 min-w-[200px]'>
          <span className='mb-1 block text-xs font-bold text-muted-foreground'>Ara</span>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()} placeholder='Kullanici adi veya ID...' className={IC + ' pl-10'} />
          </div>
        </label>
        <button onClick={load} disabled={loading || !urlRef.current} className={BC + ' bg-gold/20 text-gold border border-gold/30 hover:bg-gold/30'}>
          {loading ? <Loader2 className='h-4 w-4 animate-spin' /> : <RefreshCw className='h-4 w-4' />} Yenile
        </button>
      </div>

      {/* Filters */}
      <div className='flex flex-wrap gap-3'>
        <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); }} className={IC + ' w-auto min-w-[180px]'}>
          <option value=''>Tum Roller</option>
          {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); }} className={IC + ' w-auto min-w-[150px]'}>
          <option value=''>Tum Durumlar</option>
          <option value='online'>Online</option>
          <option value='idle'>Bos Degil</option>
          <option value='dnd'>Rahatsiz Etmeyin</option>
          <option value='offline'>Offline</option>
        </select>
      </div>

      {/* Stats bar */}
      <div className='flex flex-wrap gap-3'>
        <div className='rounded-xl border border-border bg-surface/50 px-4 py-2'><span className='text-[10px] font-bold text-muted-foreground'>Toplam: </span><span className='text-sm font-bold text-gold'>{members.length}</span></div>
        <div className='rounded-xl border border-border bg-surface/50 px-4 py-2'><span className='text-[10px] font-bold text-muted-foreground'>Online: </span><span className='text-sm font-bold text-emerald'>{onlineCount}</span></div>
        <div className='rounded-xl border border-border bg-surface/50 px-4 py-2'><span className='text-[10px] font-bold text-muted-foreground'>Boost: </span><span className='text-sm font-bold text-pink-400'>{boostCount}</span></div>
      </div>

      {!urlRef.current && <div className='flex items-center gap-2 rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm font-semibold text-yellow-400'><AlertTriangle className='h-4 w-4' /> Bot API URL girilmemis. Discord sekmesinden URL girip kaydedin.</div>}
      {error && <div className='flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive'><AlertTriangle className='h-4 w-4' /> {error}</div>}
      {loading && <div className='flex justify-center py-8'><Loader2 className='h-6 w-6 animate-spin text-gold' /></div>}
      {/* Member list */}
      <div className='space-y-2'>
        {members.map(m => {
          const rolesList = (m.roles || []) as any[];
          const vcList = (voiceChannels || []).flatMap((vc: any) => vc.users ? vc.users.map((u: any) => ({ ...u, channelName: vc.name, channelId: vc.id })) : []);
          const voiceUsers = vcList.filter((u: any) => u.id === m.id);
          return (
            <div key={m.id} className='rounded-2xl border border-border bg-surface/50 p-4'>
              <div className='flex items-center gap-3'>
                <img src={m.avatar} alt='' className='h-10 w-10 rounded-full' />
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2'>
                    <p className='truncate text-sm font-bold'>{m.displayName || m.username}</p>
                    <span className={'h-2.5 w-2.5 rounded-full ' + sc(m.status)} />
                    {m.isBoosting && <span className='rounded-md bg-pink-500/20 px-1.5 py-0.5 text-[10px] font-bold text-pink-400'>BOOST</span>}
                    {m.voiceChannel && <span className='inline-flex items-center gap-1 rounded-md bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-bold text-indigo-400'><Volume2 className='h-2.5 w-2.5' /> {m.voiceChannel}</span>}
                  </div>
                  <p className='text-xs text-muted-foreground'>@{m.username} | {m.id}</p>
                  <div className='mt-1 flex flex-wrap gap-1'>
                    {rolesList.map(r => (
                      <span key={r.id} className='inline-flex items-center gap-1 rounded-md border border-border bg-background/50 px-2 py-0.5 text-[10px] font-bold' style={r.color && r.color !== '#000000' ? { borderColor: r.color, color: r.color } : {}}>
                        {r.name}
                        <button onClick={() => rmRole(m.id, r.id)} className='ml-0.5 text-red-400 hover:text-red-300'>x</button>
                      </span>
                    ))}
                  </div>
                </div>
                {/* Action buttons */}
                <div className='flex items-center gap-1 flex-wrap justify-end'>
                  {actLoad === m.id + 'kick' ? <Loader2 className='h-4 w-4 animate-spin text-red-400' /> :
                    <button onClick={() => { if (confirm(m.username + ' atilsin mi?')) act(m.id, 'kick'); }} className={BC + ' bg-red-500/10 text-red-400 hover:bg-red-500/20'} title='At'><UserMinus className='h-3.5 w-3.5' /></button>}
                  {actLoad === m.id + 'ban' ? <Loader2 className='h-4 w-4 animate-spin text-red-400' /> :
                    <button onClick={() => { const r = prompt('Ban sebebi:'); if (r !== null) act(m.id, 'ban', { reason: r || 'Admin panel' }); }} className={BC + ' bg-red-500/10 text-red-400 hover:bg-red-500/20'} title='Ban'><Ban className='h-3.5 w-3.5' /></button>}
                  <button onClick={() => setExpanded(expanded === m.id ? null : m.id)} className={BC + ' bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'} title='Timeout/Voice'><Clock className='h-3.5 w-3.5' /></button>
                  <button onClick={() => { setNickTarget(nickTarget === m.id ? null : m.id); setNickVal(m.displayName || ''); }} className={BC + ' bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'} title='Takma Ad'><AtSign className='h-3.5 w-3.5' /></button>
                  <button onClick={() => { setDmTarget(dmTarget === m.id ? null : m.id); setDmMsg(''); }} className={BC + ' bg-purple-500/10 text-purple-400 hover:bg-purple-500/20'} title='DM Gonder'><Send className='h-3.5 w-3.5' /></button>
                  <button onClick={() => setAddRoleTarget(addRoleTarget === m.id ? null : m.id)} className={BC + ' bg-emerald/10 text-emerald hover:bg-emerald/20'} title='Rol Ekle'><Plus className='h-3.5 w-3.5' /></button>
                  <button onClick={() => viewProfile(m.id)} className={BC + ' bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'} title='Profil'><Eye className='h-3.5 w-3.5' /></button>
                </div>
              </div>
              {/* Timeout panel */}
              {expanded === m.id && (
                <div className='mt-3 space-y-3 border-t border-border pt-3'>
                  <div>
                    <p className='mb-2 text-xs font-bold text-muted-foreground'>Timeout</p>
                    <div className='flex flex-wrap items-center gap-2'>
                      <select value={timeoutDuration} onChange={e => setTimeoutDuration(e.target.value)} className={IC + ' w-auto min-w-[150px]'}>
                        <option value='60000'>1 Dakika</option>
                        <option value='300000'>5 Dakika</option>
                        <option value='600000'>10 Dakika</option>
                        <option value='3600000'>1 Saat</option>
                        <option value='21600000'>6 Saat</option>
                        <option value='86400000'>24 Saat</option>
                        <option value='604800000'>1 Hafta</option>
                      </select>
                      <button onClick={() => act(m.id, 'timeout', { duration: parseInt(timeoutDuration) || 600000, reason: 'Admin panel' })} className={BC + ' bg-yellow-500/20 text-yellow-400'}>Sustur</button>
                      <button onClick={() => act(m.id, 'untimeout')} className={BC + ' bg-green-500/20 text-green-400'}>Kaldir</button>
                    </div>
                  </div>
                  {m.voiceChannel && (
                    <div>
                      <p className='mb-2 text-xs font-bold text-muted-foreground'>Ses Kanali: {m.voiceChannel}</p>
                      <div className='flex flex-wrap items-center gap-2'>
                        {actLoad === m.id + 'mute' ? <Loader2 className='h-4 w-4 animate-spin text-yellow-400' /> :
                          <button onClick={() => act(m.id, 'mute')} className={BC + ' bg-yellow-500/10 text-yellow-400'}>{m.voiceMuted ? 'Sesi Ac' : 'Sustur'}</button>}
                        {actLoad === m.id + 'deafen' ? <Loader2 className='h-4 w-4 animate-spin text-yellow-400' /> :
                          <button onClick={() => act(m.id, 'deafen')} className={BC + ' bg-yellow-500/10 text-yellow-400'}>{m.voiceDeafened ? 'Kulakligi Ac' : 'Kulakligi Kapat'}</button>}
                        {actLoad === m.id + 'disconnect' ? <Loader2 className='h-4 w-4 animate-spin text-red-400' /> :
                          <button onClick={() => act(m.id, 'disconnect')} className={BC + ' bg-red-500/10 text-red-400'}>At</button>}
                        <select onChange={e => { if (e.target.value) moveVoice(m.id, e.target.value); e.target.value = ''; }} className={IC + ' w-auto min-w-[150px]'}>
                          <option value=''>Tasi...</option>
                          {voiceChannels.filter((vc: any) => vc.id !== m.voiceChannelId && vc.id !== m.voiceChannel).map((vc: any) => (
                            <option key={vc.id} value={vc.id}>{vc.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                  <button onClick={() => setExpanded(null)} className='text-muted-foreground hover:text-foreground'><X className='h-4 w-4' /></button>
                </div>
              )}

              {/* Nickname panel */}
              {nickTarget === m.id && (
                <div className='mt-3 flex items-center gap-2 border-t border-border pt-3'>
                  <input value={nickVal} onChange={e => setNickVal(e.target.value)} placeholder='Yeni takma ad' className={IC + ' flex-1'} />
                  <button onClick={() => changeNick(m.id)} disabled={actLoad === m.id + 'nick'} className={BC + ' bg-blue-500/20 text-blue-400'}>
                    {actLoad === m.id + 'nick' ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Kaydet'}
                  </button>
                  <button onClick={() => setNickTarget(null)} className='text-muted-foreground'><X className='h-4 w-4' /></button>
                </div>
              )}

              {/* DM panel */}
              {dmTarget === m.id && (
                <div className='mt-3 space-y-2 border-t border-border pt-3'>
                  <p className='text-xs font-bold text-muted-foreground'>DM Gonder: @{m.username}</p>
                  <textarea value={dmMsg} onChange={e => setDmMsg(e.target.value)} placeholder='Mesajinizi yazin...' className={IC + ' min-h-[60px] resize-y'} />
                  <div className='flex items-center gap-2'>
                    <button onClick={() => sendDm(m.id)} disabled={!dmMsg.trim() || actLoad === m.id + 'dm'} className={BC + ' bg-purple-500/20 text-purple-400'}>
                      {actLoad === m.id + 'dm' ? <Loader2 className='h-4 w-4 animate-spin' /> : <><Send className='h-3.5 w-3.5' /> Gonder</>}
                    </button>
                    <button onClick={() => setDmTarget(null)} className='text-muted-foreground'><X className='h-4 w-4' /></button>
                  </div>
                </div>
              )}

              {/* Add Role panel */}
              {addRoleTarget === m.id && (
                <div className='mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3'>
                  <p className='text-xs font-bold text-muted-foreground'>Rol Ekle:</p>
                  {roles.filter(r => !rolesList.find((mr: any) => mr.id === r.id)).map(r => (
                    <button key={r.id} onClick={() => addRole(m.id, r.id)} disabled={actLoad === m.id + 'add' + r.id} className={BC + ' bg-emerald/10 text-emerald hover:bg-emerald/20'} style={r.color && r.color !== '#000000' ? { borderColor: r.color } : {}}>
                      {actLoad === m.id + 'add' + r.id ? <Loader2 className='h-3 w-3 animate-spin' /> : '+'} {r.name}
                    </button>
                  ))}
                  <button onClick={() => setAddRoleTarget(null)} className='text-muted-foreground'><X className='h-4 w-4' /></button>
                </div>
              )}
            </div>
          );
        })}
        {members.length === 0 && !loading && !error && <p className='text-center text-sm text-muted-foreground'>Uye bulunamadi.</p>}
      </div>

      {/* Profile Modal */}
      {profileTarget && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm' onClick={() => { setProfileTarget(null); setProfileData(null); }}>
          <div className='w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl' onClick={e => e.stopPropagation()}>
            {profileLoading ? (
              <div className='flex justify-center py-8'><Loader2 className='h-6 w-6 animate-spin text-gold' /></div>
            ) : profileData ? (
              <div className='space-y-4'>
                <div className='flex items-center gap-4'>
                  <img src={profileData.avatar} alt='' className='h-16 w-16 rounded-full' />
                  <div>
                    <h3 className='font-display text-lg font-extrabold'>{profileData.displayName || profileData.username}</h3>
                    <p className='text-xs text-muted-foreground'>@{profileData.username} {profileData.bot && <span className='rounded bg-blue-500/20 px-1 py-0.5 text-[10px] font-bold text-blue-400'>BOT</span>}</p>
                    <p className='text-[10px] text-muted-foreground'>ID: {profileData.id}</p>
                  </div>
                </div>
                {profileData.banner && <img src={profileData.banner} alt='' className='w-full h-32 rounded-xl object-cover' />}
                <div className='grid grid-cols-2 gap-2 text-xs'>
                  <div className='rounded-xl border border-border bg-background/50 p-2'><span className='text-muted-foreground'>Katilim: </span>{profileData.joinedAt ? new Date(profileData.joinedAt).toLocaleDateString('tr-TR') : '?'}</div>
                  <div className='rounded-xl border border-border bg-background/50 p-2'><span className='text-muted-foreground'>Hesap: </span>{profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString('tr-TR') : '?'}</div>
                  <div className='rounded-xl border border-border bg-background/50 p-2'><span className='text-muted-foreground'>Durum: </span>{profileData.status}</div>
                  <div className='rounded-xl border border-border bg-background/50 p-2'><span className='text-muted-foreground'>Boost: </span>{profileData.isBoosting ? 'Evet' : 'Hayir'}</div>
                  {profileData.voiceChannel && <div className='rounded-xl border border-border bg-background/50 p-2'><span className='text-muted-foreground'>Ses: </span>{profileData.voiceChannel}</div>}
                </div>
                <div className='flex flex-wrap gap-1'>
                  {profileData.roles?.map((r: any) => (
                    <span key={r.id} className='rounded-md border border-border bg-background/50 px-2 py-0.5 text-[10px] font-bold' style={r.color && r.color !== '#000000' ? { borderColor: r.color, color: r.color } : {}}>{r.name}</span>
                  ))}
                </div>
                {profileData.permissions && (
                  <div><p className='text-[10px] font-bold text-muted-foreground mb-1'>Izinler:</p><div className='flex flex-wrap gap-1'>{profileData.permissions.map((p: string) => <span key={p} className='rounded bg-surface px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground'>{p}</span>)}</div></div>
                )}
                <button onClick={() => { setProfileTarget(null); setProfileData(null); }} className={BC + ' bg-gray-500/20 text-gray-400 w-full justify-center'}>Kapat</button>
              </div>
            ) : <p className='text-center text-sm text-muted-foreground'>Profil yuklenemedi.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
