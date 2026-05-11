export type SelectionOption = {
  label: string
  value: string
  key?: string
  parentValue?: string
  parentKey?: string
}

export const mapLocationsToOptions = (items: any[]) => {
  const nameByKey = new Map(
    items.map((item) => [item._metadata?.key, item.Name])
  )

  return items.map((item) => {
    const parentKey = item.ParentLocation?.key
    const parentName = parentKey ? nameByKey.get(parentKey) : undefined

    return {
      key: item._metadata?.key || item.key || item.Key,
      label: item.Name,
      value: item.Name,
      parentValue: parentName,
      parentKey,
    }
  })
}

export const filterOptionsByParent = (
  options: SelectionOption[],
  parentValue?: string
) => {
  if (!parentValue) return []
  return options.filter((o) => o.parentValue === parentValue)
}