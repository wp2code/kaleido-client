<script setup lang="ts">
import StartPage from './components/StartPage/index.vue'
const isStarted = ref(false)
onBeforeMount(async () => {
  const timer = setTimeout(() => {
    window.initApi.stopLoading('>>>timer out<<<')
  }, 2000)
  await window.initApi
    .startServerForSpawn()
    .then((_res) => {
      isStarted.value = true
      clearTimeout(timer)
      window.initApi.stopLoading(_res)
    })
    .catch((_error) => {
      isStarted.value = true
      clearTimeout(timer)
      window.initApi.stopLoading()
    })
}),
  onMounted(async () => {
    // 桌面端的服务器地址
    const desktopServiceUrl = import.meta.env.RD_VITE_API_HOST
    window._BaseURL = desktopServiceUrl
    window.winApi?.setBaseURL?.(window._BaseURL)
  })
</script>
<template>
  <section>
    <StartPage :started="isStarted" />
  </section>
</template>
<style lang="scss" scoped></style>
