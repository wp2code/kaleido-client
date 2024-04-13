<script lang="ts" setup>
import { CodeGenerationResult, WebCodeView } from '@/api/code/types'
const props = defineProps({
  data: {
    type: Object as PropType<CodeGenerationResult>,
    default: {} as CodeGenerationResult,
  },
})
const webCodeView = ref<WebCodeView>(new WebCodeView())
watchEffect(() => {
  const codeGenerationList = props.data!.codeGenerationList || []
  for (let code of codeGenerationList) {
    if (code.codeType === 'Controller') {
      webCodeView.value.name = code.name
      webCodeView.value.codeOutPath = code.codeOutPath
      webCodeView.value.codePath = code.codePath
      webCodeView.value.packageName = code.packageName
      webCodeView.value.sourceFolder = code.sourceFolder
      webCodeView.value.templateCode = code.templateCode
      webCodeView.value.codeType = code.codeType
      webCodeView.value.useMybatisPlus = code.useMybatisPlus
      webCodeView.value.superclassName = code.superclassName
      break
    }
  }
})
const handleOpenMenu = async () => {
  const filePath = await window.winApi.openDialog({ properties: ['openDirectory'] })
  if (filePath) {
    webCodeView.value.codePath = filePath
  }
}
</script>
<template>
  <div class="modelBox">
    <div class="left">
      <div>
        <div>类名称:</div>
        <div><el-input v-model="webCodeView!.name" /></div>
      </div>
      <div>
        <div>包名称:</div>
        <div><el-input v-model="webCodeView!.packageName" /></div>
      </div>
      <div>
        <div>包路径:</div>
        <div><el-input v-model="webCodeView!.sourceFolder" /></div>
      </div>
      <div>
        <div>父类:</div>
        <div><el-input v-model="webCodeView!.superclassName" /></div>
      </div>
      <div>
        <div class="box-lable">代码地址：</div>
        <div class="box-file">
          <el-input v-model="webCodeView!.codePath">
            <template #append>
              <el-button type="primary" @click="handleOpenMenu">选择地址</el-button>
            </template>
          </el-input>
        </div>
      </div>
      <div>
        <div>
          <el-checkbox v-model="webCodeView!.useSwagger">Swagger</el-checkbox>
          <el-checkbox v-model="webCodeView!.useMybatisPlus">Mybatis-puls</el-checkbox>
        </div>
      </div>
    </div>
    <div class="right">
      <Codeview v-model:code="webCodeView.templateCode" dark></Codeview>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$width: 250px;
.modelBox {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  // max-width: 70vw;
  // max-height: 50vw;
  // background-color: red;

  .left {
    padding: 1vh;
    width: $width;
    div {
      padding: 0.1rem;
    }
  }
  .right {
    width: 150px;
    // padding: 1vh;
    flex-grow: 1;
  }
  // .fieldDiv {
  //   max-width: 70vw;
  //   padding: 0.1rem;
  // }
}
</style>
