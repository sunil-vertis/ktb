import { Fragment } from 'react'

import { ExperienceElement } from '@/lib/optimizely/types/experience'
import Block from './block'

type BlockLike = {
  __typename?: string | null
  _id?: string | null
  _metadata?: { key?: string | null } | null
}

function opeBlockRootId(block: BlockLike | null | undefined): string | undefined {
  if (!block) return undefined
  const id = block._id?.trim()
  if (id) return id
  const key = block._metadata?.key?.trim()
  if (key) return key
  return undefined
}

function ContentAreaMapper({
  blocks,
  preview = false,
  isVisualBuilder = false,
  experienceElements,
  locationOptions = [],
  }: {
    blocks?: any[] | null
    preview?: boolean
    isVisualBuilder?: boolean
    experienceElements?: ExperienceElement[] | null
    locationOptions?: {
      label: string
      value: string
      parentValue?: string
    }[]
  }) {
  if (isVisualBuilder) {
    if (!experienceElements || experienceElements.length === 0) return null

    return (
      <>
        {experienceElements?.map(
          ({ displaySettings, component, key, type, displayName }, index) => {
            const typeName = type || component?.__typename

            if (!typeName) return null

            return (
              <div data-epi-block-id={key} key={`${typeName}--${index}`}>
                <Block
                  typeName={typeName}
                  props={{
                    ...component,
                    displaySettings,
                    displayName,
                    isFirst: index === 0,
                    preview,
                    key,
                    type,
                    locationOptions,
                  }}
                />
              </div>
            )
          }
        )}
      </>
    )
  }
  if (!blocks || blocks.length === 0) return null

  return (
    <>
      {blocks?.map((block, index) => {
        const { __typename, ...props } = block
        if (!__typename) return null

        const rootId = preview ? opeBlockRootId(block as BlockLike) : undefined
        const inner = (
          <Block
            typeName={__typename}
            props={{
              ...props,
              isFirst: index === 0,
              preview,
            }}
          />
        )

        if (rootId) {
          return (
            <div
              key={`${__typename}--${index}`}
              data-epi-block-id={rootId}
            >
              {inner}
            </div>
          )
        }

        return (
          <Fragment key={`${__typename}--${index}`}>{inner}</Fragment>
        )
      })}
    </>
  )
}

export default ContentAreaMapper
