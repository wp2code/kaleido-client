<script lang="ts" setup>
import { FormInstance, FormRules } from 'element-plus'
import {
  updateDataSource,
  addDataSource,
  connectTestDataSource,
} from '@/api/datasource/index'
import { DataSource, getDefault, DbType } from '@/api/datasource/types'
import { isNumer } from '@/utils'
import { PropType } from 'vue'
import { RefreshConnectList, EditConnectData, CancelConnectOps } from '../keys'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const { proxy } = getCurrentInstance()

const props = defineProps({
  data: {
    type: Object as PropType<DataSource>,
    default: null,
  },
})
const formRef = ref<FormInstance>()
const params = toRef(inject<DataSource>(EditConnectData))
const form = ref<DataSource>(convert(props.data !== null ? props.data : params.value))
function convert(data: DataSource) {
  return data!.id ? { ...data } : getDefault(DbType[data?.type])
}
const validatePort = (_rule: any, value: any, callback: any) => {
  if (!value || value === '') {
    callback(new Error(t('connection-port-input')))
  } else {
    if (!isNumer(value)) {
      callback(new Error(t('connection-port-error')))
    }
    callback()
  }
}
//表单校验规则
const rules = reactive<FormRules>({
  name: [{ required: true, message: t('connection-name-input'), trigger: 'blur' }],
  url: [{ required: true, message: t('connection-host-input'), trigger: 'blur' }],
  port: [{ required: true, validator: validatePort, trigger: 'blur' }],
  userName: [
    { required: true, message: t('connection-username-input'), trigger: 'blur' },
  ],
  password: [
    { required: true, message: t('connection-password-input'), trigger: 'blur' },
  ],
})
const refreshDbConnectList = inject(RefreshConnectList, () => {})
//保存或更新连接
const save = async (formRef: FormInstance | undefined) => {
  if (!formRef) return
  await formRef.validate(async (valid, _fields) => {
    if (valid) {
      if (form.value.id) {
        await updateDataSource(form.value.id, form.value).then((res) => {
          if (res) {
            proxy.$msgBoxUtil.ok(t('update-success'))
            refreshDbConnectList()
          }
        })
      } else {
        await addDataSource(form.value).then((res) => {
          if (res) {
            proxy.$msgBoxUtil.ok(t('save-success'))
            refreshDbConnectList()
          }
        })
      }
    }
  })
}

// 测试连接
const testConnect = async (formRef: FormInstance | undefined) => {
  if (!formRef) return
  await formRef.validate(async (valid, _fields) => {
    if (valid) {
      await connectTestDataSource(form.value).then((res) => {
        if (res) {
          proxy.$msgBoxUtil.ok(t('connection-success'))
        }
      })
    }
  })
}
//取消操作
const cancelConnect = inject(CancelConnectOps, () => {})
const emits = defineEmits(['cancel'])
const cancel = () => {
  cancelConnect()
  emits('cancel')
}
defineExpose({ cancel })
</script>

<template>
  <div class="box">
    <div class="box-panel">
      <div class="box-panel-header">
        <svg-icon :icon-name="form.icon"></svg-icon> {{ form.type }}
      </div>
      <div class="box-panel-form">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="right"
          label-width="80px"
        >
          <el-form-item :label="$t('code.conn-name')" prop="name">
            <el-input v-model="form.name" placeholder="" />
          </el-form-item>
          <el-row>
            <el-col :span="16"
              ><el-form-item :label="$t('code.conn-host')" prop="url">
                <el-input v-model="form.url" placeholder="" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('code.conn-port')" prop="port">
                <el-input v-model="form.port" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item :label="$t('code.conn-username')" prop="userName">
            <el-input v-model="form.userName" placeholder="" />
          </el-form-item>
          <el-form-item :label="$t('code.conn-passowrd')" prop="password">
            <el-input v-model="form.password" type="password" placeholder="" />
          </el-form-item>
          <el-form-item :label="$t('code.conn-db')" prop="dbName">
            <el-input v-model="form.dbName" placeholder="" />
          </el-form-item>
        </el-form>
      </div>
      <div class="box-panel-btn">
        <el-button @click="testConnect(formRef)">{{
          $t('code.test-connection')
        }}</el-button>
        <el-button @click="cancel">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="save(formRef)">{{ $t('save') }}</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  .box-panel {
    max-width: 800px;
    .box-panel-header {
      text-align: center;
      margin-bottom: 20px;
      font-size: 24px;
      color: #ddd;
      font-weight: bold;
    }
    .box-panel-btn {
      text-align: right;
    }
  }
}
</style>
