<script lang="ts" setup>
import Bookmark from './Bookmark.vue'
</script>
<template>
  <div class="app-main">
    <main-left title="网址">
      <Bookmark ref="bookmarkRef" />
    </main-left>
    <main-right>
      <iframe name="linkRef" frameborder="0" style="width: 100%; height: 100%"></iframe>
    </main-right>
  </div>
</template>
<style lang="scss" scoped></style>
