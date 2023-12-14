<script lang="ts" setup>
import { FormInstance, FormRules } from 'element-plus'
import { DbConfig, getDefault, DbType } from '~/repositories/entity/DbConfig'
import { isNumer } from '@/utils'
const { proxy } = getCurrentInstance()
const props = defineProps({
  data: {
    type: DbConfig,
    default: null,
  },
})
const formRef = ref<FormInstance>()
const params = toRef(inject<DbConfig>('Edit-Connect-Data'))
const form = ref<DbConfig>(convert(props.data !== null ? props.data : params.value))
function convert(data: DbConfig) {
  return data!.id ? { ...data } : getDefault(DbType[data.type])
}
const validatePort = (_rule: any, value: any, callback: any) => {
  if (!value || value === '') {
    callback(new Error('请输入端口号'))
  } else {
    if (!isNumer(value)) {
      callback(new Error('端口号错误'))
    }
    callback()
  }
}
//表单校验规则
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  url: [{ required: true, message: '请输入主机地址', trigger: 'blur' }],
  port: [{ required: true, validator: validatePort, trigger: 'blur' }],
  userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})
const refreshDbConnectList = inject('Refresh-Connect-List', () => {})
const save = async (formRef: FormInstance | undefined) => {
  if (!formRef) return
  await formRef.validate(async (valid, _fields) => {
    if (valid) {
      await window.db.DbConfig.save({ ...form.value }).then((r) => {
        proxy.$msgBoxUtil.ok('保存成功')
        refreshDbConnectList()
      })
    }
  })
}
// defineExpose
const testConnect = async (formRef: FormInstance | undefined) => {
  if (!formRef) return
  await formRef.validate(async (valid, _fields) => {
    if (valid) {
      //TODO
    }
  })
}
//取消操作
const cancelConnect = inject('Cancel-Connect-Ops', () => {})
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
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="" />
          </el-form-item>
          <el-row>
            <el-col :span="16"
              ><el-form-item label="主机" prop="url">
                <el-input v-model="form.url" placeholder="" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="端口" prop="port">
                <el-input v-model="form.port" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="用户名称" prop="userName">
            <el-input v-model="form.userName" placeholder="" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password" placeholder="" />
          </el-form-item>
          <el-form-item label="数据库" prop="dbName">
            <el-input v-model="form.dbName" placeholder="" />
          </el-form-item>
        </el-form>
      </div>
      <div class="box-panel-btn">
        <el-button @click="testConnect(formRef)">测试连接</el-button>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save(formRef)">保存</el-button>
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
      color: #fff;
      font-weight: bold;
    }
    .box-panel-btn {
      text-align: right;
    }
  }
}
</style>
