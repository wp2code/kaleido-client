<script lang="ts" setup>
import { isExternal } from '@/utils/index'
import { useRouter } from 'vue-router'
const props = defineProps({
  to: {
    type: String,
    required: true,
  },
})

const router = useRouter()
function push() {
  router.push(props.to).catch((err) => {
    console.error(err)
  })
}
function openExternal(url) {
  window.winApi.openExternal(url)
}
</script>

<template>
  <span v-if="isExternal(to)" @click="openExternal(to)">
    <slot />
  </span>
  <div v-else @click="push">
    <slot />
  </div>
</template>
