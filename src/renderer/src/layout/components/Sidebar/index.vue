<script setup lang="ts">
import { useRoute } from 'vue-router'
import { constantRoutes } from '@/router'
import SidebarItem from './SidebarItem.vue'
import Logo from './Logo.vue'
const currRoute = useRoute()
// import variables from '@/styles/variables.module.scss'
</script>
<template>
  <div class="sidebar">
    <Logo />
    <!-- :background-color="variables.menuBg" -->
    <el-menu :default-active="currRoute.fullPath" mode="vertical" collapse>
      <sidebar-item
        v-for="route in constantRoutes"
        :key="route.path"
        :item="route"
        :base-path="route.path"
        is-collapse
      />
    </el-menu>
  </div>
</template>
<style lang="scss" scoped></style>
