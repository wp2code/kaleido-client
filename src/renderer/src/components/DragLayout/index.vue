<template>
  <div :class="['box', !isRow ? 'box-column' : null, className]">
    <div ref="VolatileRef" class="firstBox" :style="style">
      <slot name="first"></slot>
    </div>
    <div ref="DividerRef" class="divider" :style="[dividerLineStyle]">
      <div class="dividerCenter"></div>
    </div>
    <div class="otherBox">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  className?: string
  minSize?: number
  initSize: string | number
  layout?: 'row' | 'column'
  callback?: Function
  showLine?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  showLine: true,
  layout: 'row',
  initSize: '38%',
})
// const attrs = useAttrs()
const VolatileRef = ref<HTMLDivElement | null>(null)
const DividerRef = ref<HTMLDivElement | null>(null)
const isRow = computed(() => {
  return props.layout === 'row'
})
const dividerLineStyle = computed(() => {
  const style = {}
  style[isRow.value ? 'width' : 'height'] = props.showLine ? '1px' : '0px'
  style['display'] = props.showLine ? 'block' : 'none'
  return style
})
onMounted(() => {
  DividerRef.value.onmousedown = (event: any) => {
    event.preventDefault()
    event.stopPropagation()
    const clientStart = isRow.value ? event.clientX : event.clientY
    const volatileBoxXY = isRow.value
      ? VolatileRef.value.offsetWidth
      : VolatileRef.value.offsetHeight
    document.onmousemove = (e: any) => {
      changeClientXY(
        isRow.value ? e.clientX : e.clientY,
        clientStart,
        volatileBoxXY,
        VolatileRef,
        isRow.value,
        props.minSize,
        props.callback
      )
    }
    document.onmouseup = (_e) => {
      document.onmouseup = null
      document.onmousemove = null
    }
  }
})
const style = ref()
watchEffect(() => {
  if (props.layout === 'row') {
    style.value = { 'min-width': props.minSize + 'px', width: props.initSize }
  } else {
    style.value = { 'min-height': props.minSize + 'px', height: props.initSize }
  }
})
onUnmounted(() => {
  document.onmouseup = null
  document.onmousemove = null
})
const changeClientXY = (
  nowClientXY: any,
  clientStart: any,
  volatileBoxXY: any,
  volatileRef: Ref<HTMLDivElement | null>,
  isRow: boolean,
  minSize: number,
  callback: Function
) => {
  if (!volatileRef) {
    return
  }
  const computedXY = nowClientXY - clientStart
  const finalXY = volatileBoxXY + computedXY
  console.log('isRow', isRow)
  if (minSize && minSize > finalXY) {
    return
  }
  if (isRow) {
    volatileRef.value.style.width = finalXY + 'px'
  } else {
    volatileRef.value.style.height = finalXY + 'px'
  }
  callback && callback(finalXY)
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
