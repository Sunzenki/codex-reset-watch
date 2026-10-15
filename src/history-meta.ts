import type { Locale } from './i18n';
export type EventType = 'reset' | 'banked' | 'announcement' | 'rule_change';
export type TimeBasis = 'confirmation' | 'announcement' | 'estimated' | 'scheduled' | 'observation';
export type HistoryMeta = { eventType: EventType; resetType: 'reset' | 'banked'; timeBasis: TimeBasis };
export const historyLabels = {
  en: { reset: 'Global reset', banked: 'Banked reset', announcement: 'Reset announcement', rule_change: 'Rule change', bankedAnnouncement: 'Banked reset announcement', confirmation: 'Confirmation posted', announcementTime: 'Post published', estimated: 'Approximate time', observation: 'Observation recorded', scheduled: 'Announced time' },
  'zh-CN': { reset: '全局重置', banked: '储备重置', announcement: '重置预告', rule_change: '规则调整', bankedAnnouncement: '储备重置预告', confirmation: '发帖确认时间', announcementTime: '原帖发布时间', estimated: '近似时间', observation: '观察记录时间', scheduled: '预告指定时间' },
  'zh-TW': { reset: '全域重置', banked: '儲備重置', announcement: '重置預告', rule_change: '規則調整', bankedAnnouncement: '儲備重置預告', confirmation: '發帖確認時間', announcementTime: '原帖發佈時間', estimated: '近似時間', observation: '觀察記錄時間', scheduled: '預告指定時間' },
};
export function eventTitle(record: Pick<HistoryMeta, 'eventType' | 'resetType'>, locale: Locale) {
  const labels = historyLabels[locale];
  return record.eventType === 'announcement' && record.resetType === 'banked' ? labels.bankedAnnouncement : labels[record.eventType];
}
export function timeLabel(basis: TimeBasis, locale: Locale) {
  return historyLabels[locale][basis === 'announcement' ? 'announcementTime' : basis];
}
