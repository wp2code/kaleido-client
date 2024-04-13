<script lang="ts" setup>
import { ServiceCodeView } from '@/api/code/types'
const props = defineProps({
  data: {
    type: Object as PropType<ServiceCodeView>,
    default: {} as ServiceCodeView,
  },
})
const serviceCodeView = ref<ServiceCodeView>(props.data)
watchEffect(() => {
  // const codeTemplateConfigs = props.data!.templateConfigList || []
  // for (let config of codeTemplateConfigs) {
  //   if (config.name === 'BizService') {
  //     templateParams.value = config.templateParams
  //   }
  // }
})
const handleOpenMenu = async () => {
  const filePath = await window.winApi.openDialog({ properties: ['openDirectory'] })
  if (filePath) {
    serviceCodeView.value.codePath = filePath
  }
}
</script>

<template>
  <div class="modelBox">
    <div class="left">
      <div>
        <div>类名称:</div>
        <div><el-input v-model="serviceCodeView!.name" /></div>
      </div>
      <div>
        <div>包名称:</div>
        <div><el-input v-model="serviceCodeView!.packageName" /></div>
      </div>
      <div>
        <div>包路径:</div>
        <div><el-input v-model="serviceCodeView!.sourceFolder" /></div>
      </div>
      <div>
        <div>父类:</div>
        <div><el-input v-model="serviceCodeView!.superclassName" /></div>
      </div>
      <div>
        <div>接口:</div>
        <div><el-input v-model="serviceCodeView!.implInterface" /></div>
      </div>
      <div>
        <div class="box-lable">代码地址：</div>
        <div class="box-file">
          <el-input v-model="serviceCodeView!.codePath">
            <template #append>
              <el-button type="primary" @click="handleOpenMenu">选择地址</el-button>
            </template>
          </el-input>
        </div>
      </div>
      <div>
        <div>
          <el-checkbox v-model="serviceCodeView!.useMybatisPlus"
            >Mybatis-puls</el-checkbox
          >
        </div>
      </div>
    </div>
    <div class="right">
      <Codeview v-model:code="serviceCodeView.templateCode" dark></Codeview>
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
