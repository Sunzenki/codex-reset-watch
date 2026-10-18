import type { Locale } from './i18n';
export const journalCopy = {
  en: {
    title: 'Reset journal', subtitle: 'Small resets. More room to build.', caption: 'A little more room for what comes next.',
    dateNote: 'Every reset is a new beginning.', enable: 'Get reset reminders', source: 'View original post',
    confirmation: 'Public confirmation, not the exact execution time.',
    recent: 'Recent records', recentNote: 'Public posts, kept in order.', all: 'View full history',
    notes: 'Sources & time notes', noRecent: 'No earlier records yet.', completed: 'Confirmed complete', announced: 'Announcement',
    day: (n: string) => `Day ${n}`, global: 'Global reset', banked: 'Banked reset', rules: 'Usage rules',
    reminderHint: 'Get reset notifications in your browser.', sourceLabel: 'Original source', friends: 'Friends',
  },
  'zh-CN': {
    title: '重置手账', subtitle: '看见重置的节奏，', caption: '也看见持续创作的可能。',
    dateNote: '每一次重置，都是新的开始。', enable: '开启重置提醒', source: '查看原帖',
    confirmation: '公开确认时间，不代表后台精确执行时刻。',
    recent: '最近记录', recentNote: '在时间的刻度上，记录每一次更新。', all: '查看完整历史',
    notes: '来源与时间说明', noRecent: '暂时没有更早的记录。', completed: '已完成', announced: '预告',
    day: (n: string) => `第 ${n} 天`, global: '全局重置', banked: '储备重置', rules: '规则调整',
    reminderHint: '通过浏览器接收重置通知。', sourceLabel: '公开原帖', friends: '友情链接',
  },
  'zh-TW': {
    title: '重置手帳', subtitle: '看見重置的節奏，', caption: '也看見持續創作的可能。',
    dateNote: '每一次重置，都是新的開始。', enable: '開啟重置提醒', source: '查看原帖',
    confirmation: '公開確認時間，不代表後台精確執行時間。',
    recent: '最近記錄', recentNote: '在時間的刻度上，記錄每一次更新。', all: '查看完整歷史',
    notes: '來源與時間說明', noRecent: '暫時沒有更早的記錄。', completed: '已完成', announced: '預告',
    day: (n: string) => `第 ${n} 天`, global: '全域重置', banked: '儲備重置', rules: '規則調整',
    reminderHint: '透過瀏覽器接收重置通知。', sourceLabel: '公開原帖', friends: '友情連結',
  },
} satisfies Record<Locale, object>;
