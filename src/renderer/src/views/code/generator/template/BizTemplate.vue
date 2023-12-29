<script lang="ts" setup>
import { CodeTemplate, TemplateConfig } from '@/api/code/types'
const props = defineProps({
  data: {
    type: Object as PropType<CodeTemplate>,
    default: {} as CodeTemplate,
  },
})
const templateParams = ref<TemplateConfig>({} as TemplateConfig)
watchEffect(() => {
  const codeTemplateConfigs = props.data!.templateConfigList || []
  for (let config of codeTemplateConfigs) {
    if (config.name === 'BizService') {
      templateParams.value = config.templateParams
    }
  }
})
const handleOpenMenu = async () => {
  const filePath = await window.winApi.openDialog({ properties: ['openDirectory'] })
  if (filePath) {
    templateParams.value.codePath = filePath
  }
}
</script>

<template>
  <div class="modelBox">
    <div class="left">
      <div>
        <div>类名称:</div>
        <div><el-input v-model="templateParams!.name" /></div>
      </div>
      <div>
        <div>包名称:</div>
        <div><el-input v-model="templateParams!.packageName" /></div>
      </div>
      <div>
        <div>包路径:</div>
        <div><el-input v-model="templateParams!.sourceFolder" /></div>
      </div>
      <div>
        <div>父类:</div>
        <div><el-input v-model="templateParams!.superclass" /></div>
      </div>
      <div>
        <div>接口:</div>
        <div><el-input v-model="templateParams!.implInterface" /></div>
      </div>
      <div>
        <div class="box-lable">代码地址：</div>
        <div class="box-file">
          <el-input v-model="templateParams!.codePath">
            <template #append>
              <el-button type="primary" @click="handleOpenMenu">选择地址</el-button>
            </template>
          </el-input>
        </div>
      </div>
      <div>
        <div>
          <el-checkbox v-model="templateParams!.mybatisPuls">Mybatis-puls</el-checkbox>
        </div>
      </div>
    </div>
    <div class="right">代码预览</div>
  </div>
</template>

<style lang="scss" scoped>
.modelBox {
  display: flex;
  flex-direction: row;
  max-width: 70vw;
  .left {
    padding: 1vh;
    div {
      padding: 0.1rem;
    }
  }

  .right {
    border: 1px solid #6b778c;
    flex-grow: 1;
  }
  .fieldDiv {
    max-width: 70vw;
    padding: 0.1rem;
  }
}
</style>
