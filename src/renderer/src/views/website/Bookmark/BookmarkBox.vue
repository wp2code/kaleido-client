<script lang="ts" setup>
import { FormInstance, FormRules } from 'element-plus'
import { Bookmark } from '~/repositories/entity/Bookmark'
import { isValidHttpUrl } from '@/utils'
interface CatalogInfo {
  id: number | string
  label: string
}
const props = defineProps({
  tip: {
    type: String,
    default: '新增',
  },
  modelValue: Boolean,
  data: {
    type: Bookmark,
    default: () => {
      return { type: 0 }
    },
  },
})

const formRef = ref<FormInstance>()

const catalogOptions = ref<CatalogInfo[]>([])
const form = reactive(initForm(props.data))
function initForm(data: any) {
  if (data.parentId == 0) {
    data.parentId = null
  }
  return { ...data }
}
const validateUrl = (_rule: any, value: any, callback: any) => {
  if (!value || value === '') {
    callback(new Error('请输入网址'))
  } else {
    if (!isValidHttpUrl(value)) {
      callback(new Error('请输入正确的网址'))
    }
    callback()
  }
}
//表单校验规则
const rules = reactive<FormRules>({
  label: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
  url: [{ required: true, validator: validateUrl, trigger: 'blur' }],
})
const emits = defineEmits(['cancel', 'save', 'update:modelValue'])
const cancel = (formRef: FormInstance | undefined) => {
  dialogVisible.value = false
  if (formRef) {
    formRef.resetFields()
  }
  // emits('cancel')
}
const close = (done) => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  done()
}
const save = async (formRef: FormInstance | undefined) => {
  if (!formRef) return
  await formRef.validate((valid, _fields) => {
    if (valid) {
      delete form.subList
      emits('save', form)
    }
  })
}

const dialogVisible = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  },
})
const isLockCatalog = computed(() => {
  return !props.data.id && props.data.parentId > 0
})

const isLockType = computed(() => {
  return props.data.id > 0 || props.data.parentId > 0
})
onMounted(async () => {
  const catalogList = await window.db.Bookmark.getCatalogList()
  if (catalogList) {
    catalogOptions.value = [...catalogList]
  }
})
</script>
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="tip"
    width="45%"
    draggable
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    :before-close="close"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-position="right">
      <el-form-item prop="type">
        <el-radio-group v-model="form.type">
          <el-radio :label="0" :disabled="form.type === 1 && isLockType">网址</el-radio>
          <el-radio :label="1" :disabled="form.type === 0 && isLockType">目录</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="标签" prop="label">
        <el-input v-model="form.label" placeholder="输入标签名称" />
      </el-form-item>
      <template v-if="form.type === 0">
        <el-form-item label="地址" prop="url">
          <el-input v-model="form.url" placeholder="http或https网址" />
        </el-form-item>
        <el-form-item label="目录" prop="parentId" class="no-required-lable">
          <el-select
            v-model="form.parentId"
            :disabled="isLockCatalog"
            clearable
            filterable
            placeholder="选择所属目录"
          >
            <el-option
              v-for="item in catalogOptions"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel(formRef)">取消</el-button>
        <el-button type="primary" @click="save(formRef)"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
:deep(.no-required-lable > .el-form-item__label:before) {
  content: ' ';
  margin-right: 10px;
}
</style>
