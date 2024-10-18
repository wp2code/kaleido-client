<script lang="ts" setup>
import logo from '@/assets/logo/icon.png'
import MessageBox from '@/utils/MessageBox'
const currVersion = ref('')
const newVersion = ref('')
const dialogVisible = ref(false)
const isUpdateChecking = ref(false)
interface ProgressInfo {
  show: boolean
  showText?: boolean
  percentage?: number
  color?: string
  text?: string
  duration?: number
  progress?: number
  downloadSpeed?: string
  textStyle?: {}
}
interface DialogInfo {
  type: 'error' | 'success'
  title: string
  cancelText: string
  confirmText: string
  desc: string
  icon: string
}
const progressInitOption = {
  show: false,
  showText: false,
  percentage: 0,
  color: '#409eff',
  text: '',
  duration: 5,
  progress: 5,
  downloadSpeed: '',
  textStyle: { color: '#409eff' },
}
const dialogInfo = ref<DialogInfo>()
const progress = ref<ProgressInfo>({ ...progressInitOption } as ProgressInfo)
//检查更新
const clickCheckForUpdateVersion = async () => {
  if (!isUpdateChecking.value) {
    isUpdateChecking.value = true
    progress.value.show = true
    const data = await window.winApi.checkForUpdateVersion(true)
    console.log('检查更新 data is', data)
    if (!data.success) {
      isUpdateChecking.value = false
      progress.value.show = false
      MessageBox.fail(`版本检查异常`)
    }
  }
}
const onConfirmBtn = (dialogInfo: DialogInfo) => {
  dialogVisible.value = false
  isUpdateChecking.value = false
  if (dialogInfo && dialogInfo.type == 'success') {
    window.winApi.quitAndInstallApp()
  } else {
    window.winApi.openExternal('https://github.com/wp2code/kaleido-client/releases')
  }
}
const onCancelBtn = (dialogInfo: DialogInfo) => {
  dialogVisible.value = false
  isUpdateChecking.value = false
  if (dialogInfo.type == 'success') {
    progress.value.show = false
  }
}
const watchUpdate = async () => {
  await window.winApi.watchAppUpdateMessage(async (res) => {
    if (res.success) {
      const data = res.data || {}
      if (res.cmd == 'up-check') {
        progress.value.show = true
        progress.value.percentage = 100
        progress.value.text = '检查中。。。'
      }
      //发现新版本
      else if (res.cmd == 'up-available') {
        console.log('up-available', res)
        progress.value.text = `发现新版本（${data.version}）,等待更新。。。`
        const dpRes = await window.winApi.sendDownloadUpdate()
        console.log('sendDownloadUpdate', dpRes)
        if (dpRes && !dpRes.success) {
          progress.value.show = false
        }
      }
      //未发现新版本
      else if (res.cmd == 'up-unavailable') {
        progress.value.show = false
        isUpdateChecking.value = false
        MessageBox.ok(`当前版本 ${data.version} 已是最新版本`)
      }
      //更新进度
      else if (res.cmd == 'up-progress') {
        console.log('up-progress', res)
        progress.value.text = '更新中。。。'
        progress.value.color = '#67c23a'
        progress.value.textStyle = { color: progress.value.color }
        progress.value.show = true
        progress.value.showText = true
        const percentage = data?.percent
        progress.value.percentage = Math.min(percentage, 100)
        progress.value.duration = Math.ceil(100 / progress.value.percentage)
        progress.value.downloadSpeed = data.speed ? '(' + data.speed + ')' : ''
      }
      //更新完成
      else if (res.cmd == 'up-downloaded') {
        console.log('更新完成的数据：', data)
        isUpdateChecking.value = false
        progress.value.text = '更新完成'
        progress.value.downloadSpeed = ''
        progress.value.color = '#67c23a'
        progress.value.textStyle = { color: progress.value.color }
        progress.value.show = true
        dialogInfo.value = {
          type: 'success',
          title: '版本更新',
          cancelText: '取消',
          confirmText: '更新并且重启',
          desc: '已下载最新的版本,需退出重新安装！',
          icon: 'successiocn',
        } as DialogInfo
        dialogVisible.value = true
      }
    } else {
      //更新错误
      if (res.cmd == 'up-error') {
        isUpdateChecking.value = false
        progress.value.show = false
        dialogInfo.value = {
          type: 'error',
          title: '更新错误',
          cancelText: '取消更新',
          confirmText: '网站下载',
          desc: '软件更新过程中发生错误 ！' + res.error || '',
          icon: 'warningicon',
        } as DialogInfo
        dialogVisible.value = true
      }
    }
  })
}
watch(
  () => progress.value.show,
  (_newValue, _oldValue) => {
    if (!_newValue && _oldValue) {
      progress.value = { ...progressInitOption } as ProgressInfo
    }
  },
  { deep: true }
)
onMounted(async () => {
  currVersion.value = await window.winApi.getAppVersion()
  newVersion.value = await window.winApi.getAppUpdateVersion()
  watchUpdate()
})
</script>
<template>
  <div class="ab-box">
    <div class="ab-info">
      <div class="info-logo">
        <img :src="logo" class="w-20 h-20" />
      </div>
      <div class="info-desc">
        <div>Kaleido {{ currVersion }}</div>
        <div v-if="newVersion">检查最新版本 {{ newVersion }}</div>
        <div v-else>当前版本 {{ currVersion }}</div>
        <div>
          <el-button type="success" icon="Upload" @click="clickCheckForUpdateVersion"
            >检查更新</el-button
          >
        </div>
      </div>
    </div>
    <div v-if="progress.show" class="ab-progress">
      <div :style="progress.textStyle">
        {{ progress.downloadSpeed }}{{ progress.text }}
      </div>
      <el-progress
        :percentage="progress.percentage"
        :stroke-width="20"
        :show-text="progress.showText"
        :indeterminate="true"
        :color="progress.color"
        striped
        striped-flow
        :duration="progress.duration"
      />
    </div>

    <el-dialog
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      center
    >
      <template #header>
        <svg-icon :icon-name="dialogInfo?.icon" size="1.2em" />
        <span class="dialog-text dialog-header"> {{ dialogInfo?.title }}</span>
      </template>
      <span class="dialog-text"> {{ dialogInfo?.desc }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="onCancelBtn(dialogInfo)">{{
            dialogInfo?.cancelText
          }}</el-button>
          <el-button type="primary" @click="onConfirmBtn(dialogInfo)">
            {{ dialogInfo?.confirmText }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.ab-box {
  width: 100%;
  height: 100%;
  color: #ddd;
  text-align: center;
  .ab-info {
    margin-top: 10rem;
    justify-content: center;
    display: flex;
    flex-direction: row;
    .info-desc {
      margin-left: 0.8rem;
      & > :first-child {
        font-size: medium;
        font-weight: 600;
      }
      & > :nth-child(2) {
        color: grey;
      }
    }
  }
  .ab-progress {
    width: 60%;
    margin: 0 auto;
    justify-content: center;
  }
}
.dialog-header {
  font-weight: 600;
  font-size: medium;
}
.dialog-text {
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
}
</style>
