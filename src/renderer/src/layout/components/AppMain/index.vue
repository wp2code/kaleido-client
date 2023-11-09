<script lang="ts" setup></script>
<template>
  <div class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="router-fade" mode="out-in">
        <!-- <keep-alive> -->
        <component :is="Component" :key="route.fullPath" />
        <!-- </keep-alive> -->
      </transition>
    </router-view>
  </div>
</template>
<style lang="scss" scoped>
.app-main {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  width: $appMainWidth !important;
  height: 100%;
  background-color: $subMenuBg;
}
</style>
