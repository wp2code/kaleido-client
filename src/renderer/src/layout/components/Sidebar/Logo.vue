<script lang="ts" setup>
import { useSettingsStore } from '@/store/modules/settings'
import defaultLogo from '@/assets/logo/logo.png'
import { isValidHttpUrl } from '@/utils'
const settingsStore = useSettingsStore()

const props = defineProps({
  logo: {
    type: String,
    default: defaultLogo,
  },
  collapse: {
    type: Boolean,
    required: false,
  },
})
const logoImage = computed(() => {
  return isValidHttpUrl(props.logo)
    ? props.logo
    : new URL(props.logo, import.meta.url).href
})
</script>
<template>
  <div class="w-full h-[50px]">
    <transition name="sidebarLogoFade">
      <router-link
        key="expand"
        class="h-full w-full flex items-center justify-center"
        to="/"
      >
        <img v-if="settingsStore.sidebarLogo" :src="logoImage" class="w-5 h-5" />
      </router-link>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
// https://cn.vuejs.org/guide/built-ins/transition.html#the-transition-component
.sidebarLogoFade-enter-active {
  transition: opacity 2s;
}

.sidebarLogoFade-leave-active,
.sidebarLogoFade-enter-from,
.sidebarLogoFade-leave-to {
  opacity: 0;
}
</style>
