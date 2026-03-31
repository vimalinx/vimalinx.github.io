import { Info, AlertTriangle, AlertCircle, Lightbulb } from 'lucide-react';

type CalloutType = 'note' | 'warning' | 'tip' | 'danger' | 'info';

interface CalloutProps {
  type: CalloutType;
  title?: string;
  children: React.ReactNode;
}

const styles: Record<CalloutType, { border: string; bg: string; icon: string; title: string }> = {
  note: {
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/5',
    icon: 'text-blue-400',
    title: 'Note',
  },
  warning: {
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/5',
    icon: 'text-amber-400',
    title: 'Warning',
  },
  tip: {
    border: 'border-green-500/30',
    bg: 'bg-green-500/5',
    icon: 'text-green-400',
    title: 'Tip',
  },
  danger: {
    border: 'border-red-500/30',
    bg: 'bg-red-500/5',
    icon: 'text-red-400',
    title: 'Danger',
  },
  info: {
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/5',
    icon: 'text-purple-400',
    title: 'Info',
  },
};

const icons: Record<CalloutType, React.ElementType> = {
  note: Info,
  warning: AlertTriangle,
  tip: Lightbulb,
  danger: AlertCircle,
  info: Info,
};

export function Callout({ type, title, children }: CalloutProps) {
  const s = styles[type] ?? styles.note;
  const Icon = icons[type] ?? Info;

  return (
    <div className={`my-6 rounded-r-lg border-l-4 ${s.border} ${s.bg} p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-4 w-4 ${s.icon}`} />
        <span className={`text-sm font-semibold ${s.icon}`}>{title || s.title}</span>
      </div>
      <div className="text-sm text-gray-300 [&>p]:mb-0 [&>p:last-child]:mb-0">{children}</div>
    </div>
  );
}
