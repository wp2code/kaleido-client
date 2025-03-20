<template>
  <div v-if="model" class="box">
    <div class="box-panel">
      <div class="box-panel-form">
        <el-form :model="param" label-position="right" label-width="120px">
          <el-form-item label="类型：" prop="type">
            <el-col :span="11">
              <el-select v-model="param!.type" placeholder="请选择">
                <el-option label="JAVA" :value="0"></el-option>
                <el-option label="Web" :value="1"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="名称：" prop="name">
            <el-input v-model="param!.name" placeholder="Config name" />
          </el-form-item>
          <el-form-item
            v-if="RepositoryType.Local != props.repositoryType"
            label="仓库地址："
            prop="name"
          >
            <el-input v-model="param!.name" placeholder="Repository url">
              <template #append>
                <el-switch v-model="gitAuth" size="small" />
                <el-button type="primary" icon="el-icon-search" @click="cloneRepo()"
                  >克隆</el-button
                >
              </template>
            </el-input>
          </el-form-item>
          <el-row v-if="gitAuth">
            <el-col :span="12">
              <el-form-item label="用户名：">
                <el-input v-model="param!.remark" placeholder="username" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="密码：">
                <el-input
                  v-model="param!.remark"
                  placeholder="password"
                  type="password"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="地址：" prop="path">
            <el-tooltip
              :content="param!.path"
              :disabled="param.path == undefined || param.path.trim().length <= 45"
              placement="bottom"
            >
              <el-input v-model="param!.path" placeholder="Code path">
                <template #append>
                  <el-button type="primary" @click="handleOpenMenu">{{
                    $t('code.select-path')
                  }}</el-button>
                </template>
              </el-input>
            </el-tooltip>
          </el-form-item>
          <el-divider />
          <div class="box-panel-title">Build and Run</div>
          <el-form-item prop="name">
            <el-input v-model="param!.name" placeholder="Maven options" />
          </el-form-item>
          <el-form-item prop="name">
            <el-input v-model="param!.name" placeholder="VM options" />
          </el-form-item>
          <el-form-item prop="name">
            <el-input v-model="param!.name" placeholder="Program arguments" />
          </el-form-item>
          <!-- <el-form-item label="备注：" prop="reamrk">
            <el-input v-model="param!.remark" type="textarea" placeholder="Remark" />
          </el-form-item> -->
        </el-form>
      </div>
      <div class="box-panel-btn">
        <el-button @click.prevent="cancel">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click.prevent="save()">{{ $t('save') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ContainerConfig, RepositoryType } from '@/api/container/types'
const model = defineModel<boolean>({ default: true })
// 定义 Props 并指定类型
const props = defineProps({
  data: {
    type: Object as PropType<ContainerConfig>,
    required: false,
  },
  repositoryType: {
    type: Object as PropType<RepositoryType>,
    required: true,
  },
})
const gitAuth = ref(false)
const param = ref<ContainerConfig>(
  props.data ? { ...props.data } : ({ type: 0 } as ContainerConfig)
)
const handleOpenMenu = async () => {
  const filePath = await window.winApi.openDirDialog()
  if (filePath) {
    param.value.path = filePath
  }
}
const cloneRepo = async () => {
  //TODO
}
const cancel = () => {
  model.value = false
}
const save = () => {
  model.value = false
}
</script>

<style scoped>
.box {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  .box-panel {
    width: 90%;
    /* background-color: red; */
    max-width: 800px;
    /* .box-panel-header {
      text-align: center;
      margin-bottom: 20px;
      font-size: 24px;
      color: #ddd;
      font-weight: bold;
    } */
    .box-panel-btn {
      text-align: right;
    }
  }
}
.box-panel-title {
  color: #ddd;
}
</style>
