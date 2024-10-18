<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { html } from '@codemirror/lang-html'
import MessageBox from '@/utils/MessageBox'
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
const showCopy = ref(false)
const props = withDefaults(defineProps<Props>(), {
  placeholder: '加载代码...',
  codeStyle: () => {
    return {
      height: '100%',
      width: '100%',
      fontSize: '12px',
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
const handleCopy = async () => {
  if (codeValue.value && codeValue.value != '') {
    await window.winApi.copy(codeValue.value)
    MessageBox.ok('复制成功')
  }
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
function onmouseover() {
  if (!showCopy.value) {
    showCopy.value = true
  }
}
function onmouseout() {
  if (showCopy.value) {
    showCopy.value = false
  }
}
watchEffect(() => {
  codeValue.value = props.code
})
</script>
<template>
  <div class="codemirow-box" @mouseover.stop="onmouseover" @mouseout.stop="onmouseout">
    <el-button
      v-show="showCopy"
      class="btn-copy"
      @mouseover.prevent
      @mouseout.prevent
      @click="handleCopy()"
      >复制</el-button
    >
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
  </div>
</template>
<style lang="scss" scoped>
:deep() {
  .v-codemirror {
    .cm-editor .cm-scroller {
      min-height: 500px;
      max-height: 70vh;
    }
  }
}
.codemirow-box {
  max-width: 90vw;
  max-height: 70vh;
  position: relative;
  .btn-copy {
    position: absolute;
    right: 1px;
    top: 1px;
    z-index: 100;
    color: #ddd;
    background-color: transparent;
  }
  .btn-copy:hover {
    background-color: #ddd;
    color: #303133;
    border-color: #303133;
  }
}
</style>
