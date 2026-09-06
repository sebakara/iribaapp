import { cn } from '@/lib/utils';

export function BrandMark({
  size = 'md',
  light = false,
  stacked = false,
}: {
  size?: 'sm' | 'md' | 'lg';
  light?: boolean;
  stacked?: boolean;
}) {
  const box =
    size === 'lg' ? 'w-11 h-11 text-lg' : size === 'sm' ? 'w-8 h-8 text-sm' : 'w-9 h-9 text-base';

  return (
    <div className={cn('flex items-center gap-2.5', stacked && 'flex-col items-start gap-3')}>
      <div
        className={cn(
          box,
          'rounded-2xl bg-primary-600 text-white font-serif font-semibold flex items-center justify-center shadow-sm',
        )}
      >
        I
      </div>
      <div>
        <p className={cn(
          'font-serif font-semibold leading-tight tracking-tight',
          size === 'lg' ? 'text-2xl' : 'text-[15px]',
          light ? 'text-white' : 'text-ink',
        )}>
          Iriba
        </p>
        <p className={cn('text-[11px] leading-tight', light ? 'text-white/55' : 'text-ink/45')}>
          Workspace
        </p>
      </div>
    </div>
  );
}
