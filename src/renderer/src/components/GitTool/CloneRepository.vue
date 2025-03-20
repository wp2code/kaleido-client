<!-- CloneRepository.vue -->
<template>
  <div v-if="model" class="box">
    <div class="box-panel">
      <div class="box-panel-form">
        <el-form :model="gitParam" label-position="right" label-width="120px">
          <el-form-item label="Repository URL:" prop="repoUrl">
            <el-input v-model="gitParam!.repoUrl" />
          </el-form-item>
          <el-form-item label="Local Path:" prop="localPath">
            <el-input v-model="gitParam!.localPath" />
          </el-form-item>
          <el-form-item label="Username:" prop="username">
            <el-input v-model="gitParam!.username" />
          </el-form-item>
          <el-form-item label="Password:" prop="password">
            <el-input v-model="gitParam!.password" type="password" />
          </el-form-item>
        </el-form>
      </div>
      <div class="box-panel-btn">
        <el-button @click.prevent="cancel">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click.prevent="cloneRepo()">{{
          $t('clone')
        }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import console from 'console'
import { ref } from 'vue'
interface GitParam {
  repoUrl: string
  localPath: string
  username: string
  password: string
}
const model = defineModel({ default: true })
// const repoUrl = ref('https://git.snd00.com/ebxsys/backend/mandun-xcx.git')
// const localPath = ref('C:\\Users\\liuweiping\\Downloads\\新建文件夹')
// const username = ref('liuwp')
// const password = ref('Bioffice//14')
// const message = ref('')
const gitParam = ref<GitParam>({} as GitParam)
const cancel = () => {
  model.value = false
}
const cloneRepo = async () => {
  try {
    const auth =
      gitParam.value.username && gitParam.value.password
        ? { username: gitParam.value.username, password: gitParam.value.password }
        : undefined
    const result = await window.gitToolApi.cloneRepository(
      gitParam.value.repoUrl,
      gitParam.value.localPath,
      auth,
      true
    )
    if (result == 0) {
      console.log('Repository cloned successfully')
    } else {
      if (result == -2) {
        console.log('目录不为空，请选择删除目录')
      } else {
        console.log('Repository cloned failed')
      }
    }
  } catch (error) {
    // message.value = `Failed to clone repository: ${error.message}`
  }
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
</style>
