import { defineStore } from 'pinia'
import defaultSettings from '~/settings'

export const useSettingsStore = defineStore('setting', () => {
  const sidebarLogo = ref<boolean>(defaultSettings.sidevarLogo)

  // actions
  function changeSetting(param: { key: string; value: any }) {
    const { key, value } = param
    switch (key) {
      case 'sidevarLogo':
        sidebarLogo.value = value
        break
      default:
        break
    }
  }

  return {
    sidebarLogo,
    changeSetting,
  }
})
