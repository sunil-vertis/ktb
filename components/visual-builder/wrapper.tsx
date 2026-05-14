import ContentAreaMapper from '../content-area/mapper'
import {
  getFormSettings,
  buildFormComponent,
} from '@/lib/forms/container'
import type {
  Column,
  Row,
  VisualBuilderNode,
  SafeVisualBuilderExperience,
} from '@/lib/optimizely/types/experience'

export default async function VisualBuilderExperienceWrapper({
  experience,
  locationOptions = [],
  locale,
}: {
  experience?: SafeVisualBuilderExperience
  locationOptions?: {
    label: string
    value: string
    parentValue?: string
    parentKey?: string
  }[]
  locale?: string
}) {
  if (!experience?.composition?.nodes) {
    return null
  }

  const { nodes } = experience.composition
  const formSettings = await getFormSettings(nodes, locale)
  
  return (
    <div className="vb:outline relative w-full flex-1 h-full">
      <div className="vb:outline relative w-full flex-1 h-full">
        {nodes.map((node: VisualBuilderNode) => {
          if (node.nodeType === 'section') {
            return (
              <div
                key={node.key}
                className="vb:grid relative flex w-full flex-col flex-wrap"
                data-epi-block-id={node.key}
              >
                {node.rows?.map((row: Row) => (
                  <div
                    key={row.key}
                    className="vb:row flex flex-1 flex-col flex-nowrap md:flex-row"
                  >
                    {row.columns?.map((column: Column) => (
                      <div
                        className="vb:col flex flex-1 flex-col flex-nowrap justify-start"
                        key={column.key}
                      >
                        <ContentAreaMapper
                          experienceElements={column.elements}
                          isVisualBuilder
                          locationOptions={locationOptions}
                        />
                      </div>
                    ))}
                  </div>
                ))}

                {node.type && (
                  <ContentAreaMapper
                    experienceElements={[
                      {
                        key: node.key,
                        type: node.type,
                        displayName: node.displayName,
                        displaySettings: node.displaySettings,
                        component: buildFormComponent(node, formSettings),
                      },
                    ]}
                    isVisualBuilder
                    locationOptions={locationOptions}
                  />
                )}
              </div>
            )
          }

          if (node.type) {
            return (
              <div
                key={node.key}
                className="vb:node relative w-full"
                data-epi-block-id={node.key}
              >
                <ContentAreaMapper
                  experienceElements={[
                    {
                      key: node.key,
                      type: node.type,
                      displayName: node.displayName,
                      displaySettings: node.displaySettings,
                      component: buildFormComponent(node, formSettings),
                    },
                  ]}
                  isVisualBuilder
                  locationOptions={locationOptions}
                />
              </div>
            )
          }

          if (node.nodeType === 'component' && node.component) {
            return (
              <div
                key={node.key}
                className="vb:node relative w-full"
                data-epi-block-id={node.key}
              >
                <ContentAreaMapper blocks={[node.component]} />
              </div>
            )
          }

          return null
        })}
      </div>
    </div>
  )
}
