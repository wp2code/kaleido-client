<script lang="ts" setup>
interface IProps {
  className?: string
  minSize?: string
  layout?: 'row' | 'column'
}
const props = withDefaults(defineProps<IProps>(), {
  layout: 'row',
  minSize: '200px',
})
const isRow = computed(() => {
  return props.layout === 'row'
})
</script>

<template>
  <div :class="['box', !isRow ? 'box-column' : null, className]">
    <div class="firstBox" :style="[{ width: minSize }]">
      <slot name="first"></slot>
    </div>
    <div class="divider"></div>
    <div class="otherBox">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box {
  // width: 100%;
  height: 100%;
  display: flex;
  .divider {
    height: 100%;
    width: 1px;
    position: relative;
    background-color: rgba(var(--el-color-primary-rgb), 0.5);
  }
}
.box-column {
  width: 100%;
  flex-direction: column;
  .divider {
    height: 1px;
    width: 100%;
    position: relative;
    background-color: rgba(var(--el-color-primary-rgb), 0.5);
  }
}
.firstBox {
  background-color: $subMenuBg;
}
.otherBox {
  flex: 1;
  position: relative;
  background-color: $subMenuBg;
}
</style>
