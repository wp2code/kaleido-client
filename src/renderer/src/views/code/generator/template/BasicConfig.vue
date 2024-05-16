<script lang="ts" setup>
import { CodeTemplateBasicConfig } from '@/api/code/types'
const config = defineModel({
  type: Object as PropType<CodeTemplateBasicConfig>,
  required: true,
})
const basicConfigView = ref<CodeTemplateBasicConfig>(config.value)
// watchEffect(() => {
//   basicConfigView.value = props.value.basicConfig
//     ? (JSON.parse(props.value.basicConfig) as CodeTemplateBasicConfig)
//     : {}
//   if (basicConfigView.value) {
//     props.value.basicConfig = JSON.stringify(basicConfigView.value)
//   }
// })
const handleOpenMenu = async () => {
  const filePath = await window.winApi.openDialog({ properties: ['openDirectory'] })
  if (filePath) {
    basicConfigView.value.codePath = filePath
  }
}
</script>
<template>
  <div class="box">
    <div>
      <div class="box-lable">代码地址：</div>
      <div class="box-file">
        <el-input v-model="basicConfigView!.codePath">
          <template #append>
            <el-button type="primary" @click="handleOpenMenu">选择地址</el-button>
          </template>
        </el-input>
      </div>
    </div>
    <div>
      <div class="box-lable">代码作者：</div>
      <div><el-input v-model="basicConfigView!.author" /></div>
    </div>
    <div>
      <div>
        <div class="box-lable">代码license：</div>
        <div><el-input v-model="basicConfigView!.license" type="textarea" /></div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.box {
  padding: 10px;
  .box-file {
    display: flex;
    flex-direction: row;
  }
  .upload-path {
    display: flex;
  }
  // background-color: red;
  .box-lable {
    font-size: 14px;
    font-weight: 400;
    margin-top: 10px;
  }
}
</style>
