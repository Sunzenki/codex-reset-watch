import type { IconProps } from '@phosphor-icons/react';
import './icons.css';

// One icon family and default treatment for the public site and admin console.
export {
  IconContext, Archive, ArrowClockwise, ArrowLeft, ArrowRight, ArrowUp,
  ArrowUpRight, Bell, BellSlash, Browser, CalendarBlank, CaretDown,
  CaretLeft, CaretRight, CheckCircle, Clock, ClockCounterClockwise, Globe, Info, Link, Timer, LinkBreak,
  BookOpen, PushPin, UserCircle, List, Newspaper, PaperPlaneTilt, Pause, Play, Quotes, SignIn, SignOut, Translate, WarningCircle, X,
} from '@phosphor-icons/react';

export const iconDefaults = {
  size: 18,
  weight: 'regular',
  className: 'crw-icon',
  'aria-hidden': true,
  focusable: false,
} satisfies IconProps;
