<!--
<script lang="ts" setup>
import Bookmark from './Bookmark/index.vue'
const linkUrl = ref('')
const selectItem = (item) => {
  linkUrl.value = item.url
}
</script>
<template>
  <box-layout>
    <template #first>
      <Bookmark @select="selectItem" />
    </template>
    <iframe name="linkRef" frameborder="0" class="linkFrame" :src="linkUrl"></iframe>
  </box-layout>
</template>
<style lang="scss" scoped>
.linkFrame {
  width: 100%;
  height: 100%;
}
</style>
