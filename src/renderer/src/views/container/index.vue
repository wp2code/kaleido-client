<script lang="ts" setup>
import ContainerConfigPanel from './ContainerConfigPanel.vue'
const componentName = ref()
const componentKey = ref()
const toAddRepository = () => {
  componentName.value = ContainerConfigPanel
}
</script>
<template>
  <box-layout layout="row" size="30%" :show-divider="true">
    <template #first>
      <div class="bm-btn">
        <el-button type="primary" @click="toAddRepository()">
          <svg-icon
            icon-name="stars"
            style="width: 2em; height: 2em; margin-right: 0.1em"
          />
          {{ $t('code.addProject') }}
        </el-button>
      </div></template
    >
    <div class="box">
      <keep-alive>
        <component :is="componentName" :key="componentKey"></component>
      </keep-alive>
    </div>
  </box-layout>
</template>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  flex: 1 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.bm-btn {
  width: 30%;
  position: absolute;
  text-align: center;
  bottom: 10px;
  pointer-events: none;
  .el-button {
    pointer-events: all;
  }
}
</style>
