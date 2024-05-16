<script lang="ts" setup>
import { MapperCodeView, CodeTemplate } from '@/api/code/types'
import { SelectDataTableData } from '@/api/datasource/types'
import { previewCode } from '@/api/code/index'
import { buildCodeParamsWithCodeView } from '@/utils/codeUtil'
import { useGenCodeParamStore } from '@/store/modules/cache'
const props = defineProps({
  data: {
    type: Object as PropType<MapperCodeView>,
    default: {} as MapperCodeView,
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
const methodVisible = ref(false)
const mapperCodeView = ref<MapperCodeView>()
const useGenCodeParam = useGenCodeParamStore()
const apis = [
  'insertSelective',
  'insertOrUpdate',
  'insertOrUpdateSelective',
  'updateByPrimaryKey',
  'updateByPrimaryKeySelective',
  'selectByEntity',
  'selectByPrimaryKey',
  'deleteByPrimaryKey',
]
const methodList = ref<string[]>(apis)
watchEffect(() => {
  const codeView = props.data as MapperCodeView
  mapperCodeView.value = {
    ...codeView,
    methodList: apis,
    toCodeGenerationParam: codeView.toCodeGenerationParam,
  } as MapperCodeView
})
watch(
  [
    () => mapperCodeView.value.name,
    () => mapperCodeView.value.useMybatisPlus,
    () => mapperCodeView.value.superclassName,
    () => mapperCodeView.value.packageName,
    () => mapperCodeView.value.methodList,
  ],
  (_nv, _ov) => {
    if (_nv !== _ov && _ov[0] != undefined) {
      refreshGenCode()
    }
  },
  {
    deep: true,
  }
)
const refreshGenCode = () => {
  const entityCodeParam = useGenCodeParam.getCodeParamCache('Entity')
  const p = buildCodeParamsWithCodeView([mapperCodeView.value], props.tableData)
  if (entityCodeParam) {
    p.push(entityCodeParam)
  }
  previewCode(props.templateInfo.id, props.tableData.dataSource?.id, p, ['Mapper']).then(
    (res) => {
      if (res.data.codeGenerationList) {
        mapperCodeView.value.templateCode = res.data.codeGenerationList[0].templateCode
      }
    }
  )
}
const clickMethod = () => {
  methodVisible.value = true
}
const clickReset = () => {
  mapperCodeView.value.methodList = apis
  methodList.value = apis
}
const clickCancel = () => {
  methodVisible.value = false
}
const clickConfirm = () => {
  mapperCodeView.value.methodList = methodList.value
}
const handleOpenMenu = async () => {
  const filePath = await window.winApi.openDialog({ properties: ['openDirectory'] })
  if (filePath) {
    mapperCodeView.value.codePath = filePath
  }
}
</script>
<template>
  <div class="modelBox">
    <div class="left">
      <div>
        <div>类名称:</div>
        <div><el-input v-model="mapperCodeView!.name" /></div>
      </div>
      <div>
        <div>包名称:</div>
        <div><el-input v-model="mapperCodeView!.packageName" /></div>
      </div>
      <div>
        <div>包路径:</div>
        <div><el-input v-model="mapperCodeView!.sourceFolder" /></div>
      </div>
      <div>
        <div>父类:</div>
        <div><el-input v-model="mapperCodeView!.superclassName" /></div>
      </div>
      <div>
        <div class="box-lable">代码地址：</div>
        <div class="box-file">
          <el-input v-model="mapperCodeView!.codePath">
            <template #append>
              <el-button type="primary" @click="handleOpenMenu">选择地址</el-button>
            </template>
          </el-input>
        </div>
      </div>
      <div>
        <div>
          <el-checkbox v-model="mapperCodeView.useMybatisPlus">Mybatis-puls</el-checkbox>
        </div>
      </div>
      <div>
        <el-link
          v-show="mapperCodeView.useMybatisPlus == false"
          type="primary"
          @click="clickMethod()"
          >生成方法</el-link
        >
      </div>
    </div>
    <div class="right">
      <Codeview v-model:code="mapperCodeView.templateCode" dark></Codeview>
    </div>
  </div>
  <el-dialog
    v-model="methodVisible"
    title="Mapper方法"
    draggable
    width="80%"
    append-to-body
    :close-on-click-modal="true"
    :close-on-press-escape="true"
  >
    <el-checkbox-group v-model="methodList">
      <div class="method-list">
        <el-checkbox v-for="item in apis" :key="item" :label="item" :value="item">
          {{ item }}
        </el-checkbox>
      </div>
    </el-checkbox-group>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="clickCancel()">取消</el-button>
        <el-button @click="clickReset()">重置</el-button>
        <el-button type="primary" @click="clickConfirm()"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
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
