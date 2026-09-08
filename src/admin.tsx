import { StrictMode, useEffect, useState, type FormEvent } from 'react';
import { createRoot } from 'react-dom/client';
import './admin.css';

type Locale = 'en' | 'zh-CN' | 'zh-TW';
type Message = { title: string; body: string; path: string };
type PushPayload = { eventId: string; messages: Record<Locale, Message> };
type Overview = {
  subscriptions: { active: number; inactive: number; total: number };
  events: Array<{ event_id: string; created_at: string; delivered: number; failed: number; pending: number }>;
};

const localeNames: Record<Locale, string> = { en: 'English', 'zh-CN': '简体中文', 'zh-TW': '繁體中文' };
const emptyMessage = (): PushPayload => ({
  eventId: '',
  messages: {
    en: { title: '', body: '', path: '/en/' },
    'zh-CN': { title: '', body: '', path: '/zh-CN/' },
    'zh-TW': { title: '', body: '', path: '/zh-TW/' },
  },
});

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, { credentials: 'same-origin', ...init });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || `请求失败（${response.status}）`);
  return result;
}

function AdminApp() {
  const [stage, setStage] = useState<'loading' | 'login' | 'dashboard'>('loading');
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    api<{ configured: boolean; authenticated: boolean }>('/api/admin/session')
      .then((result) => { setConfigured(result.configured); setStage(result.authenticated ? 'dashboard' : 'login'); })
      .catch(() => setStage('login'));
  }, []);

  if (stage === 'loading') return <main className="admin-shell admin-loading"><p>正在检查管理会话…</p></main>;
  return stage === 'login'
    ? <Login configured={configured} onSuccess={() => setStage('dashboard')} />
    : <Dashboard onLogout={() => setStage('login')} />;
}

function Login({ configured, onSuccess }: { configured: boolean; onSuccess: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true); setError('');
    try {
      await api('/api/admin/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ username, password }) });
      onSuccess();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '登录失败，请重试。');
    } finally { setBusy(false); }
  }

  return <main className="admin-shell login-layout">
    <section className="login-card" aria-labelledby="login-title">
      <a className="admin-brand" href="/zh-CN/"><img src="/logo.svg" width="202" height="50" alt="Codex Reset Watch" /></a>
      <p className="admin-kicker">PRIVATE CONSOLE</p>
      <h1 id="login-title">推送管理后台</h1>
      <p className="login-copy">仅供站点管理员查看订阅统计和发送重置通知。</p>
      {!configured && <p className="setup-notice" role="alert">本地管理账号尚未配置。需要先设置三个管理环境变量。</p>}
      <form onSubmit={submit}>
        <label htmlFor="username">管理员账号</label>
        <input id="username" name="username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} disabled={!configured || busy} required />
        <label htmlFor="password">密码</label>
        <input id="password" name="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={!configured || busy} required />
        {error && <p className="form-error" role="alert">{error}</p>}
        <button type="submit" disabled={!configured || busy}>{busy ? '正在登录…' : '进入后台'}</button>
      </form>
      <a className="back-link" href="/zh-CN/">← 返回网站</a>
    </section>
  </main>;
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [payload, setPayload] = useState<PushPayload>(emptyMessage);
  const [activeLocale, setActiveLocale] = useState<Locale>('zh-CN');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  async function refresh() {
    const result = await api<Overview>('/api/admin/overview');
    setOverview(result);
  }

  useEffect(() => {
    Promise.all([
      refresh(),
      fetch('/data/push-message.json', { cache: 'no-store' }).then((response) => response.json()),
    ]).then(([, message]) => setPayload(message)).catch((reason) => setError(reason instanceof Error ? reason.message : '后台数据加载失败。'));
  }, []);

  function updateMessage(field: keyof Message, value: string) {
    setPayload((current) => ({ ...current, messages: { ...current.messages, [activeLocale]: { ...current.messages[activeLocale], [field]: value } } }));
  }

  async function send() {
    setError(''); setNotice('');
    const active = overview?.subscriptions.active ?? 0;
    if (!window.confirm(`确认向 ${active} 个有效浏览器订阅发送这条通知？\n\n事件 ID：${payload.eventId}\n此操作会创建正式发送记录。`)) return;
    setBusy(true);
    try {
      for (let attempt = 0; attempt < 1100; attempt++) {
        const result = await api<{ done: boolean; delivered: number; failed: number; pending: number; lastStatus?: number; lastError?: string }>('/api/push/send', {
          method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload),
        });
        const diagnostic = result.lastError
          ? `；诊断：${result.lastError}`
          : result.lastStatus && result.lastStatus !== 201 && result.lastStatus !== 202
            ? `；推送服务 HTTP ${result.lastStatus}`
            : '';
        setNotice(`已送达 ${result.delivered}，失败 ${result.failed}，待发送 ${result.pending}${diagnostic}`);
        if (result.done) break;
      }
      await refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '发送失败，请检查后重试。');
    } finally { setBusy(false); }
  }

  async function logout() {
    try { await api('/api/admin/logout', { method: 'POST' }); } finally { onLogout(); }
  }

  const message = payload.messages[activeLocale];
  return <main className="admin-shell dashboard">
    <header className="admin-header">
      <a className="admin-brand" href="/zh-CN/"><img src="/logo.svg" width="202" height="50" alt="Codex Reset Watch" /></a>
      <div><a href="/zh-CN/">查看网站</a><button className="quiet-button" type="button" onClick={logout}>退出登录</button></div>
    </header>

    <section className="dashboard-intro">
      <div><p className="admin-kicker">PUSH CONTROL</p><h1>动态通知管理</h1><p>查看浏览器订阅，预览并手动发送一次重置消息。</p></div>
      <button className="refresh-button" type="button" onClick={() => refresh().catch(() => setError('统计刷新失败。'))}>刷新数据</button>
    </section>

    <section className="stat-grid" aria-label="订阅统计">
      <article className="stat-primary"><span>有效订阅</span><strong>{overview?.subscriptions.active ?? '—'}</strong><small>可接收下一次通知的浏览器</small></article>
      <article><span>已停用</span><strong>{overview?.subscriptions.inactive ?? '—'}</strong><small>取消订阅或失效的浏览器</small></article>
      <article><span>累计记录</span><strong>{overview?.subscriptions.total ?? '—'}</strong><small>数据库保存过的浏览器订阅</small></article>
    </section>

    <section className="composer-grid">
      <div className="composer-card">
        <div className="section-heading"><div><p className="admin-kicker">MESSAGE</p><h2>编辑通知</h2></div><span>3 种语言</span></div>
        <label htmlFor="event-id">事件 ID</label>
        <input id="event-id" value={payload.eventId} onChange={(event) => setPayload((current) => ({ ...current, eventId: event.target.value }))} pattern="[A-Za-z0-9_-]{4,64}" required />
        <p className="field-help">每次正式消息必须使用新的 ID，重复 ID 不会重复创建发送任务。</p>
        <div className="locale-tabs" role="tablist" aria-label="通知语言">
          {(Object.keys(localeNames) as Locale[]).map((locale) => <button key={locale} type="button" role="tab" aria-selected={activeLocale === locale} onClick={() => setActiveLocale(locale)}>{localeNames[locale]}</button>)}
        </div>
        <label htmlFor="message-title">通知标题 <span>{message.title.length}/80</span></label>
        <input id="message-title" value={message.title} maxLength={80} onChange={(event) => updateMessage('title', event.target.value)} />
        <label htmlFor="message-body">通知正文 <span>{message.body.length}/180</span></label>
        <textarea id="message-body" rows={4} value={message.body} maxLength={180} onChange={(event) => updateMessage('body', event.target.value)} />
        <label htmlFor="message-path">点击后跳转</label>
        <input id="message-path" value={message.path} onChange={(event) => updateMessage('path', event.target.value)} />
      </div>

      <aside className="preview-column">
        <div className="preview-card">
          <p className="admin-kicker">WINDOWS PREVIEW</p>
          <div className="notification-preview"><div className="preview-app"><img src="/brand-mark.svg" alt="" /> Codex Reset Watch</div><strong>{message.title || '通知标题'}</strong><p>{message.body || '通知正文会显示在这里。'}</p><small>crw.warpnav.com</small></div>
        </div>
        <div className="send-card">
          <strong>准备发送</strong>
          <p>将按各订阅浏览器的语言发送对应版本。推送服务接受不等于用户必然看到通知。</p>
          {notice && <p className="send-notice" role="status">{notice}</p>}
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="send-button" type="button" disabled={busy || !payload.eventId || !overview} onClick={send}>{busy ? '正在发送…' : `确认并发送给 ${overview?.subscriptions.active ?? 0} 个订阅`}</button>
        </div>
      </aside>
    </section>

    <section className="event-card">
      <div className="section-heading"><div><p className="admin-kicker">RECENT EVENTS</p><h2>最近发送记录</h2></div></div>
      {!overview?.events.length ? <p className="empty-events">暂无发送记录。</p> : <div className="event-table" role="table" aria-label="最近发送记录">
        {overview.events.map((event) => <div className="event-row" role="row" key={event.event_id}>
          <div role="cell"><strong>{event.event_id}</strong><small>{new Date(event.created_at).toLocaleString('zh-CN')}</small></div>
          <span role="cell">已送达 {event.delivered}</span><span role="cell">失败 {event.failed}</span><span role="cell">待发送 {event.pending}</span>
        </div>)}
      </div>}
    </section>
  </main>;
}

createRoot(document.getElementById('root')!).render(<StrictMode><AdminApp /></StrictMode>);
