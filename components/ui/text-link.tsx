import * as React from 'react'
import Image from 'next/image'
import clsx from 'clsx'

type TextLinkSize = 'S' | 'L'
type TextLinkState = 'default' | 'active' | 'hover' | 'pressed' | 'disabled'
type TextLinkIconPosition = 'left' | 'right'

export interface TextLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean
  size?: TextLinkSize
  state?: TextLinkState
  inverse?: boolean
  icon?: React.ReactNode | string
  iconAlt?: string
  iconPosition?: TextLinkIconPosition
  iconClassName?: string
}

export const TextLink = React.forwardRef<HTMLAnchorElement, TextLinkProps>(
  (
    {
      asChild = false,
      className,
      children,
      size = 'S',
      state = 'default',
      inverse = false,
      icon,
      iconAlt = 'text link icon',
      iconPosition = 'right',
      iconClassName,
      ...props
    },
    ref
  ) => {
    const resolvedState = state === 'default' ? 'active' : state

    const classes = clsx(
      'text-link',
      `text-link--${size.toLowerCase()}`,
      `text-link--${resolvedState}`,
      inverse && 'text-link--inverse',
      icon && 'text-link--with-icon',
      iconPosition === 'left' && 'text-link--icon-left',
      iconPosition === 'right' && 'text-link--icon-right',
      className
    )

    const iconSize = size === 'L' ? 24 : 16
    const iconNode =
      typeof icon === 'string' ? (
        <span className={clsx('text-link__icon', iconClassName)}>
          <Image src={icon} alt={iconAlt} width={iconSize} height={iconSize} />
        </span>
      ) : icon ? (
        <span className={clsx('text-link__icon', iconClassName)}>{icon}</span>
      ) : null

    const content = (
      <>
        {iconPosition === 'left' && iconNode}
        <span className="text-link__label">{children}</span>
        {iconPosition === 'right' && iconNode}
      </>
    )

    if (asChild) {
      const onlyChild = React.Children.only(children) as React.ReactElement<{
        className?: string
        children?: React.ReactNode
      }>

      return React.cloneElement(onlyChild, {
        className: clsx(classes, onlyChild.props.className),
        children: (
          <>
            {iconPosition === 'left' && iconNode}
            {onlyChild.props.children}
            {iconPosition === 'right' && iconNode}
          </>
        ),
      })
    }

    return (
      <a
        ref={ref}
        className={classes}
        aria-disabled={resolvedState === 'disabled' ? true : undefined}
        {...props}
      >
        {content}
      </a>
    )
  }
)

TextLink.displayName = 'TextLink'

