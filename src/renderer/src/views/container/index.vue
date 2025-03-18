<script lang="ts" setup>
import ContainerConfigPanel from './ContainerConfigPanel.vue'
const showCloneRepository = ref(false)
const toAddRepository = () => {
  showCloneRepository.value = true
}
</script>
<template>
  <box-layout layout="row" size="20%" :show-divider="true">
    <template #first>
      <div class="bm-btn">
        <el-button type="primary" @click="toAddRepository()">
          <svg-icon
            icon-name="stars"
            style="width: 2em; height: 2em; margin-right: 0.1em"
          />
          {{ $t('code.addConnection') }}
        </el-button>
      </div></template
    >
    <div class="box">
      <ContainerConfigPanel />
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
  width: 20%;
  position: absolute;
  text-align: center;
  bottom: 10px;
  pointer-events: none;
  .el-button {
    pointer-events: all;
  }
}
</style>
