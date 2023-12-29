<script lang="ts" setup>
import { CodeTemplate, CodeTemplateBasicConfig } from '@/api/code/types'
const props = defineProps({
  data: {
    type: Object as PropType<CodeTemplate>,
    default: {} as CodeTemplate,
  },
})
const form = ref<CodeTemplateBasicConfig>(
  props.data!.basicConfig || ({} as CodeTemplateBasicConfig)
)
watchEffect(() => {
  form.value = props.data!.basicConfig || ({} as CodeTemplateBasicConfig)
})
const handleOpenMenu = async () => {
  const filePath = await window.winApi.openDialog({ properties: ['openDirectory'] })
  if (filePath) {
    form.value.codePath = filePath
  }
}
</script>
<template>
  <div class="box">
    <div>
      <div class="box-lable">代码地址：</div>
      <div class="box-file">
        <el-input v-model="form.codePath">
          <template #append>
            <el-button type="primary" @click="handleOpenMenu">选择地址</el-button>
          </template>
        </el-input>
      </div>
    </div>
    <div>
      <div class="box-lable">代码作者：</div>
      <div><el-input v-model="form.author" /></div>
    </div>
    <div>
      <div>
        <div class="box-lable">代码license：</div>
        <div><el-input v-model="form.license" type="textarea" /></div>
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
