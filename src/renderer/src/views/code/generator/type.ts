export class MoreMenu {
  id: string
  name: string
  icon?: string
  command?: (item?: any) => void
  static mack(
    id: string,
    name: string,
    icon?: string,
    command?: (item?: any) => void
  ) {
    const mm = new MoreMenu()
    mm.id = id
    mm.name = name
    mm.icon = icon
    mm.command = command
    return mm
  }
}
/**
 *
 * @returns
 */
const initFilterMoreMenu = (
  mms: MoreMenu[],
  predicate?: (mm: MoreMenu) => boolean
): MoreMenu[] => {
  if (typeof predicate === 'function') {
    return mms.filter((item) => predicate(item))
  }
  return mms
}

export { initFilterMoreMenu }
