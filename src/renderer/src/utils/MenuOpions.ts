import i18n from '@/i18n/index'
const t = i18n.global.t
export declare interface IMenu {
  readonly id: string
  name: string
  icon?: string
  command?: Function
  bindData?: any
  exeCommand(param: any): void
}
export class MoreMenu implements IMenu {
  id: string
  name: string
  icon?: string
  command?: Function
  bindData?: any
  constructor(...args: any)
  constructor(id: string, name: string, icon: string, command: Function) {
    this.id = id
    this.name = name
    this.icon = icon
    this.command = command
  }
  exeCommand(param: any): void {
    this.command && this.command(param)
  }
}
/**
 *
 * @param command
 */
export function deleteMenu(command?: Function): IMenu {
  return new MoreMenu('delete', t('delete'), 'Delete', command)
}
/**
 *
 * @param command
 */
export function editMenu(command?: Function): IMenu {
  return new MoreMenu('edit', t('edit'), 'Edit', command)
}

/**
 *
 * @param command
 */
export function refreshMenu(command?: Function): IMenu {
  return new MoreMenu('refresh', t('refresh'), 'Refresh', command)
}
