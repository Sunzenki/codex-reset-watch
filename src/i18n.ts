export type Locale = 'en' | 'zh-CN' | 'zh-TW';

export const localeOptions: { code: Locale; label: string; shortLabel: string }[] = [
  { code: 'en', label: 'English', shortLabel: 'EN' },
  { code: 'zh-CN', label: '简体中文', shortLabel: '简中' },
  { code: 'zh-TW', label: '繁體中文', shortLabel: '繁中' },
];

export const localeConfig: Record<Locale, { intl: string; timeZone: string; htmlLang: string }> = {
  en: { intl: 'en-US', timeZone: 'UTC', htmlLang: 'en' },
  'zh-CN': { intl: 'zh-CN', timeZone: 'Asia/Shanghai', htmlLang: 'zh-CN' },
  'zh-TW': { intl: 'zh-TW', timeZone: 'Asia/Taipei', htmlLang: 'zh-TW' },
};

export const ui = {
  en: {
    skip: 'Skip to main content', navCurrent: 'Next reset', navHistory: 'History', language: 'Language',
    titleCurrent: 'Next Codex reset | Codex Reset Watch', titleHistory: 'Reset history | Codex Reset Watch',
    status: { monitoring: 'Watching for updates', estimated: 'Approximate time', confirmed: 'Time confirmed', reached: 'Expected time reached', superseded: 'Estimate revised' },
    outcome: { unverified: 'Not independently verified', as_announced: 'No later correction found', revised: 'Later revised', cancelled: 'Announcement cancelled' },
    nextLabel: 'Next rate-limit reset', scopeSuffix: 'Human-curated and unofficial. Not affiliated with OpenAI.',
    targetZone: 'UTC', localTime: 'Your local time', countdown: 'Time until the expected reset',
    units: { days: 'days', hours: 'hours', minutes: 'min', seconds: 'sec' },
    railStart: 'Post published', railEnd: 'Expected reset', waitingTitle: 'Waiting for the next verified public update',
    waitingBody: 'Until a time is announced, this site does not predict the next reset from past intervals.',
    factOriginal: 'Original wording', factZone: 'Source time zone', factUpdated: 'Site updated',
    sourceLabel: 'Source & context', evidenceTitle: 'What this is based on', source: 'Source', viewPost: 'View original post', postedAt: 'Posted',
    noEvidence: 'There is no active reset announcement', archive: 'Archive', viewHistory: 'View reset history',
    historyLabel: 'Reset archive', historyTitle: 'Reset history', historyIntro: 'A record of public posts, time conversions, and later corrections. Past intervals are not used to predict future resets.',
    recorded: 'recorded events', emptyNumber: '00', emptyTitle: 'The archive begins with the next verifiable announcement',
    emptyBody: 'There are no records with a fully verifiable post, time, and outcome yet. An empty archive is better than filling gaps with guesses.',
    back: 'Back to next reset', precise: 'Exact time', approximate: 'Approximate time', original: 'Original',
    loadingCurrent: 'Loading the latest status…', loadingHistory: 'Loading reset history…', loadCurrentError: 'Could not load the status file',
    loadHistoryError: 'Could not load the history file', checkJson: 'Check the JSON data and redeploy.',
    footer: '© 2026 Codex Reset Watch · An unofficial just-for-fun site by WarpNav', warpnav: 'WarpNav main site',
    headline: { monitoring: 'Watching for the next Codex reset', estimated: 'Reset expected around', confirmed: 'Reset expected at', reached: 'Expected reset time reached', superseded: 'The previous estimate was revised' },
  },
  'zh-CN': {
    skip: '跳到主要内容', navCurrent: '下次重置', navHistory: '历史记录', language: '语言',
    titleCurrent: 'Codex 下次重置时间｜Codex Reset Watch', titleHistory: '历史重置记录｜Codex Reset Watch',
    status: { monitoring: '持续关注中', estimated: '近似时间', confirmed: '时间已确认', reached: '预告时间已到', superseded: '预告已被修正' },
    outcome: { unverified: '暂未验证', as_announced: '未发现后续修正', revised: '后续已修正', cancelled: '预告已取消' },
    nextLabel: 'Next rate-limit reset', scopeSuffix: '本站为人工整理，非 OpenAI 官方信息。',
    targetZone: '北京时间（UTC+8）', localTime: '你的本地时间', countdown: '距离预告重置时间',
    units: { days: '天', hours: '时', minutes: '分', seconds: '秒' },
    railStart: '原帖发布', railEnd: '预计重置', waitingTitle: '等待下一条经过核对的公开预告',
    waitingBody: '在时间出现之前，不根据历史记录推测下一次重置。',
    factOriginal: '原帖时间', factZone: '原始时区', factUpdated: '本站更新',
    sourceLabel: 'Source & context', evidenceTitle: '信息依据', source: '来源', viewPost: '查看原帖', postedAt: '发布于',
    noEvidence: '当前没有有效的重置预告', archive: 'Archive', viewHistory: '查看历史重置记录',
    historyLabel: 'Reset archive', historyTitle: '历史重置记录', historyIntro: '保存当时公开发言、时间换算与后续修正。记录只描述已有证据，不用历史间隔预测未来。',
    recorded: '已记录事件', emptyNumber: '00', emptyTitle: '档案从下一次有效预告开始',
    emptyBody: '目前没有能够完整核对原帖、时间与结果的历史记录。宁可暂时留空，也不补写无法验证的数据。',
    back: '返回下次重置', precise: '明确时间', approximate: '近似时间', original: '原帖',
    loadingCurrent: '正在读取最新状态…', loadingHistory: '正在读取历史记录…', loadCurrentError: '状态文件读取失败',
    loadHistoryError: '历史记录读取失败', checkJson: '请检查 JSON 数据格式后重新部署。',
    footer: '© 2026 Codex Reset Watch · 由 WarpNav 制作的非官方趣味小站', warpnav: 'WarpNav 主站',
    headline: { monitoring: '正在等待下一次 Codex 重置消息', estimated: '预计重置时间约为', confirmed: '预计重置时间为', reached: '预告重置时间已到', superseded: '此前的重置预告已被修正' },
  },
  'zh-TW': {
    skip: '跳到主要內容', navCurrent: '下次重置', navHistory: '歷史記錄', language: '語言',
    titleCurrent: 'Codex 下次重置時間｜Codex Reset Watch', titleHistory: '歷史重置記錄｜Codex Reset Watch',
    status: { monitoring: '持續關注中', estimated: '近似時間', confirmed: '時間已確認', reached: '預告時間已到', superseded: '預告已被修正' },
    outcome: { unverified: '暫未驗證', as_announced: '未發現後續修正', revised: '後續已修正', cancelled: '預告已取消' },
    nextLabel: 'Next rate-limit reset', scopeSuffix: '本站為人工整理，並非 OpenAI 官方資訊。',
    targetZone: '台北時間（UTC+8）', localTime: '你的本地時間', countdown: '距離預告重置時間',
    units: { days: '天', hours: '時', minutes: '分', seconds: '秒' },
    railStart: '原帖發佈', railEnd: '預計重置', waitingTitle: '等待下一則經過核對的公開預告',
    waitingBody: '在時間公佈之前，不根據歷史記錄推測下一次重置。',
    factOriginal: '原帖時間', factZone: '原始時區', factUpdated: '本站更新',
    sourceLabel: 'Source & context', evidenceTitle: '資訊依據', source: '來源', viewPost: '查看原帖', postedAt: '發佈於',
    noEvidence: '目前沒有有效的重置預告', archive: 'Archive', viewHistory: '查看歷史重置記錄',
    historyLabel: 'Reset archive', historyTitle: '歷史重置記錄', historyIntro: '保存當時的公開發言、時間換算與後續修正。記錄只描述已有證據，不以歷史間隔預測未來。',
    recorded: '筆已記錄事件', emptyNumber: '00', emptyTitle: '檔案從下一次有效預告開始',
    emptyBody: '目前沒有能夠完整核對原帖、時間與結果的歷史記錄。寧可暫時留空，也不補寫無法驗證的資料。',
    back: '返回下次重置', precise: '明確時間', approximate: '近似時間', original: '原帖',
    loadingCurrent: '正在讀取最新狀態…', loadingHistory: '正在讀取歷史記錄…', loadCurrentError: '狀態檔案讀取失敗',
    loadHistoryError: '歷史記錄讀取失敗', checkJson: '請檢查 JSON 資料格式後重新部署。',
    footer: '© 2026 Codex Reset Watch · 由 WarpNav 製作的非官方趣味小站', warpnav: 'WarpNav 主站',
    headline: { monitoring: '正在等待下一次 Codex 重置消息', estimated: '預計重置時間約為', confirmed: '預計重置時間為', reached: '預告重置時間已到', superseded: '先前的重置預告已被修正' },
  },
} as const;

export const currentCopy: Record<Locale, { scope: string; context: string; note: string }> = {
  en: {
    scope: 'Codex rate limits; the post did not specify a plan or quota tier',
    context: 'The reset was expected around 2 PM PST the following day. Reading PST literally converts to Aug 23 at 22:00 UTC. The word “around” means this was not an exact commitment. If PST was used loosely to mean Pacific daylight time, the result could be one hour earlier.',
    note: 'The original post said “14pm”; Tibo then corrected it to “2pm”. “Around” indicates an approximate time.',
  },
  'zh-CN': {
    scope: 'Codex rate limits；原帖未说明具体套餐或额度范围',
    context: '重置预计于次日 PST 下午 2 点左右到来。按原文 PST 字面换算为北京时间 8 月 24 日 06:00 左右；原帖使用 around，因此不是精确承诺。若作者用 PST 泛指太平洋夏令时间，则可能对应 05:00 左右。',
    note: '原帖写作 14pm，Tibo 随后回复纠正为 2pm；around 表明这是近似时间。',
  },
  'zh-TW': {
    scope: 'Codex rate limits；原帖未說明具體方案或額度範圍',
    context: '重置預計於次日 PST 下午 2 點左右到來。按原文 PST 字面換算為台北時間 8 月 24 日 06:00 左右；原帖使用 around，因此不是精確承諾。若作者用 PST 泛指太平洋夏令時間，則可能對應 05:00 左右。',
    note: '原帖寫作 14pm，Tibo 隨後回覆修正為 2pm；around 表示這是近似時間。',
  },
};

type RecordCopy = { context: string; note: string };
export const historyCopy: Record<Locale, Record<string, RecordCopy>> = {
  en: {
    'reset-2026-08-22-banked': { context: 'A banked reset had landed.', note: 'For paid ChatGPT Work and Codex users. This was a banked reset that users had to claim in a supported client; the recorded time is the confirmation post timestamp.' },
    'reset-2026-08-13-next-hour': { context: 'The reset was expected within roughly the next hour.', note: 'The target is the post timestamp plus one hour. It is not an exact landing time, and no separate confirmation post was found.' },
    'reset-2026-07-29-sol': { context: 'Usage limits had been reset for all ChatGPT Work and Codex users.', note: 'The post clearly used completed wording and covered all ChatGPT Work and Codex users. The post timestamp is used as the recorded time.' },
    'reset-2026-07-28-paid-users': { context: 'Usage limits had been reset for all paid Codex and ChatGPT Work users.', note: 'This was the follow-up confirmation to an earlier “back in a few hours” post. The confirmation timestamp is used.' },
    'reset-2026-07-26-outage': { context: 'Usage limits had been reset for all Codex and ChatGPT Work users.', note: 'Tibo linked this reset to a near-global service outage. The post stated that the reset was complete, so its timestamp is used.' },
    'reset-2026-07-22-next-hour': { context: 'A new reset for paid users was expected within the next hour.', note: 'The target is the post timestamp plus one hour. No exact minute or separate landing confirmation was provided.' },
    'reset-2026-07-18-weekend': { context: 'Paid Codex and ChatGPT Work users could use the reset.', note: 'The post described the reset as already available. No separate landing time was given, so the post timestamp is used.' },
    'reset-2026-07-14-banked': { context: 'A banked reset had been added to every account.', note: 'Users needed to claim this banked reset on desktop or web to restore weekly usage. The post timestamp is used.' },
  },
  'zh-CN': {
    'reset-2026-08-22-banked': { context: '储备重置已经到账。', note: '面向 ChatGPT Work 与 Codex 的付费用户。这是 banked reset，需要用户在支持的客户端中自行使用；记录时间采用确认帖发布时间。' },
    'reset-2026-08-13-next-hour': { context: '大家享受这次重置吧，预计在接下来一小时左右到来。', note: '目标时间按原帖发布时间加一小时记录，不代表精确落地时刻；未找到独立的落地确认帖。' },
    'reset-2026-07-29-sol': { context: '我已经为所有 ChatGPT Work 和 Codex 用户重置了使用额度。', note: '原帖明确使用完成时态，适用范围为所有 ChatGPT Work 与 Codex 用户。记录时间采用确认帖发布时间。' },
    'reset-2026-07-28-paid-users': { context: '所有 Codex 与 ChatGPT Work 付费用户的使用额度已经重置。', note: '这是此前“几小时后回来处理”的后续确认帖。记录时间采用确认帖发布时间。' },
    'reset-2026-07-26-outage': { context: '我们已经为所有 Codex 与 ChatGPT Work 用户重置了使用额度。', note: 'Tibo 将这次重置与此前发生的近乎全球性服务中断联系起来。记录时间采用发帖时间。' },
    'reset-2026-07-22-next-hour': { context: 'Codex 与 ChatGPT Work 付费用户将迎来一次新的额度重置，预计在接下来一小时内到来。', note: '目标时间按原帖发布时间加一小时记录。原帖没有提供精确分钟，也未找到独立确认帖。' },
    'reset-2026-07-18-weekend': { context: 'Codex 与 ChatGPT Work 的所有付费用户可以享用这次额度重置。', note: '原帖将重置描述为已经可用。没有单独给出落地时刻，因此采用原帖发布时间。' },
    'reset-2026-07-14-banked': { context: '为庆祝里程碑，我们已经向每个人的账户添加了一次储备重置。', note: '这是 banked reset，需要用户在桌面端或网页端自行使用以恢复每周额度。记录时间采用原帖发布时间。' },
  },
  'zh-TW': {
    'reset-2026-08-22-banked': { context: '儲備重置已經到帳。', note: '面向 ChatGPT Work 與 Codex 的付費使用者。這是 banked reset，需要在支援的用戶端中自行使用；記錄時間採用確認帖發佈時間。' },
    'reset-2026-08-13-next-hour': { context: '大家享受這次重置吧，預計在接下來一小時左右到來。', note: '目標時間按原帖發佈時間加一小時記錄，不代表精確落地時刻；未找到獨立的落地確認帖。' },
    'reset-2026-07-29-sol': { context: '我已經為所有 ChatGPT Work 和 Codex 使用者重置了使用額度。', note: '原帖明確使用完成時態，適用範圍為所有 ChatGPT Work 與 Codex 使用者。記錄時間採用確認帖發佈時間。' },
    'reset-2026-07-28-paid-users': { context: '所有 Codex 與 ChatGPT Work 付費使用者的使用額度已經重置。', note: '這是先前「幾小時後回來處理」的後續確認帖。記錄時間採用確認帖發佈時間。' },
    'reset-2026-07-26-outage': { context: '我們已經為所有 Codex 與 ChatGPT Work 使用者重置了使用額度。', note: 'Tibo 將這次重置與先前發生的近乎全球性服務中斷聯繫起來。記錄時間採用發帖時間。' },
    'reset-2026-07-22-next-hour': { context: 'Codex 與 ChatGPT Work 付費使用者將迎來一次新的額度重置，預計在接下來一小時內到來。', note: '目標時間按原帖發佈時間加一小時記錄。原帖沒有提供精確分鐘，也未找到獨立確認帖。' },
    'reset-2026-07-18-weekend': { context: 'Codex 與 ChatGPT Work 的所有付費使用者可以使用這次額度重置。', note: '原帖將重置描述為已經可用。沒有單獨給出落地時刻，因此採用原帖發佈時間。' },
    'reset-2026-07-14-banked': { context: '為慶祝里程碑，我們已經向每個人的帳戶加入一次儲備重置。', note: '這是 banked reset，需要使用者在桌面版或網頁版自行使用以恢復每週額度。記錄時間採用原帖發佈時間。' },
  },
};

export function localizedSourceTimezone(value: string | null, locale: Locale) {
  if (!value) return locale === 'en' ? 'Not provided' : locale === 'zh-TW' ? '未提供' : '未提供';
  if (value.startsWith('PST')) return locale === 'en' ? 'PST (UTC−8, as written)' : locale === 'zh-TW' ? 'PST（UTC−8，按原文）' : 'PST（UTC−8，按原文）';
  if (value.includes('机器时间戳')) return locale === 'en' ? 'UTC (X timestamp)' : locale === 'zh-TW' ? 'UTC（X 時間戳）' : 'UTC（X 机器时间戳）';
  if (value.includes('相对原帖')) return locale === 'en' ? 'Relative to the post timestamp' : locale === 'zh-TW' ? '相對於原帖發佈時間' : '相对原帖发布时间';
  return value;
}
