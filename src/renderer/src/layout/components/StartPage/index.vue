<template>
  <div v-if="!props.started">
    <loading />
  </div>
  <div v-else>
    <Sidebar class="sidebar-container" />
    <AppMain class="appMain-container" />
  </div>
</template>
<script lang="ts" setup>
import Sidebar from '../Sidebar/index.vue'
import AppMain from '../AppMain/index.vue'
import loading from './loading.vue'
interface IProps {
  started: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  started: false,
})
</script>

<style lang="scss" scoped></style>
