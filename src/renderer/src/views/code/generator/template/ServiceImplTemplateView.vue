<script lang="ts" setup>
import { ServiceCodeView, CodeTemplate } from '@/api/code/types'
import { SelectDataTableData } from '@/api/datasource/types'
import { previewCode } from '@/api/code/index'
import { buildCodeParamsWithCodeView } from '@/utils/codeUtil'
import { useGenCodeParamStore } from '@/store/modules/cache'
const props = defineProps({
  data: {
    type: Object as PropType<ServiceCodeView>,
    default: {} as ServiceCodeView,
  },
  templateInfo: {
    type: Object as PropType<CodeTemplate>,
    required: true,
  },
  tableData: {
    type: Object as PropType<SelectDataTableData>,
    required: true,
  },
  keyValue: {
    type: String,
    required: false,
  },
})
const serviceCodeView = ref<ServiceCodeView>()
const useGenCodeParam = useGenCodeParamStore()
const selectMode = ref('0')
const implInterfaceName = ref('')
watchEffect(() => {
  const codeView = props.data as ServiceCodeView
  serviceCodeView.value = {
    ...codeView,
    toCodeGenerationParam: codeView.toCodeGenerationParam,
  } as ServiceCodeView
  implInterfaceName.value = codeView.implInterfaceName
})
watch(
  [
    () => serviceCodeView.value.name,
    () => serviceCodeView.value.useMybatisPlus,
    () => serviceCodeView.value.superclassName,
    () => serviceCodeView.value.packageName,
    () => props.keyValue,
    () => implInterfaceName.value,
    () => selectMode.value,
  ],
  (_nv, _ov) => {
    if ((_nv !== _ov || _nv[6] == '1') && _ov[0] != undefined) {
      refreshGenCode()
    }
  }
)
const refreshGenCode = () => {
  const serviceApiCodeParam = useGenCodeParam.getCodeParamCache('ServiceApi')
  serviceCodeView.value.implInterfaceName =
    selectMode.value == '1' ? implInterfaceName.value : null
  const p = buildCodeParamsWithCodeView([serviceCodeView.value], props.tableData)
  if (serviceCodeView.value.useMybatisPlus == true) {
    const mapperCodeParam = useGenCodeParam.getCodeParamCache('Mapper')
    const entityCodeParam = useGenCodeParam.getCodeParamCache('Entity')
    if (mapperCodeParam) {
      p.push(mapperCodeParam)
    }
    if (entityCodeParam) {
      p.push(entityCodeParam)
    }
  }
  if (serviceApiCodeParam) {
    p.push(serviceApiCodeParam)
  }
  previewCode(props.templateInfo?.id, props.tableData.dataSource?.id, p, [
    'Service',
  ]).then((res) => {
    if (res.data.codeGenerationList) {
      serviceCodeView.value.templateCode = res.data.codeGenerationList[0].templateCode
    }
  })
}
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
        接口:
        <el-radio-group v-model="selectMode">
          <el-radio label="0">ServerApi</el-radio>
          <el-radio label="1">自定义</el-radio>
        </el-radio-group>

        <div>
          <el-input v-if="selectMode == '1'" v-model="implInterfaceName" />
        </div>
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
