import type {
  SeoExperience,
  BlankExperience,
} from '@/lib/optimizely/types/generated'

export interface Grid {
  key: string
  rows?: Row[]
}

export interface Row {
  key: string
  columns?: Column[]
}

export interface Column {
  key: string
  elements?: ExperienceElement[]
}

export interface ExperienceElement {
  key: string
  type?: string
  displayName?: string
  displaySettings?: any
  component?: any
}

export interface VisualBuilderNode {
  nodeType?: 'section' | 'component'
  key: string
  component?: any
  rows?: Row[]
  nodes?: VisualBuilderNode[]
  elements?: ExperienceElement[]
  type?: string
  displayName?: string
  displaySettings?: any
}

export type SafeVisualBuilderExperience = {
  composition?: {
    nodes?: VisualBuilderNode[]
  }
} & (SeoExperience | BlankExperience)   