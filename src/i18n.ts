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
    skip: 'Skip to main content', navCurrent: 'Latest update', navHistory: 'History', language: 'Language',
    titleCurrent: 'Codex Reset Time & Countdown (UTC) | CRW', titleHistory: 'Codex Reset History | Codex Reset Watch',
    status: { monitoring: 'Watching for updates', estimated: 'Approximate time', confirmed: 'Time confirmed', reached: 'Expected time reached', superseded: 'Estimate revised' },
    outcome: { unverified: 'Not independently verified', as_announced: 'No later correction found', revised: 'Later revised', cancelled: 'Announcement cancelled' },
    nextLabel: 'Next rate-limit reset', bankedLabel: 'Next banked reset', latestLabel: 'Latest rate-limit rollout update', confirmedLabel: 'Latest confirmed usage reset', rolloutStatus: 'Rollout observed', resetConfirmedStatus: 'Reset confirmed', scopeSuffix: 'Human-curated and unofficial. Not affiliated with OpenAI.',
    targetZone: 'UTC', localTime: 'Your local time', countdown: 'Time until the expected reset', bankedCountdown: 'Time until the banked reset is expected to become available',
    units: { days: 'days', hours: 'hours', minutes: 'min', seconds: 'sec' },
    railStart: 'Post published', railEnd: 'Expected reset', bankedRailEnd: 'Expected availability', waitingTitle: 'Waiting for the next verified public update',
    waitingBody: 'Until a time is announced, this site does not predict the next reset from past intervals.', reachedTitle: 'The announced time has arrived', reachedBody: 'The countdown reaching zero does not confirm that the reset has landed. CRW is waiting for a public confirmation or a clearly scoped observation.', bankedReachedHeadline: 'Expected banked-reset availability time reached', bankedReachedTitle: 'The approximate delivery time has arrived', bankedReachedBody: 'This does not confirm that the banked-reset button is available. A banked reset is an optional reset opportunity the user may choose to activate; it is not a forced system reset.', untimedHintTitle: 'Waiting for further details', untimedHintBody: 'The wording points toward a possible milestone reset tomorrow. A countdown will appear only if a usable time is published.',
    rolloutTimingTitle: 'Fresh resets and the 5-hour window have been observed on some Plus accounts', rolloutTimingBody: 'Tibo gave no exact rollout time, and there is no public confirmation that every Plus account changed at once.',
    resetConfirmedTitle: 'Tibo has confirmed that the reset landed', resetConfirmedBody: 'The confirmation post says usage was reset for all paid ChatGPT Work and Codex subscriptions. The earlier 10:00 GMT+8 target was a forecast, not a measured backend execution time; this page uses the post timestamp as the public confirmation time.',
    factOriginal: 'Original wording', factZone: 'Source time zone', factTiming: 'Timing basis', factConfirmation: 'Confirmation basis', factUpdated: 'Site updated',
    sourceLabel: 'Source & context', evidenceTitle: 'What this is based on', source: 'Source', viewPost: 'View original post', postedAt: 'Posted',
    methodLabel: 'Methodology', methodTitle: 'How this tracker works', methodIntro: 'A small, source-first tracker designed to keep estimates, conversions, and confirmed outcomes clearly separated.',
    methodSourceTitle: 'Source-first records', methodSourceBody: 'Every event links to the public post it was derived from. Quotes stay in their original language and later corrections are recorded separately.',
    methodTimeTitle: 'Consistent time conversion', methodTimeBody: 'Times are stored as ISO 8601 UTC. English pages display UTC; Simplified and Traditional Chinese pages display UTC+8.',
    methodCountdownTitle: 'Countdown, not confirmation', methodCountdownBody: 'The timer counts down to the announced estimate. Reaching zero does not by itself prove that a reset happened.',
    machineData: 'View machine-readable data', currentData: 'Current status JSON', historyData: 'History JSON',
    noEvidence: 'There is no active reset announcement', archive: 'Archive', viewHistory: 'View reset history',
    historyLabel: 'Reset archive', historyTitle: 'Reset history', historyIntro: 'A record of public posts, time conversions, and later corrections. Past intervals are not used to predict future resets.',
    recorded: 'recorded events', emptyNumber: '00', emptyTitle: 'The archive begins with the next verifiable announcement',
    emptyBody: 'There are no records with a fully verifiable post, time, and outcome yet. An empty archive is better than filling gaps with guesses.',
    back: 'Back to latest update', precise: 'Exact time', approximate: 'Approximate time', original: 'Original',
    loadingCurrent: 'Loading the latest status…', loadingHistory: 'Loading reset history…', loadCurrentError: 'Could not load the status file',
    loadHistoryError: 'Could not load the history file', checkJson: 'Check the JSON data and redeploy.',
    footer: '© 2026 Codex Reset Watch · An unofficial just-for-fun site by WarpNav', warpnav: 'WarpNav main site',
    headline: { monitoring: 'Watching for the next Codex reset', estimated: 'Reset expected around', confirmed: 'Reset expected at', reached: 'Expected reset time reached', superseded: 'The previous estimate was revised' },
  },
  'zh-CN': {
    skip: '跳到主要内容', navCurrent: '最新动态', navHistory: '历史记录', language: '语言',
    titleCurrent: 'Codex 重置时间与倒计时｜Codex Reset Watch', titleHistory: 'Codex 历史重置记录｜Codex Reset Watch',
    status: { monitoring: '持续关注中', estimated: '近似时间', confirmed: '时间已确认', reached: '预告时间已到', superseded: '预告已被修正' },
    outcome: { unverified: '暂未验证', as_announced: '未发现后续修正', revised: '后续已修正', cancelled: '预告已取消' },
    nextLabel: 'Next rate-limit reset', bankedLabel: 'Next banked reset', latestLabel: 'Latest rate-limit rollout update', confirmedLabel: 'Latest confirmed usage reset', rolloutStatus: '已观察到落地', resetConfirmedStatus: '重置已落地', scopeSuffix: '本站为人工整理，非 OpenAI 官方信息。',
    targetZone: '北京时间（UTC+8）', localTime: '你的本地时间', countdown: '距离预告重置时间', bankedCountdown: '距离储备重置机会预计到账',
    units: { days: '天', hours: '时', minutes: '分', seconds: '秒' },
    railStart: '原帖发布', railEnd: '预计重置', bankedRailEnd: '预计到账', waitingTitle: '等待下一条经过核对的公开预告',
    waitingBody: '在时间出现之前，不根据历史记录推测下一次重置。', reachedTitle: '预告时间已到，等待落地确认', reachedBody: '倒计时归零本身不能证明重置已经发生；本站将等待公开确认或范围明确的实际观察。', bankedReachedHeadline: '储备重置机会的预计到账时间已到', bankedReachedTitle: '近似到账时间已到', bankedReachedBody: '这不能证明储备重置按钮已经出现。banked reset 是用户可自行选择点击使用的重置机会，不是系统强制重置额度。', untimedHintTitle: '等待进一步消息', untimedHintBody: '原帖措辞指向明天可能进行一次里程碑重置；只有出现可用的公开时间后，本站才会显示倒计时。',
    rolloutTimingTitle: '部分用户的 Plus 账号已观察到新重置和 5 小时窗口', rolloutTimingBody: 'Tibo 未给出具体落地时刻，目前也没有公开信息证明所有 Plus 账号在同一时间完成变更。',
    resetConfirmedTitle: 'Tibo 已确认本轮重置落地', resetConfirmedBody: '确认帖表示，ChatGPT Work 与 Codex 的所有付费订阅都已重置使用额度。此前 GMT+8 10:00 是预告目标时间，不是后台实测执行时刻；本页将原帖发布时间作为公开确认时间。',
    factOriginal: '原帖措辞', factZone: '原始时区', factTiming: '时间依据', factConfirmation: '确认依据', factUpdated: '本站更新',
    sourceLabel: 'Source & context', evidenceTitle: '信息依据', source: '来源', viewPost: '查看原帖', postedAt: '发布于',
    methodLabel: 'Methodology', methodTitle: '本站如何整理信息', methodIntro: '这是一个以来源为先的小型记录站，明确区分预估时间、时区换算和已经确认的结果。',
    methodSourceTitle: '保留公开来源', methodSourceBody: '每条记录都链接到对应的公开原帖。引文保留原始语言，后续修正则单独记录。',
    methodTimeTitle: '统一换算时间', methodTimeBody: '所有时间以 ISO 8601 UTC 格式保存。英文页面显示 UTC，简体与繁体中文页面显示 UTC+8。',
    methodCountdownTitle: '倒计时不是确认', methodCountdownBody: '计时器只倒数到公开预告的预计时间。倒计时归零本身并不能证明重置已经发生。',
    machineData: '查看机器可读数据', currentData: '当前状态 JSON', historyData: '历史记录 JSON',
    noEvidence: '当前没有有效的重置预告', archive: 'Archive', viewHistory: '查看历史重置记录',
    historyLabel: 'Reset archive', historyTitle: '历史重置记录', historyIntro: '保存当时公开发言、时间换算与后续修正。记录只描述已有证据，不用历史间隔预测未来。',
    recorded: '已记录事件', emptyNumber: '00', emptyTitle: '档案从下一次有效预告开始',
    emptyBody: '目前没有能够完整核对原帖、时间与结果的历史记录。宁可暂时留空，也不补写无法验证的数据。',
    back: '返回最新动态', precise: '明确时间', approximate: '近似时间', original: '原帖',
    loadingCurrent: '正在读取最新状态…', loadingHistory: '正在读取历史记录…', loadCurrentError: '状态文件读取失败',
    loadHistoryError: '历史记录读取失败', checkJson: '请检查 JSON 数据格式后重新部署。',
    footer: '© 2026 Codex Reset Watch · 由 WarpNav 制作的非官方趣味小站', warpnav: 'WarpNav 主站',
    headline: { monitoring: '正在等待下一次 Codex 重置消息', estimated: '预计重置时间约为', confirmed: '预计重置时间为', reached: '预告重置时间已到', superseded: '此前的重置预告已被修正' },
  },
  'zh-TW': {
    skip: '跳到主要內容', navCurrent: '最新動態', navHistory: '歷史記錄', language: '語言',
    titleCurrent: 'Codex 重置時間與倒數計時｜Codex Reset Watch', titleHistory: 'Codex 歷史重置記錄｜Codex Reset Watch',
    status: { monitoring: '持續關注中', estimated: '近似時間', confirmed: '時間已確認', reached: '預告時間已到', superseded: '預告已被修正' },
    outcome: { unverified: '暫未驗證', as_announced: '未發現後續修正', revised: '後續已修正', cancelled: '預告已取消' },
    nextLabel: 'Next rate-limit reset', bankedLabel: 'Next banked reset', latestLabel: 'Latest rate-limit rollout update', confirmedLabel: 'Latest confirmed usage reset', rolloutStatus: '已觀察到落地', resetConfirmedStatus: '重置已落地', scopeSuffix: '本站為人工整理，並非 OpenAI 官方資訊。',
    targetZone: '台北時間（UTC+8）', localTime: '你的本地時間', countdown: '距離預告重置時間', bankedCountdown: '距離儲備重置機會預計到帳',
    units: { days: '天', hours: '時', minutes: '分', seconds: '秒' },
    railStart: '原帖發佈', railEnd: '預計重置', bankedRailEnd: '預計到帳', waitingTitle: '等待下一則經過核對的公開預告',
    waitingBody: '在時間公佈之前，不根據歷史記錄推測下一次重置。', reachedTitle: '預告時間已到，等待落地確認', reachedBody: '倒數歸零本身不能證明重置已經發生；本站將等待公開確認或範圍明確的實際觀察。', bankedReachedHeadline: '儲備重置機會的預計到帳時間已到', bankedReachedTitle: '近似到帳時間已到', bankedReachedBody: '這不能證明儲備重置按鈕已經出現。banked reset 是使用者可自行選擇點擊使用的重置機會，不是系統強制重置額度。', untimedHintTitle: '等待進一步消息', untimedHintBody: '原帖措辭指向明天可能進行一次里程碑重置；只有出現可用的公開時間後，本站才會顯示倒數計時。',
    rolloutTimingTitle: '部分使用者的 Plus 帳號已觀察到新重置與 5 小時視窗', rolloutTimingBody: 'Tibo 未提供具體落地時間，目前也沒有公開資訊證明所有 Plus 帳號在同一時間完成變更。',
    resetConfirmedTitle: 'Tibo 已確認本輪重置落地', resetConfirmedBody: '確認帖表示，ChatGPT Work 與 Codex 的所有付費訂閱都已重置使用額度。先前 GMT+8 10:00 是預告目標時間，不是後台實測執行時刻；本頁將原帖發佈時間作為公開確認時間。',
    factOriginal: '原帖措辭', factZone: '原始時區', factTiming: '時間依據', factConfirmation: '確認依據', factUpdated: '本站更新',
    sourceLabel: 'Source & context', evidenceTitle: '資訊依據', source: '來源', viewPost: '查看原帖', postedAt: '發佈於',
    methodLabel: 'Methodology', methodTitle: '本站如何整理資訊', methodIntro: '這是一個以來源為先的小型記錄站，明確區分預估時間、時區換算與已確認的結果。',
    methodSourceTitle: '保留公開來源', methodSourceBody: '每筆記錄都連結至對應的公開原帖。引文保留原始語言，後續修正則另外記錄。',
    methodTimeTitle: '統一換算時間', methodTimeBody: '所有時間以 ISO 8601 UTC 格式保存。英文頁面顯示 UTC，簡體與繁體中文頁面顯示 UTC+8。',
    methodCountdownTitle: '倒數不是確認', methodCountdownBody: '計時器只倒數至公開預告的預計時間。倒數歸零本身並不能證明重置已經發生。',
    machineData: '查看機器可讀資料', currentData: '目前狀態 JSON', historyData: '歷史記錄 JSON',
    noEvidence: '目前沒有有效的重置預告', archive: 'Archive', viewHistory: '查看歷史重置記錄',
    historyLabel: 'Reset archive', historyTitle: '歷史重置記錄', historyIntro: '保存當時的公開發言、時間換算與後續修正。記錄只描述已有證據，不以歷史間隔預測未來。',
    recorded: '筆已記錄事件', emptyNumber: '00', emptyTitle: '檔案從下一次有效預告開始',
    emptyBody: '目前沒有能夠完整核對原帖、時間與結果的歷史記錄。寧可暫時留空，也不補寫無法驗證的資料。',
    back: '返回最新動態', precise: '明確時間', approximate: '近似時間', original: '原帖',
    loadingCurrent: '正在讀取最新狀態…', loadingHistory: '正在讀取歷史記錄…', loadCurrentError: '狀態檔案讀取失敗',
    loadHistoryError: '歷史記錄讀取失敗', checkJson: '請檢查 JSON 資料格式後重新部署。',
    footer: '© 2026 Codex Reset Watch · 由 WarpNav 製作的非官方趣味小站', warpnav: 'WarpNav 主站',
    headline: { monitoring: '正在等待下一次 Codex 重置消息', estimated: '預計重置時間約為', confirmed: '預計重置時間為', reached: '預告重置時間已到', superseded: '先前的重置預告已被修正' },
  },
} as const;

export const currentCopy: Record<Locale, { headline: string; scope: string; context: string; note: string }> = {
  en: {
    headline: 'Banked reset expected in about three hours',
    scope: 'Paid ChatGPT users who do not yet have Astra access',
    context: 'Starting on the post date, Tibo said paid ChatGPT plans would receive one banked reset for each day they remain without Astra access. A banked reset is an optional reset opportunity the user may choose to activate, not a forced system reset.',
    note: 'The first was expected in about three hours. CRW uses the post timestamp plus three hours—02:12:09 UTC on September 4—as an approximate countdown anchor, not an exact availability time. The post does not specify the daily cutoff, banking mechanics, or expiration rules.',
  },
  'zh-CN': {
    headline: '储备重置约三小时后到账',
    scope: '面向尚未获得 Astra 的 ChatGPT 付费用户',
    context: 'Tibo 表示，从发帖当天起，付费 ChatGPT 方案每有一天尚未获得 Astra 使用权限，就会得到一次储备重置机会。banked reset 由用户自行选择点击使用，不是系统强制重置额度。',
    note: '第一次预计约三小时后到账。本站以原帖发布时间加三小时，将 9 月 4 日 10:12:09（UTC 02:12:09）作为近似倒计时锚点，不代表精确到账时刻。原帖没有说明每日计算截止点、储备规则或到期方式。',
  },
  'zh-TW': {
    headline: '儲備重置約三小時後到帳',
    scope: '面向尚未取得 Astra 的 ChatGPT 付費使用者',
    context: 'Tibo 表示，從發帖當天起，付費 ChatGPT 方案每有一天尚未取得 Astra 使用權限，就會得到一次儲備重置機會。banked reset 由使用者自行選擇點擊使用，不是系統強制重置額度。',
    note: '第一次預計約三小時後到帳。本站以原帖發佈時間加三小時，將 9 月 4 日 10:12:09（UTC 02:12:09）作為近似倒數錨點，不代表精確到帳時間。原帖沒有說明每日計算截止點、儲備規則或到期方式。',
  },
};

type RecordCopy = { context: string; note: string };
export const historyCopy: Record<Locale, Record<string, RecordCopy>> = {
  en: {
    'reset-2026-08-31-all-paid-confirmed': { context: 'Usage had been reset for every paid ChatGPT Work and Codex subscription.', note: 'Tibo used completed wording. The record uses the confirmation post timestamp, which is a public confirmation time rather than a measured backend execution time.' },
    'reset-2026-08-29-230pm-pacific': { context: 'Usage was being reset for every paid Codex and ChatGPT Work user, with a follow-up landing time of 2:30 PM PST.', note: 'CRW interpreted the time as Pacific local time in August (PDT, UTC−7) and recorded 21:30 UTC. A literal PST conversion would be one hour later. No later delay or correction was found.' },
    'reset-2026-08-25-plus-five-hour-rollout': { context: 'The 5-hour limit began rolling out for Plus accounts across ChatGPT Work and Codex.', note: 'Tibo announced the return for “tomorrow”; fresh resets followed by a 5-hour window were then observed on some Plus accounts. No unified rollout time was published, so the archived time is only the site’s observation timestamp.' },
    'reset-2026-08-24-around-2pm-pst': { context: 'A reset was expected around 2 PM PST the following day and was later observed to have landed.', note: 'The site owner observed the reset, but Tibo did not publish a separate confirmation post. The target preserves the post’s literal PST wording; if PST meant Pacific daylight time loosely, it may have been one hour earlier. Tibo corrected “14pm” to “2pm”.' },
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
    'reset-2026-08-31-all-paid-confirmed': { context: 'ChatGPT Work 与 Codex 的所有付费订阅都已重置使用额度。', note: 'Tibo 使用完成式措辞。记录采用确认帖发布时间，这是公开确认时间，不是后台实测执行时刻。' },
    'reset-2026-08-29-230pm-pacific': { context: 'Tibo 表示正在为所有 Codex 与 ChatGPT Work 付费用户重置额度，并在后续回复中给出 PST 下午 2:30 的落地时间。', note: '本站按 8 月当地实际采用的 PDT（UTC−7）记录为 UTC 21:30；若严格按 PST 字面换算则晚一小时。目前未发现后续延期或修正。' },
    'reset-2026-08-25-plus-five-hour-rollout': { context: 'ChatGPT Work 与 Codex 的 Plus 账户开始恢复 5 小时限制。', note: 'Tibo 预告将于“明天”恢复该限制，随后部分用户的 Plus 账号观察到新重置和 5 小时窗口。由于没有公开统一落地时刻，档案时间仅为本站观察记录时间。' },
    'reset-2026-08-24-around-2pm-pst': { context: '重置预计于次日 PST 下午 2 点左右到来，站长随后实际观察到重置已经落地。', note: 'Tibo 没有另发公开确认帖。目标时间按原文 PST 字面换算；若 PST 泛指太平洋夏令时间，则可能早一小时。原帖的 14pm 随后被作者纠正为 2pm。' },
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
    'reset-2026-08-31-all-paid-confirmed': { context: 'ChatGPT Work 與 Codex 的所有付費訂閱都已重置使用額度。', note: 'Tibo 使用完成式措辭。記錄採用確認帖發佈時間，這是公開確認時間，不是後台實測執行時刻。' },
    'reset-2026-08-29-230pm-pacific': { context: 'Tibo 表示正在為所有 Codex 與 ChatGPT Work 付費使用者重置額度，並在後續回覆中提供 PST 下午 2:30 的落地時間。', note: '本站按 8 月當地實際採用的 PDT（UTC−7）記錄為 UTC 21:30；若嚴格按 PST 字面換算則晚一小時。目前未發現後續延期或修正。' },
    'reset-2026-08-25-plus-five-hour-rollout': { context: 'ChatGPT Work 與 Codex 的 Plus 帳號開始恢復 5 小時限制。', note: 'Tibo 預告將於「明天」恢復該限制，隨後部分使用者的 Plus 帳號觀察到新重置與 5 小時視窗。由於沒有公開統一落地時間，檔案時間僅為本站觀察記錄時間。' },
    'reset-2026-08-24-around-2pm-pst': { context: '重置預計於次日 PST 下午 2 點左右到來，站長隨後實際觀察到重置已經落地。', note: 'Tibo 沒有另發公開確認帖。目標時間按原文 PST 字面換算；若 PST 泛指太平洋夏令時間，則可能早一小時。原帖的 14pm 隨後被作者修正為 2pm。' },
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
  if (value.includes('机器时间戳') || value.includes('X timestamp')) return locale === 'en' ? 'UTC (X timestamp)' : locale === 'zh-TW' ? 'UTC（X 時間戳）' : 'UTC（X 机器时间戳）';
  if (value.startsWith('Site observation timestamp')) return locale === 'en' ? 'Site observation timestamp (UTC)' : locale === 'zh-TW' ? '本站觀察記錄時間（UTC）' : '本站观察记录时间（UTC）';
  if (value.includes('相对原帖')) return locale === 'en' ? 'Relative to the post timestamp' : locale === 'zh-TW' ? '相對於原帖發佈時間' : '相对原帖发布时间';
  if (value.startsWith('Relative date from X post')) return locale === 'en' ? 'Relative date; no time zone specified' : locale === 'zh-TW' ? '相對日期；未提供時區' : '相对日期；未提供时区';
  return value;
}
