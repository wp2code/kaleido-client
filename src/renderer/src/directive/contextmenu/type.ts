export type MenuInfoType = IMenuInfo
export type IMenuItemType = IMenuItem
export type IMenuItemSvgType = IMenuItemSvg
interface IMenuInfo {
  className?: string
  items: Array<IMenuItem>
  data?: any
}
interface IMenuItem {
  icon?: string | IMenuItemSvg
  lable: string
  onclick?: (_e, data: any) => void
}

interface IMenuItemSvg {
  iconName: string
  size?: string
  color?: string
}
