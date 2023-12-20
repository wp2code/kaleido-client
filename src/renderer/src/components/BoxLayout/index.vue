<script lang="ts" setup>
interface IProps {
  className?: string
  size?: string
  layout?: 'row' | 'column'
  firstBoxStyle?: any
  showDivider: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  layout: 'row',
  size: '30%',
  showDivider: true,
})
const isRow = computed(() => {
  return props.layout === 'row'
})
const style = ref(props.firstBoxStyle || {})
watchEffect(() => {
  if (props.layout === 'row') {
    style.value = Object.assign(style.value, { width: props.size })
  } else {
    style.value = Object.assign(style.value, { height: props.size })
  }
})
</script>

<template>
  <div :class="['box', !isRow ? 'box-column' : null, className]">
    <div class="firstBox" :style="style">
      <slot name="first"></slot>
    </div>
    <div v-if="props.showDivider" class="divider"></div>
    <div class="otherBox">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box {
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
  align-items: center;
  .divider {
    height: 1px;
    width: 100%;
    position: relative;
    background-color: rgba(var(--el-color-primary-rgb), 0.5);
  }
}
.firstBox {
  display: flex;
  background-color: $subMenuBg;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.otherBox {
  flex: 1;
  position: relative;
  background-color: $subMenuBg;
  width: 100%;
  height: 100%;
}
</style>
