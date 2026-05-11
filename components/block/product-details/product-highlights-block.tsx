import * as React from 'react'
import clsx from 'clsx'

import type { ProductHighlightsBlockFragmentFragment } from '@/lib/optimizely/types/generated'

import { mediaRefToUrl } from './map-cms'

/** Sprite crop rects from KTB POC Figma (nodes 378:7493 / 378:7513). */
export type ProductHighlightIconLayer = {
  left: string
  top: string
  size: string
}

export type ProductHighlightIconPreset = 'featured' | 'interest' | 'krungthai'

const SPRITE_LAYERS: Record<
  ProductHighlightIconPreset,
  readonly ProductHighlightIconLayer[]
> = {
  featured: [
    { left: '-89.13%', top: '-88.13%', size: '276.63%' },
    { left: '-3.23%', top: '-87.51%', size: '275.39%' },
  ],
  interest: [{ left: '-89.13%', top: '-88.13%', size: '276.63%' }],
  krungthai: [
    { left: '-89.13%', top: '-88.13%', size: '276.63%' },
    { left: '-174.38%', top: '-88.6%', size: '276.63%' },
  ],
}

/** Full-width top card vs pair in the row below (Figma desktop row / mobile stack). */
export type ProductHighlightRow = 'featured' | 'grid'

export type ProductHighlightTile = {
  id?: string
  row: ProductHighlightRow
  title: React.ReactNode
  description: React.ReactNode
  iconPreset: ProductHighlightIconPreset
}

export type ProductHighlightsBlockProps = {
  title?: string
  tiles: ProductHighlightTile[]
  className?: string
  sectionId?: string
  /** PNG exported from Figma product-highlights icon sprite. */
  spriteSrc?: string
}

const DEFAULT_SPRITE_SRC = '/assets/icons/product-highlights-icon-sprite.png'

function HighlightsIcon({
  preset,
  spriteSrc,
}: {
  preset: ProductHighlightIconPreset
  spriteSrc: string
}) {
  const layers = SPRITE_LAYERS[preset]
  return (
    <div className="product-highlights__icon" aria-hidden>
      {layers.map((layer, index) => (
        <div key={index} className="product-highlights__icon-mask">
          {/* Sprite positioning matches Figma `%` crops; plain img avoids Next/Image sizing quirks. */}
          <img
            src={spriteSrc}
            alt=""
            className="product-highlights__icon-sprite"
            style={{
              left: layer.left,
              top: layer.top,
              width: layer.size,
              height: layer.size,
            }}
          />
        </div>
      ))}
    </div>
  )
}

function HighlightTileArticle({
  tile,
  spriteSrc,
}: {
  tile: ProductHighlightTile
  spriteSrc: string
}) {
  return (
    <article
      className={clsx(
        'product-highlights__tile',
        tile.row === 'featured' && 'product-highlights__tile--featured'
      )}
    >
      <HighlightsIcon preset={tile.iconPreset} spriteSrc={spriteSrc} />
      <div className="product-highlights__text">
        <p className="product-highlights__tile-title type-heading-h4">{tile.title}</p>
        <div className="product-highlights__tile-desc type-body-base-regular">
          {tile.description}
        </div>
      </div>
    </article>
  )
}

export function ProductHighlightsBlockFE({
  title = 'Product Highlights',
  tiles,
  className,
  sectionId,
  spriteSrc = DEFAULT_SPRITE_SRC,
}: ProductHighlightsBlockProps) {
  const titleId = React.useId()
  const featuredTiles = tiles.filter((t) => t.row === 'featured')
  const gridTiles = tiles.filter((t) => t.row === 'grid')

  return (
    <section
      id={sectionId}
      className={clsx('product-highlights', className)}
      aria-labelledby={titleId}
    >
      <h2 className="product-highlights__title type-heading-h3" id={titleId}>
        {title}
      </h2>

      <div className="product-highlights__list">
        {featuredTiles.map((tile, index) => (
          <HighlightTileArticle
            key={tile.id ?? `featured-${index}`}
            tile={tile}
            spriteSrc={spriteSrc}
          />
        ))}

        {gridTiles.length > 0 ? (
          <div className="product-highlights__grid">
            {gridTiles.map((tile, index) => (
              <HighlightTileArticle
                key={tile.id ?? `grid-${index}`}
                tile={tile}
                spriteSrc={spriteSrc}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

function normalizeIconPreset(
  raw: string | null | undefined
): ProductHighlightIconPreset {
  const v = raw?.toLowerCase().trim()
  if (v === 'interest' || v === 'krungthai' || v === 'featured') return v
  return 'featured'
}

function normalizeRow(raw: string | null | undefined): ProductHighlightRow {
  const v = raw?.toLowerCase().trim()
  return v === 'grid' ? 'grid' : 'featured'
}

type CmsProductHighlightsProps = Omit<
  ProductHighlightsBlockFragmentFragment,
  '__typename'
>

export default function ProductHighlightsBlock(props: CmsProductHighlightsProps) {
  const tiles: ProductHighlightTile[] = []
  props.Tiles?.forEach((t, index) => {
    if (!t || t.__typename !== 'ProductHighlightTileBlock') return
    const titleText = t.Title?.trim() ?? ''
    const desc = t.Description?.trim() ?? ''
    if (!titleText && !desc) return
    tiles.push({
      id: t.Id ?? `tile-${index}`,
      row: normalizeRow(t.Row),
      iconPreset: normalizeIconPreset(t.IconPreset),
      title: titleText || '\u00a0',
      description: desc || '\u00a0',
    })
  })

  const spriteSrc =
    mediaRefToUrl(props.SpriteSrc as Parameters<typeof mediaRefToUrl>[0]) ??
    DEFAULT_SPRITE_SRC

  return (
    <ProductHighlightsBlockFE
      title={props.Title ?? undefined}
      tiles={tiles}
      spriteSrc={spriteSrc}
    />
  )
}
