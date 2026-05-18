import { ExperienceElement } from '@/lib/optimizely/types/experience'
import Block from './block'

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
      {blocks?.map(({ __typename, ...props }, index) => (
        <Block
          key={`${__typename satisfies string}--${index}`}
          typeName={__typename}
          props={{
            ...props,
            isFirst: index === 0,
            preview,
          }}
        />
      ))}
    </>
  )
}

export default ContentAreaMapper
