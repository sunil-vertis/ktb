import * as React from 'react'
import Image from 'next/image'

import { cn } from '@/lib/utils'

type ButtonVariant =
  | 'default'
  | 'secondary'
  | 'primary-inverse'
  | 'secondary-inverse'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'destructive'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'
type ButtonHierarchy = 'primary' | 'secondary'
type ButtonIconPosition = 'left' | 'right'
type ButtonState = 'default' | 'hover' | 'pressed' | 'disabled'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: ButtonVariant
  size?: ButtonSize
  hierarchy?: ButtonHierarchy
  inverse?: boolean
  icon?: React.ReactNode | string
  iconAlt?: string
  iconPosition?: ButtonIconPosition
  iconClassName?: string
  state?: ButtonState
}

export interface IconButtonProps
  extends Omit<ButtonProps, 'children' | 'icon' | 'iconPosition'> {
  icon: React.ReactNode | string
  iconAlt?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      hierarchy,
      inverse = false,
      icon,
      iconAlt = 'button icon',
      iconPosition = 'right',
      iconClassName,
      state = 'default',
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const variantImpliesInverse =
      variant === 'primary-inverse' || variant === 'secondary-inverse'
    const resolvedInverse = inverse || variantImpliesInverse
    const resolvedHierarchy: ButtonHierarchy =
      hierarchy ??
      (variant === 'secondary' ||
      variant === 'outline' ||
      variant === 'secondary-inverse'
        ? 'secondary'
        : 'primary')
    const resolvedSize = size === 'default' ? 'lg' : size
    const hasLabel = Boolean(children)
    const iconOnly = Boolean(icon) && !hasLabel
    const currentSize = iconOnly ? (resolvedSize === 'icon' ? 'sm' : resolvedSize) : resolvedSize
    const resolvedIconPosition: ButtonIconPosition = iconOnly ? 'left' : iconPosition

    const iconNode =
      typeof icon === 'string' ? (
        <span className={cn('btn__icon-media', iconClassName)}>
          <Image
            src={icon}
            alt={iconAlt}
            width={currentSize === 'lg' ? 20 : 16}
            height={currentSize === 'lg' ? 20 : 16}
          />
        </span>
      ) : (
        <span className={cn('btn__icon-media', iconClassName)}>{icon}</span>
      )

    const classes = cn(
      'btn',
      `btn--${resolvedHierarchy}`,
      `btn--${currentSize}`,
      resolvedInverse && 'btn--inverse',
      variant === 'ghost' && 'btn--ghost',
      variant === 'link' && 'btn--link',
      variant === 'destructive' && 'btn--destructive',
      icon && !iconOnly && 'btn--with-icon',
      iconOnly && 'btn--icon-only',
      resolvedIconPosition === 'left' && 'btn--icon-left',
      resolvedIconPosition === 'right' && 'btn--icon-right',
      state !== 'default' && `btn--state-${state}`,
      className
    )

    if (asChild) {
      const onlyChild = React.Children.only(children) as React.ReactElement<{
        className?: string
        children?: React.ReactNode
      }>

      return React.cloneElement(onlyChild, {
        className: cn(classes, onlyChild.props.className),
        children: (
          <>
            {icon && resolvedIconPosition === 'left' && iconNode}
            {onlyChild.props.children}
            {icon && resolvedIconPosition === 'right' && iconNode}
          </>
        ),
      })
    }

    return (
      <button
        className={classes}
        ref={ref}
        disabled={props.disabled || state === 'disabled'}
        {...props}
      >
        {icon && resolvedIconPosition === 'left' && iconNode}
        {hasLabel && <span className="btn__label">{children}</span>}
        {icon && resolvedIconPosition === 'right' && iconNode}
      </button>
    )
  }
)
Button.displayName = 'Button'

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, iconAlt = 'icon button', ...props }, ref) => {
    return <Button ref={ref} icon={icon} iconAlt={iconAlt} {...props} />
  }
)
IconButton.displayName = 'IconButton'

export { Button, IconButton }
