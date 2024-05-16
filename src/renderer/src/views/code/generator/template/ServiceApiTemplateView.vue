<script lang="ts" setup>
import { ServiceApiCodeView, CodeTemplate } from '@/api/code/types'
import { SelectDataTableData } from '@/api/datasource/types'
import { previewCode } from '@/api/code/index'
import { buildCodeParamsWithCodeView } from '@/utils/codeUtil'
import { useGenCodeParamStore } from '@/store/modules/cache'
const props = defineProps({
  data: {
    type: Object as PropType<ServiceApiCodeView>,
    default: {} as ServiceApiCodeView,
  },
  templateInfo: {
    type: Object as PropType<CodeTemplate>,
    required: true,
  },
  tableData: {
    type: Object as PropType<SelectDataTableData>,
    required: true,
  },
})
const serviceApiCodeView = ref<ServiceApiCodeView>()
const useGenCodeParam = useGenCodeParamStore()
watchEffect(() => {
  const codeView = props.data as ServiceApiCodeView
  serviceApiCodeView.value = {
    ...codeView,
    toCodeGenerationParam: codeView.toCodeGenerationParam,
  } as ServiceApiCodeView
})
watch(
  [
    () => serviceApiCodeView.value.name,
    () => serviceApiCodeView.value.useMybatisPlus,
    () => serviceApiCodeView.value.superclassName,
    () => serviceApiCodeView.value.packageName,
  ],
  (_nv, _ov) => {
    if (_nv !== _ov && _ov[0] != undefined) {
      refreshGenCode()
    }
  }
)
const refreshGenCode = () => {
  const p = buildCodeParamsWithCodeView([serviceApiCodeView.value], props.tableData)
  if (serviceApiCodeView.value.useMybatisPlus == true) {
    const entityCodeParam = useGenCodeParam.getCodeParamCache('Entity')
    if (entityCodeParam) {
      p.push(entityCodeParam)
    }
  }
  previewCode(props.templateInfo.id, props.tableData.dataSource?.id, p, [
    'ServiceApi',
  ]).then((res) => {
    if (res.data.codeGenerationList) {
      serviceApiCodeView.value.templateCode = res.data.codeGenerationList[0].templateCode
    }
  })
}
const handleOpenMenu = async () => {
  const filePath = await window.winApi.openDialog({ properties: ['openDirectory'] })
  if (filePath) {
    serviceApiCodeView.value.codePath = filePath
  }
}
</script>

<template>
  <div class="modelBox">
    <div class="left">
      <div>
        <div>类名称:</div>
        <div><el-input v-model="serviceApiCodeView!.name" /></div>
      </div>
      <div>
        <div>包名称:</div>
        <div><el-input v-model="serviceApiCodeView!.packageName" /></div>
      </div>
      <div>
        <div>包路径:</div>
        <div><el-input v-model="serviceApiCodeView!.sourceFolder" /></div>
      </div>
      <div>
        <div>父类:</div>
        <div><el-input v-model="serviceApiCodeView!.superclassName" /></div>
      </div>
      <div>
        <div class="box-lable">代码地址：</div>
        <div class="box-file">
          <el-input v-model="serviceApiCodeView!.codePath">
            <template #append>
              <el-button type="primary" @click="handleOpenMenu">选择地址</el-button>
            </template>
          </el-input>
        </div>
      </div>
      <div>
        <div>
          <el-checkbox v-model="serviceApiCodeView!.useMybatisPlus"
            >Mybatis-puls</el-checkbox
          >
        </div>
      </div>
    </div>
    <div class="right">
      <Codeview v-model:code="serviceApiCodeView!.templateCode" dark></Codeview>
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
