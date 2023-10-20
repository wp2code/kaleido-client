<template>
  <el-dialog v-model="visible" :title="title" :before-close="resetForm">
    <el-form ref="bookmarkFormRef" :rules="rules" :model="dataValue">
      <el-form-item prop="label">
        <el-input v-model="parentDataValue.label" />
        <el-input
          v-model="dataValue.label"
          autocomplete="off"
          :placeholder="dataValue.isDir ? '输入网址' : '填写目录名称'"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose(bookmarkFormRef)">取消</el-button>
        <!-- <el-button @click="$emit('close')">取消</el-button> -->
        <el-button type="primary" @click="onSubmit(bookmarkFormRef)"> 保存 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { FormInstance, FormRules } from 'element-plus'
import { Bookmark } from '~/repositories/entity/Bookmark'
// const { proxy } = getCurrentInstance()
interface Props {
  visible: boolean
  title?: string
  isAddSub?: boolean
  data?: Bookmark
}
const props = withDefaults(defineProps<Props>(), {
  visible: true,
  data: () => {
    return {} as Bookmark
  },
})
const { visible, title, isAddSub } = toRefs(props)
const parentDataValue = ref<Bookmark>({} as Bookmark)
const dataValue = ref<Bookmark>({} as Bookmark)
const rules = reactive<FormRules>({
  label: { required: true, message: '请填写', trigger: 'blur' },
})
const bookmarkFormRef = ref<FormInstance>()
// const formEl = proxy.$refs['bookmarkForm'] as FormInstance
const emites = defineEmits(['close', 'submit', 'update:visible'])

const onClose = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  parentDataValue.value = {}
  emites('close')
}
const onSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid, fields) => {
    if (valid) {
      emites('submit', dataValue.value)
    } else {
      console.log('error submit!', fields)
    }
  })
}
const resetForm = (done: () => void) => {
  const formEl = bookmarkFormRef.value
  if (!formEl) return
  formEl.resetFields()
  parentDataValue.value = {}
  done()
}
watch(
  () => props.data,
  (data: Bookmark) => {
    if (isAddSub.value) {
      console.log('isAddSub is true', isAddSub.value)
      parentDataValue.value = props.data
      dataValue.value = {}
    } else {
      console.log('isAddSub is false', isAddSub.value)
      const parent = props.data.parent
      parentDataValue.value = parent ? parent : {}
      dataValue.value = { ...data }
    }
    // dataValue.value = Object.assign({}, data)
    // dataValue.value = JSON.parse(JSON.stringify(data))
  },
  { immediate: true }
)
// computed(() => {
//   if (isAddSub) {
//     console.log('isAddSub is true', isAddSub.value)
//     parentDataValue.value = props.data
//   } else {
//     console.log('isAddSub is false', isAddSub.value)
//     parentDataValue.value = props.data.parent
//   }
// })
computed({
  get() {
    return visible
  },
  set(value) {
    emites('update:visible', value)
  },
})
</script>
<style lang="scss" scoped></style>
