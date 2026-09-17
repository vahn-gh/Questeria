export interface Need {
  id: string
  label: string
  percentage: number
}

export enum NeedType {
  // Full width | horizontal
  FullWidth = 'FullWidth',
  // Big height | vertical
  Big = 'Big',
  // Small flex item | horizontal
  ListItem = 'ListItem',
}
