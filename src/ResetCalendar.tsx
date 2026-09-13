import { useEffect, useMemo, useState } from 'react';
import { historyCopy, localeConfig, type Locale } from './i18n';

type Item={id:string;targetAt:string;announcement:{url:string};note:string};
type Kind='confirmed'|'observed'|'unverified'|'banked'|'rollout';
const copy={
en:{name:'Reset calendar',prev:'Previous month',next:'Next month',now:'This month',today:'Today',zone:'UTC',empty:'No record for this day',caveat:'No record does not mean no reset occurred.',detail:'View details',latest:'View latest update',confirmed:'Publicly confirmed',observed:'Account observation',unverified:'Unverified announcement',banked:'Banked reset',rollout:'Rollout observed',reset:'Usage reset',astra:'Astra usage reset',note:'Tibo confirmed at {time}. The exact completion time was not published.',week:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],error:'Latest update unavailable; showing archived records.'},
'zh-CN':{name:'重置日历',prev:'上个月',next:'下个月',now:'回到本月',today:'今天',zone:'北京时间 UTC+8',empty:'当天暂无记录',caveat:'未被记录不代表当天没有重置。',detail:'查看详细记录',latest:'查看最新动态',confirmed:'已公开确认',observed:'账号观察',unverified:'未验证预告',banked:'储备重置',rollout:'规则落地观察',reset:'额度重置',astra:'Astra 额度重置',note:'Tibo 于 {time} 发帖确认，实际完成时刻未公布。',week:['周一','周二','周三','周四','周五','周六','周日'],error:'最新动态暂未加载，当前展示已归档记录。'},
'zh-TW':{name:'重置日曆',prev:'上個月',next:'下個月',now:'回到本月',today:'今天',zone:'台北時間 UTC+8',empty:'當天暫無記錄',caveat:'未被記錄不代表當天沒有重置。',detail:'查看詳細記錄',latest:'查看最新動態',confirmed:'已公開確認',observed:'帳號觀察',unverified:'未驗證預告',banked:'儲備重置',rollout:'規則落地觀察',reset:'額度重置',astra:'Astra 額度重置',note:'Tibo 於 {time} 發帖確認，實際完成時刻未公佈。',week:['週一','週二','週三','週四','週五','週六','週日'],error:'最新動態暫未載入，目前顯示已歸檔記錄。'}
};
// Classify evidence explicitly; precise announcement times do not prove completion.
const evidence:Record<string,Kind>={'reset-2026-09-08-global-paid':'observed','reset-2026-08-31-all-paid-confirmed':'confirmed','reset-2026-08-25-plus-five-hour-rollout':'rollout','reset-2026-08-24-around-2pm-pst':'observed','reset-2026-08-22-banked':'banked','reset-2026-07-29-sol':'confirmed','reset-2026-07-28-paid-users':'confirmed','reset-2026-07-26-outage':'confirmed','reset-2026-07-18-weekend':'confirmed','reset-2026-07-14-banked':'banked'};
export function calendarDay(value:string|Date,zone:string){
const p=new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(value));
return ['year','month','day'].map(k=>p.find(v=>v.type===k)!.value).join('-');
}
export function ResetCalendar({records,locale}:{records:Item[];locale:Locale}){
const t=copy[locale],config=localeConfig[locale],today=calendarDay(new Date(),config.timeZone);
const [month,setMonth]=useState(today.slice(0,7)),[selected,setSelected]=useState<string|null>(null);
const [current,setCurrent]=useState(()=>window.__CRW_BOOTSTRAP__?.current),[failed,setFailed]=useState(false);
useEffect(()=>{let live=true;fetch('/data/current.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(d=>{if(live)setCurrent(d);}).catch(()=>{if(live)setFailed(true);});return()=>{live=false;};},[]);
const events=useMemo(()=>{
const items=records.map(r=>({id:r.id,at:r.targetAt,kind:evidence[r.id]??'unverified' as Kind,title:r.id.includes('banked')?t.banked:r.id.includes('rollout')?t.rollout:t.reset,note:historyCopy[locale][r.id]?.note??r.note,href:'#'+r.id,url:r.announcement.url}));
if(current?.kind==='reset_confirmed'&&current.status==='confirmed'&&current.announcement&&!items.some(r=>r.url===current.announcement!.url)){
const at=current.announcement.postedAt;
items.push({id:'current',at,kind:current.confirmationBasis==='owner_observed'?'observed':'confirmed',title:t.astra,note:t.note.replace('{time}',new Intl.DateTimeFormat(config.intl,{timeZone:config.timeZone,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(at))),href:'/'+locale+'/',url:current.announcement.url});
}return items;
},[records,current,locale,config,t]);
const grouped=useMemo(()=>{const map=new Map<string,typeof events>();events.forEach(e=>{const d=calendarDay(e.at,config.timeZone);map.set(d,[...(map.get(d)??[]),e]);});return map;},[events,config]);
const active=selected??[...grouped.keys()].filter(d=>d.startsWith(month)).sort().at(-1)??month+'-01';
const [y,m]=month.split('-').map(Number),offset=(new Date(Date.UTC(y,m-1,1)).getUTCDay()+6)%7,count=new Date(Date.UTC(y,m,0)).getUTCDate();
const cells=Array.from({length:Math.ceil((offset+count)/7)*7},(_,i)=>new Date(Date.UTC(y,m-1,i-offset+1)));
const change=(n:number)=>{setMonth(new Date(Date.UTC(y,m-1+n,1)).toISOString().slice(0,7));setSelected(null);};
const fmt=(d:string,o:Intl.DateTimeFormatOptions)=>new Intl.DateTimeFormat(config.intl,{...o,timeZone:'UTC'}).format(new Date(d+'T12:00:00Z'));
return <section className="reset-calendar" aria-label={t.name}><div className="calendar-month">
<div className="calendar-toolbar"><button onClick={()=>change(-1)} aria-label={t.prev}>‹</button><h2>{fmt(month+'-01',{year:'numeric',month:'long'})}</h2><button onClick={()=>change(1)} aria-label={t.next}>›</button><button className="calendar-now" onClick={()=>{setMonth(today.slice(0,7));setSelected(null);}}>{t.now}</button></div>
<div className="calendar-weekdays">{t.week.map(d=><span key={d}>{d}</span>)}</div><div className="calendar-days">{cells.map(date=>{
const day=date.toISOString().slice(0,10),ev=grouped.get(day)??[],outside=!day.startsWith(month);
return <button key={day} disabled={outside} className={'calendar-day '+(outside?'outside ':'')+(day===active?'selected ':'')+(day===today?'today ':'')+(ev[0]?.kind??'')} aria-pressed={day===active} aria-current={day===today?'date':undefined} aria-label={fmt(day,{year:'numeric',month:'long',day:'numeric'})+': '+(ev.length?ev.map(e=>t[e.kind]+' · '+e.title).join('; '):t.empty)} onClick={()=>setSelected(day)}><span>{date.getUTCDate()}</span>{day===today&&<small>{t.today}</small>}{ev.length>1&&<sup>{ev.length}</sup>}</button>;
})}</div></div>
<div className="calendar-detail" aria-live="polite"><p className="calendar-zone">{t.zone}</p><h2>{fmt(active,{month:'long',day:'numeric',weekday:'short'})}</h2>{(grouped.get(active)??[]).map(e=><article key={e.id}><span className={'calendar-badge '+e.kind}>{t[e.kind]}</span><h3>{e.title}</h3><p>{e.note}</p><a href={e.href}>{e.id==='current'?t.latest:t.detail} <span aria-hidden="true">↗</span></a></article>)}{!grouped.has(active)&&<p className="calendar-empty">{t.empty}</p>}</div>
<div className="calendar-foot"><div className="calendar-legend">{(['confirmed','observed','unverified','banked','rollout'] as const).map(k=><span key={k}><i className={k}/>{t[k]}</span>)}</div><p>{t.caveat}</p>{failed&&<p role="status">{t.error}</p>}</div></section>;
}
