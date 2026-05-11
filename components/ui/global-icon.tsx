import { cn } from '@/lib/utils'

export type GlobalIconType =
  | 'search'
  | 'trend'
  | 'chevron-down'
  | 'chevron-right'
  | 'user'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-up-right'
  | 'close'
  | 'download'
  | 'menu'
  | 'check'
  | 'filter'

export type GlobalIconSize = 'S' | 'L'

type GlobalIconProps = {
  type: GlobalIconType
  size?: GlobalIconSize
  className?: string
  iconClassName?: string
  strokeWidth?: number
  'aria-label'?: string
}

const ICON_SIZE_PX: Record<GlobalIconSize, number> = {
  S: 16,
  L: 24,
}

export function GlobalIcon({
  type,
  size = 'S',
  className,
  iconClassName,
  strokeWidth = 1.8,
  'aria-label': ariaLabel,
}: GlobalIconProps) {
  const iconSize = ICON_SIZE_PX[size]
  const isDecorative = !ariaLabel

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center',
        size === 'S' ? 'size-4' : 'size-6',
        className
      )}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('text-current', iconClassName)}
        aria-hidden={isDecorative}
        aria-label={ariaLabel}
      >
        {type === 'search' && (
          <>
            <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth={strokeWidth} />
            <path d="M16 16L20 20" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
          </>
        )}
        {type === 'trend' && (
          <path
            d="M4 16L10 10L13.5 13.5L20 7"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {type === 'chevron-down' && (
          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        )}
        {type === 'chevron-right' && (
          <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        )}
        {type === 'user' && (
          <>
            <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth={strokeWidth} />
            <path d="M5.5 19C6.7 15.8 9 14.5 12 14.5C15 14.5 17.3 15.8 18.5 19" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
          </>
        )}
        {type === 'arrow-left' && (
          <path d="M19 12H5M10 7L5 12L10 17" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        )}
        {type === 'arrow-right' && (
          <path d="M5 12H19M14 7L19 12L14 17" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        )}
        {type === 'arrow-up-right' && (
          <path d="M7 17L17 7M10 7H17V14" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        )}
        {type === 'close' && (
          <path d="M7 7L17 17M17 7L7 17" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
        )}
        {type === 'download' && (
          <>
            <path d="M12 5V14" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
            <path d="M8.5 10.5L12 14L15.5 10.5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 19H19" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
          </>
        )}
        {type === 'menu' && (
          <path d="M5 8H19M5 12H19M5 16H19" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
        )}
        {type === 'check' && (
          <path d="M5.5 12.5L10 17L18.5 8.5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        )}
        {type === 'filter' && (
          <path d="M5 7H19L14 12V17L10 19V12L5 7Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </span>
  )
}

