import { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, AlertTriangle, RefreshCw, Settings, Scroll, Ban, Link, Shield, Smile, Volume2, BarChart3, Gift, Calendar, Globe, Trash2 } from 'lucide-react';
import { botFetch } from '@/lib/admin-store';

const GUILD_ID = '1507091095102685277';
const IC = 'w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground outline-none transition-colors focus:border-accent/60';
const BC = 'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all active:scale-95';
type SubTab = 'settings' | 'audit' | 'bans' | 'webhooks' | 'emojis' | 'invites' | 'events' | 'voice' | 'boosters' | 'stats';

export default function ServerTab({ apiUrl, apiSecret }: { apiUrl: string; apiSecret: string }) {
  const urlRef = useRef(apiUrl); urlRef.current = apiUrl;
  const secRef = useRef(apiSecret); secRef.current = apiSecret;
  const api = useCallback((p: string, m = 'GET', b?: unknown) => botFetch(urlRef.current, secRef.current, p, m, b), []);

  const [guildId, setGuildId] = useState(GUILD_ID);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [subTab, setSubTab] = useState<SubTab>('settings');

  const [serverInfo, setServerInfo] = useState<any>(null);
  const [auditLog, setAuditLog] = useState<any[]>([]);
  const [bans, setBans] = useState<any[]>([]);
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [emojis, setEmojis] = useState<any[]>([]);
  const [invites, setInvites] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [voiceChannels, setVoiceChannels] = useState<any[]>([]);
  const [boosters, setBoosters] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  const [serverName, setServerName] = useState('');
  const [verifyLevel, setVerifyLevel] = useState(0);
  const [explicitFilter, setExplicitFilter] = useState(0);
  const [afkTimeout, setAfkTimeout] = useState(300);
  const [notifLevel, setNotifLevel] = useState(0);
  const [emojiName, setEmojiName] = useState('');
  const [emojiFile, setEmojiFile] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventStart, setEventStart] = useState('');
  const [eventDesc, setEventDesc] = useState('');

  const showToast = (msg: string, ok: boolean) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000); };
  const loadSettings = useCallback(async () => {
    if (!urlRef.current) { setError('Bot API URL girilmemis.'); return; }
    setLoading(true); setError(null);
    const res = await api('/api/server/' + guildId + '/settings');
    if (res.ok) {
      const d = res.data as any;
      setServerInfo(d);
      setServerName(d.name || '');
      setVerifyLevel(d.verificationLevel || 0);
      setExplicitFilter(d.explicitContentFilter || 0);
      setAfkTimeout(d.afkTimeout || 300);
      setNotifLevel(d.defaultMessageNotifications || 0);
    } else setError(String(res.error || 'Hata'));
    setLoading(false);
  }, [guildId]);

  const loadAudit = useCallback(async () => { setLoading(true); setError(null); const r = await api('/api/server/' + guildId + '/audit'); if (r.ok) setAuditLog(r.data as any[]); else setError(String(r.error || 'Hata')); setLoading(false); }, [guildId]);
  const loadBans = useCallback(async () => { setLoading(true); setError(null); const r = await api('/api/server/' + guildId + '/bans'); if (r.ok) setBans(r.data as any[]); else setError(String(r.error || 'Hata')); setLoading(false); }, [guildId]);
  const loadWebhooks = useCallback(async () => { setLoading(true); setError(null); const r = await api('/api/server/' + guildId + '/webhooks'); if (r.ok) setWebhooks(r.data as any[]); else setError(String(r.error || 'Hata')); setLoading(false); }, [guildId]);
  const loadEmojis = useCallback(async () => { setLoading(true); setError(null); const r = await api('/api/server/' + guildId + '/emojis'); if (r.ok) setEmojis(r.data as any[]); else setError(String(r.error || 'Hata')); setLoading(false); }, [guildId]);
  const loadInvites = useCallback(async () => { setLoading(true); setError(null); const r = await api('/api/server/' + guildId + '/invites'); if (r.ok) setInvites(r.data as any[]); else setError(String(r.error || 'Hata')); setLoading(false); }, [guildId]);
  const loadEvents = useCallback(async () => { setLoading(true); setError(null); const r = await api('/api/server/' + guildId + '/events'); if (r.ok) setEvents(r.data as any[]); else setError(String(r.error || 'Hata')); setLoading(false); }, [guildId]);
  const loadVoice = useCallback(async () => { setLoading(true); setError(null); const r = await api('/api/server/' + guildId + '/voice'); if (r.ok) setVoiceChannels(r.data as any[]); else setError(String(r.error || 'Hata')); setLoading(false); }, [guildId]);
  const loadBoosters = useCallback(async () => { setLoading(true); setError(null); const r = await api('/api/server/' + guildId + '/boosters'); if (r.ok) setBoosters(r.data as any[]); else setError(String(r.error || 'Hata')); setLoading(false); }, [guildId]);
  const loadStats = useCallback(async () => { setLoading(true); setError(null); const r = await api('/api/server/' + guildId + '/stats'); if (r.ok) setStats(r.data); else setError(String(r.error || 'Hata')); setLoading(false); }, [guildId]);

  useEffect(() => {
    if (!urlRef.current) return;
    const loaders: Record<SubTab, () => void> = { settings: loadSettings, audit: loadAudit, bans: loadBans, webhooks: loadWebhooks, emojis: loadEmojis, invites: loadInvites, events: loadEvents, voice: loadVoice, boosters: loadBoosters, stats: loadStats };
    loaders[subTab]();
  }, [subTab, guildId]);
  async function saveSettings() {
    setToast(null);
    const res = await api('/api/server/' + guildId + '/settings', 'POST', { name: serverName, verificationLevel: verifyLevel, explicitContentFilter: explicitFilter, afkTimeout, defaultMessageNotifications: notifLevel });
    if (res.ok) { showToast('Ayarlar kaydedildi', true); loadSettings(); } else showToast(String(res.error || 'hata'), false);
  }

  async function deleteEmoji(id: string) {
    const res = await api('/api/server/' + guildId + '/emojis/' + id, 'DELETE');
    if (res.ok) { showToast('Emoji silindi', true); loadEmojis(); } else showToast(String(res.error || 'hata'), false);
  }

  async function revokeInvite(code: string) {
    const res = await api('/api/server/' + guildId + '/invites/' + code, 'DELETE');
    if (res.ok) { showToast('Davet iptal edildi', true); loadInvites(); } else showToast(String(res.error || 'hata'), false);
  }

  async function createEvent() {
    if (!eventName.trim() || !eventStart) return;
    const startAt = new Date(eventStart).toISOString();
    const res = await api('/api/server/' + guildId + '/events', 'POST', { name: eventName, startAt, description: eventDesc });
    if (res.ok) { showToast('Etkinlik olusturuldu', true); setEventName(''); setEventStart(''); setEventDesc(''); loadEvents(); } else showToast(String(res.error || 'hata'), false);
  }

  async function deleteEvent(id: string) {
    const res = await api('/api/server/' + guildId + '/events/' + id, 'DELETE');
    if (res.ok) { showToast('Etkinlik silindi', true); loadEvents(); } else showToast(String(res.error || 'hata'), false);
  }

  const actionLabel = (a: number) => [,'Uye_atildi','Uye_banlandi','Unban','Kick','Sil_Kanal','Kanal_Duzenle','Kick','Rol_Duzenle','Rol_Devre_Disi','Rol_Silindi','Rol_Olustur','Kanal_Olustur','Kanal_Takma_Ad','Hareket','Degisiklik','Mesaj_Silindi','Bulk_Silindi','Davet_Olustur','Davet_Silindi','Bot_Eklendi','Emoji_Eklendi','Emoji_Silindi','Ikon_Degisikligi','Isim_Degisikligi','Bolge_Eklendi'][a] || '#' + a;
  const tabList: [SubTab, string, typeof Settings][] = [['settings','Ayarlar',Settings],['audit','Denetim',Scroll],['bans','Ban',Ban],['webhooks','Webhook',Link],['emojis','Emoji',Smile],['invites','Davet',Globe],['events','Etkinlik',Calendar],['voice','Ses',Volume2],['boosters','Boost',Gift],['stats','Istatistik',BarChart3]];
  return (
    <div className='space-y-4'>
      {toast && (
        <div className={(toast.ok ? 'bg-emerald/20 text-emerald border border-emerald/40' : 'bg-red-500/20 text-red-400 border border-red-500/40') + ' fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow-lg'}>
          {toast.ok ? <Shield className='h-4 w-4' /> : <AlertTriangle className='h-4 w-4' />}
          {toast.msg}
        </div>
      )}
      <div className='flex flex-wrap items-end gap-3'>
        <label className='block flex-1 min-w-[200px]'>
          <span className='mb-1 block text-xs font-bold text-muted-foreground'>Sunucu ID</span>
          <input value={guildId} onChange={e => setGuildId(e.target.value)} className={IC} />
        </label>
      </div>
      {!urlRef.current && <div className='flex items-center gap-2 rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm font-semibold text-yellow-400'><AlertTriangle className='h-4 w-4' /> Bot API URL girilmemis.</div>}

      <div className='flex gap-2 overflow-x-auto pb-1'>
        {tabList.map(([id, label, Icon]) => (
          <button key={id} onClick={() => setSubTab(id)} className={BC + ' whitespace-nowrap ' + (subTab === id ? ' bg-gold/30 text-gold border border-gold/40' : ' bg-surface text-muted-foreground border border-border')}>
            <Icon className='h-3.5 w-3.5' /> {label}
          </button>
        ))}
      </div>
      {error && <div className='flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive'><AlertTriangle className='h-4 w-4' /> {error}</div>}
      {loading && <div className='flex justify-center py-8'><Loader2 className='h-6 w-6 animate-spin text-gold' /></div>}
      {/* SETTINGS */}
      {subTab === 'settings' && serverInfo && !loading && (
        <div className='space-y-4'>
          <div className='rounded-2xl border border-border bg-surface/50 p-5'>
            <div className='flex items-center gap-4 mb-4'>
              {serverInfo.icon && <img src={serverInfo.icon} alt='' className='h-16 w-16 rounded-2xl' />}
              <div><h3 className='font-display text-xl font-extrabold'>{serverInfo.name}</h3><p className='text-xs text-muted-foreground'>ID: {serverInfo.id}</p></div>
            </div>
            <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
              <div className='rounded-xl border border-border bg-background/50 p-3'><p className='text-[10px] font-bold text-muted-foreground'>Toplam Uye</p><p className='text-lg font-bold text-gold'>{serverInfo.memberCount?.toLocaleString('tr-TR')}</p></div>
              <div className='rounded-xl border border-border bg-background/50 p-3'><p className='text-[10px] font-bold text-muted-foreground'>Online</p><p className='text-lg font-bold text-emerald'>{serverInfo.online}</p></div>
              <div className='rounded-xl border border-border bg-background/50 p-3'><p className='text-[10px] font-bold text-muted-foreground'>Boost</p><p className='text-lg font-bold text-pink-400'>{serverInfo.boostCount} (Seviye {serverInfo.boostTier})</p></div>
              <div className='rounded-xl border border-border bg-background/50 p-3'><p className='text-[10px] font-bold text-muted-foreground'>Bot/Uye</p><p className='text-lg font-bold text-blue-400'>{serverInfo.bots}/{serverInfo.humans}</p></div>
            </div>
          </div>
          <div className='rounded-2xl border border-border bg-surface/50 p-5 space-y-3'>
            <h4 className='text-sm font-bold text-gold'>Sunucu Ayarlari</h4>
            <label className='block'><span className='mb-1 block text-xs font-bold text-muted-foreground'>Sunucu Adi</span><input value={serverName} onChange={e => setServerName(e.target.value)} className={IC} /></label>
            <div className='grid gap-3 sm:grid-cols-2'>
              <label className='block'><span className='mb-1 block text-xs font-bold text-muted-foreground'>Dogrulama Seviyesi</span>
                <select value={verifyLevel} onChange={e => setVerifyLevel(parseInt(e.target.value))} className={IC}>
                  <option value={0}>Yok</option><option value={1}>Dusuk</option><option value={2}>Orta</option><option value={3}>Yuksek</option><option value={4}>Cok Yuksek</option>
                </select>
              </label>
              <label className='block'><span className='mb-1 block text-xs font-bold text-muted-foreground'>Icerik Filtresi</span>
                <select value={explicitFilter} onChange={e => setExplicitFilter(parseInt(e.target.value))} className={IC}>
                  <option value={0}>Kapali</option><option value={1}>Rol olmayanlar</option><option value={2}>Tumu</option>
                </select>
              </label>
              <label className='block'><span className='mb-1 block text-xs font-bold text-muted-foreground'>AFK Zaman Asimi (sn)</span>
                <select value={afkTimeout} onChange={e => setAfkTimeout(parseInt(e.target.value))} className={IC}>
                  <option value={60}>1 dk</option><option value={300}>5 dk</option><option value={900}>15 dk</option><option value={1800}>30 dk</option><option value={3600}>1 sa</option>
                </select>
              </label>
              <label className='block'><span className='mb-1 block text-xs font-bold text-muted-foreground'>Bildirim Seviyesi</span>
                <select value={notifLevel} onChange={e => setNotifLevel(parseInt(e.target.value))} className={IC}>
                  <option value={0}>Tum Mesajlar</option><option value={1}>Sadece Atanmis</option>
                </select>
              </label>
            </div>
            <button onClick={saveSettings} className={BC + ' bg-gold/20 text-gold border border-gold/30 hover:bg-gold/30'}>Kaydet</button>
          </div>
        </div>
      )}
      {/* AUDIT */}
      {subTab === 'audit' && !loading && (
        <div className='space-y-1'>
          {auditLog.map(e => (
            <div key={e.id} className='flex items-center gap-3 rounded-xl border border-border bg-surface/50 px-4 py-3'>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-bold'>{actionLabel(e.action)}</p>
                <p className='text-xs text-muted-foreground'>Yapan: {e.executor || '?'} → {e.target || '?'}</p>
                {e.reason && <p className='text-xs text-muted-foreground'>Sebep: {e.reason}</p>}
              </div>
              <p className='shrink-0 text-[10px] text-muted-foreground'>{e.created ? new Date(e.created).toLocaleString('tr-TR') : '?'}</p>
            </div>
          ))}
          {auditLog.length === 0 && <p className='text-center text-sm text-muted-foreground'>Kayit bulunamadi.</p>}
        </div>
      )}
      {/* BANS */}
      {subTab === 'bans' && !loading && (
        <div className='space-y-1'>
          {bans.map(b => (
            <div key={b.id} className='flex items-center gap-3 rounded-xl border border-border bg-surface/50 px-4 py-3'>
              <Ban className='h-4 w-4 text-red-400 shrink-0' />
              <div className='flex-1 min-w-0'><p className='text-sm font-bold truncate'>{b.username}</p>{b.reason && <p className='text-xs text-muted-foreground'>Sebep: {b.reason}</p>}</div>
              <p className='shrink-0 text-[10px] text-muted-foreground font-mono'>{b.id}</p>
            </div>
          ))}
          {bans.length === 0 && <p className='text-center text-sm text-muted-foreground'>Ban listesi bos.</p>}
        </div>
      )}
      {/* WEBHOOKS */}
      {subTab === 'webhooks' && !loading && (
        <div className='space-y-1'>
          {webhooks.map(w => (
            <div key={w.id} className='flex items-center gap-3 rounded-xl border border-border bg-surface/50 px-4 py-3'>
              <Link className='h-4 w-4 text-blue-400 shrink-0' />
              <div className='flex-1 min-w-0'><p className='text-sm font-bold truncate'>{w.name || 'Webhook'}</p><p className='text-xs text-muted-foreground'>Kanal: {w.channel || '?'}</p></div>
              {w.url && <a href={w.url} target='_blank' rel='noopener noreferrer' className={BC + ' bg-blue-500/10 text-blue-400'}>URL</a>}
            </div>
          ))}
          {webhooks.length === 0 && <p className='text-center text-sm text-muted-foreground'>Webhook bulunamadi.</p>}
        </div>
      )}
      {/* EMOJIS */}
      {subTab === 'emojis' && !loading && (
        <div className='space-y-4'>
          <div className='flex flex-wrap gap-2'>
            {emojis.map(e => (
              <div key={e.id} className='flex items-center gap-2 rounded-xl border border-border bg-surface/50 px-3 py-2'>
                <img src={e.url} alt={e.name} className='h-8 w-8' />
                <span className='text-xs font-bold'>:{e.name}: {e.animated && <span className='text-yellow-400'>(A)</span>}</span>
                <button onClick={() => { if (confirm('Emoji silinsin mi?')) deleteEmoji(e.id); }} className='text-red-400 hover:text-red-300'><Trash2 className='h-3 w-3' /></button>
              </div>
            ))}
            {emojis.length === 0 && <p className='text-sm text-muted-foreground'>Emoji bulunamadi.</p>}
          </div>
        </div>
      )}
      {/* INVITES */}
      {subTab === 'invites' && !loading && (
        <div className='space-y-1'>
          {invites.map(i => (
            <div key={i.code} className='flex items-center gap-3 rounded-xl border border-border bg-surface/50 px-4 py-3'>
              <Globe className='h-4 w-4 text-blue-400 shrink-0' />
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-bold font-mono'>{i.code}</p>
                <p className='text-xs text-muted-foreground'>Kanal: {i.channel} | Kullanan: {i.creator} | {i.uses}/{i.maxUses || '∞'} kullanim</p>
              </div>
              <button onClick={() => { if (confirm('Davet iptal edilsin mi?')) revokeInvite(i.code); }} className={BC + ' bg-red-500/10 text-red-400'}>Iptal</button>
            </div>
          ))}
          {invites.length === 0 && <p className='text-center text-sm text-muted-foreground'>Davet bulunamadi.</p>}
        </div>
      )}
      {/* EVENTS */}
      {subTab === 'events' && !loading && (
        <div className='space-y-4'>
          <div className='rounded-2xl border border-border bg-surface/50 p-5'>
            <h4 className='mb-3 text-sm font-bold text-gold'>Yeni Etkinlik</h4>
            <div className='flex flex-wrap items-end gap-3'>
              <input value={eventName} onChange={e => setEventName(e.target.value)} placeholder='Etkinlik adi' className={IC + ' flex-1 min-w-[200px]'} />
              <input type='datetime-local' value={eventStart} onChange={e => setEventStart(e.target.value)} min={new Date(Date.now()+600000).toISOString().slice(0,16)} className={IC + ' min-w-[200px]'} />
              <input value={eventDesc} onChange={e => setEventDesc(e.target.value)} placeholder='Aciklama' className={IC + ' flex-1 min-w-[200px]'} />
              <button onClick={createEvent} disabled={!eventName.trim() || !eventStart} className={BC + ' bg-gold/20 text-gold border border-gold/30 hover:bg-gold/30'}>Olustur</button>
            </div>
          </div>
          {events.map(ev => (
            <div key={ev.id} className='flex items-center gap-3 rounded-xl border border-border bg-surface/50 px-4 py-3'>
              <Calendar className='h-4 w-4 text-purple-400 shrink-0' />
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-bold'>{ev.name}</p>
                <p className='text-xs text-muted-foreground'>Durum: {ev.status} | Baslangic: {ev.scheduledStartAt ? new Date(ev.scheduledStartAt).toLocaleString('tr-TR') : '?'}</p>
                {ev.description && <p className='text-xs text-muted-foreground'>{ev.description}</p>}
              </div>
              <button onClick={() => { if (confirm('Etkinlik silinsin mi?')) deleteEvent(ev.id); }} className={BC + ' bg-red-500/10 text-red-400'}><Trash2 className='h-3.5 w-3.5' /></button>
            </div>
          ))}
          {events.length === 0 && <p className='text-center text-sm text-muted-foreground'>Etkinlik bulunamadi.</p>}
        </div>
      )}
      {/* VOICE */}
      {subTab === 'voice' && !loading && (
        <div className='space-y-3'>
          {voiceChannels.map(vc => (
            <div key={vc.id} className='rounded-xl border border-border bg-surface/50 px-4 py-3'>
              <div className='flex items-center gap-2 mb-2'>
                <Volume2 className='h-4 w-4 text-indigo-400' />
                <p className='text-sm font-bold'>{vc.name}</p>
                <span className='rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-bold text-indigo-400'>{vc.users.length} kisi</span>
              </div>
              {vc.users.length > 0 && (
                <div className='flex flex-wrap gap-2 ml-6'>
                  {vc.users.map((u: any) => (
                    <div key={u.id} className='flex items-center gap-1 rounded-lg border border-border bg-background/50 px-2 py-1'>
                      <span className='text-[10px] font-bold'>{u.displayName || u.username}</span>
                      {u.muted && <span className='text-[8px] text-yellow-400'>M</span>}
                      {u.deafened && <span className='text-[8px] text-red-400'>D</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {voiceChannels.length === 0 && <p className='text-center text-sm text-muted-foreground'>Ses kanali bulunamadi.</p>}
        </div>
      )}
      {/* BOOSTERS */}
      {subTab === 'boosters' && !loading && (
        <div className='space-y-1'>
          {boosters.map(b => (
            <div key={b.id} className='flex items-center gap-3 rounded-xl border border-border bg-surface/50 px-4 py-3'>
              <img src={b.avatar} alt='' className='h-8 w-8 rounded-full' />
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-bold'>{b.displayName || b.username}</p>
                <p className='text-xs text-muted-foreground'>Boost: {b.since ? new Date(b.since).toLocaleDateString('tr-TR') : '?'}</p>
              </div>
              <Gift className='h-4 w-4 text-pink-400' />
            </div>
          ))}
          {boosters.length === 0 && <p className='text-center text-sm text-muted-foreground'>Boost bulunamadi.</p>}
        </div>
      )}
      {/* STATS */}
      {subTab === 'stats' && stats && !loading && (
        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
          {[
            ['Toplam Uye', stats.total, 'text-gold'],
            ['Online', stats.onlineMembers, 'text-emerald'],
            ['Bot', stats.bots, 'text-blue-400'],
            ['Uye (Insan)', stats.humans, 'text-gold'],
            ['Rol', stats.roles, 'text-purple-400'],
            ['Kanal', stats.channels, 'text-indigo-400'],
            ['Yazi Kanal', stats.textChannels, 'text-blue-400'],
            ['Ses Kanal', stats.voiceChannels, 'text-indigo-400'],
            ['Kategori', stats.categories, 'text-purple-400'],
            ['Emoji', stats.emojis, 'text-yellow-400'],
            ['Boost', stats.boostCount, 'text-pink-400'],
            ['Seste', stats.voiceMembers, 'text-indigo-400'],
          ].map(([label, val, color]) => (
            <div key={String(label)} className='rounded-xl border border-border bg-surface/50 p-4'>
              <p className='text-[10px] font-bold text-muted-foreground'>{String(label)}</p>
              <p className={'text-2xl font-bold ' + color}>{Number(val)?.toLocaleString('tr-TR') ?? 0}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
