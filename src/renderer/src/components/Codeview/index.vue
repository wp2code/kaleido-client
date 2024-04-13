<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { html } from '@codemirror/lang-html'
import { oneDark } from '@codemirror/theme-one-dark'
interface Props {
  codeStyle?: CSSProperties // 代码样式
  dark?: boolean // 是否暗黑主题
  code?: string // 代码字符串
  placeholder?: string // 占位文本
  autofocus?: boolean // 自动聚焦
  disabled?: boolean // 禁用输入行为和更改状态
  indentWithTab?: boolean // 启用tab按键
  tabSize?: number // tab按键缩进空格数
}
const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Code goes here...',
  codeStyle: () => {
    return {
      height: '100%',
      width: '100%',
      fontSize: '11px',
    }
  },
  dark: false,
  code: '',
  autofocus: false,
  disabled: true,
  indentWithTab: true,
  tabSize: 4,
})
const extensions = props.dark ? [html(), oneDark] : [html()]
const codeValue = ref(props.code)
const emits = defineEmits(['update:code', 'ready', 'change', 'focus', 'blur'])
function handleReady(payload: any) {
  console.log('ready')
  emits('ready', payload)
}
function onChange(value: string, viewUpdate: any) {
  emits('change', value, viewUpdate)
  emits('update:code', value)
}
function onFocus(viewUpdate: any) {
  emits('focus', viewUpdate)
}
function onBlur(viewUpdate: any) {
  emits('blur', viewUpdate)
}
watchEffect(() => {
  codeValue.value = props.code
})
</script>
<template>
  <el-scrollbar class="codemirow-box">
    <Codemirror
      ref="codemirror"
      v-model="codeValue"
      :placeholder="placeholder"
      :style="codeStyle"
      v-bind="$attrs"
      :extensions="extensions"
      :disabled="disabled"
      @ready="handleReady"
      @change="onChange"
      @focus="onFocus"
      @blur="onBlur"
    />
  </el-scrollbar>
</template>
<style lang="scss" scoped>
.codemirow-box {
  max-width: 90vw;
  max-height: 70vh;
  // color: #abb2bf;
  // background-color: #282c34;
}
// :deep(.cm-editor) {
//   // border-radius: 8px;
//   // height: 10vh;
//   outline: none;
//   border: 1px solid transparent;
//   .cm-scroller {
//     border-radius: 8px;
//   }
// }
// :deep(.cm-focused) {
//   border: 1px solid #6b778c;
// }
</style>
