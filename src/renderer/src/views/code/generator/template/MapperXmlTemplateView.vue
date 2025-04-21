<script lang="ts" setup>
// import { CodeTemplateConfig, TemplateConfig } from '@/api/code/types'
import { XmlCodeView, CodeTemplate, PartitionTempate } from '@/api/code/types'
import { SelectDataTableData } from '@/api/datasource/types'
import { previewCode } from '@/api/code/index'
import { buildCodeParamsWithCodeView, initBuildXmlCodeParams } from '@/utils/codeUtil'
import { useGenCodeParamStore } from '@/store/modules/cache'
import CodeTemplateEdit from './CodeTemplateEdit.vue'
import { TriggerWatch } from '../../keys'
import { debounce } from 'lodash-es'
const props = defineProps({
  data: {
    type: Object as PropType<XmlCodeView>,
    default: {} as XmlCodeView,
  },
  modelFields: {
    type: Array,
    default: () => [],
  },
  showMybatisPuls: {
    type: Boolean,
    default: true,
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
const canTriggerWatch = inject(TriggerWatch) as Ref
const xmlCodeView = ref<XmlCodeView>()
const methodVisible = ref(false)
const templateEditVisible = ref(false)
const templateId = ref('')
const apis = initBuildXmlCodeParams()
const checkAllCodePrams = ref(true)
const isIndeterminate = ref(true)
const useGenCodeParam = useGenCodeParamStore()
const methodList = ref([])
const initMethodList = ref([])
const handleCheckedAllCodeParamChange = (val: boolean) => {
  let checked = apis.map((item) => {
    return item
  })
  methodList.value = val ? checked : []
  isIndeterminate.value = false
}
function checkBoxStatusChange(_value: string[]) {
  const checkedCount = _value.length
  checkAllCodePrams.value = checkedCount === apis.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < apis.length
}
const handleCheckedCodeParamChange = (_value: string[]) => {
  checkBoxStatusChange(_value)
}

const { stop } = watchEffect(() => {
  if (props.templateInfo) {
    const tpConfig = props.templateInfo!.templateConfigList.filter(
      (config) => config.name == 'Xml'
    )[0]
    const methods = tpConfig.templateParams?.methodList || []
    initMethodList.value = methods
    methodList.value = methods
    templateId.value = props.templateInfo!.id
    isIndeterminate.value = initMethodList.value.length != apis.length
    if (methods.length == apis.length) {
      checkAllCodePrams.value = true
    }
  }
  xmlCodeView.value = props.data
})
watch(
  [
    () => xmlCodeView.value.name,
    () => xmlCodeView.value.nameSuffix,
    () => xmlCodeView.value.useMybatisPlus,
    () => xmlCodeView.value.namespace,
    () => xmlCodeView.value.sourceFolder,
    () => xmlCodeView.value.codePath,
    () => xmlCodeView.value.codeOutPath,
    () => xmlCodeView.value.packageName,
    () => xmlCodeView.value.methodList,
  ],
  (_nv, _ov) => {
    if (canTriggerWatch!.value == true && _nv !== _ov && _ov[0] != undefined) {
      refreshGenCode(false)
    }
  }
)
const refreshGenCode = debounce((directUseTemplateConfig: boolean) => {
  const entityCodeParam = useGenCodeParam.getCodeParamCache('Entity')
  const mapperCodeParam = useGenCodeParam.getCodeParamCache('Mapper')
  const p = buildCodeParamsWithCodeView([xmlCodeView.value], props.tableData)
  if (entityCodeParam) {
    p.push(entityCodeParam)
  }
  if (mapperCodeParam) {
    p.push(mapperCodeParam)
  }
  previewCode(
    props.templateInfo.id,
    props.tableData.dataSource?.id,
    directUseTemplateConfig,
    p,
    ['Xml']
  ).then((res) => {
    if (res.data.codeGenerationList) {
      XmlCodeView.replace(res.data.codeGenerationList[0], xmlCodeView.value)
    }
  })
}, 300)
const editTemlateSuccess = (template: PartitionTempate) => {
  xmlCodeView.value = Object.assign(xmlCodeView.value, {
    ...template,
    name: xmlCodeView.value.name,
  })
  xmlCodeView.value.name = null
  initMethodList.value = template.methodList
  methodList.value = initMethodList.value
  checkBoxStatusChange(methodList.value)
  stop()
  buildCodeParamsWithCodeView([xmlCodeView.value], props.tableData)
}
const clickMethod = () => {
  methodVisible.value = true
}
const clickReset = () => {
  methodList.value = initMethodList.value
  checkBoxStatusChange(initMethodList.value)
}
const clickCancel = () => {
  methodVisible.value = false
}
const clickConfirm = () => {
  xmlCodeView.value.methodList = methodList.value
}
const handleOpenMenu = async () => {
  const filePath = await window.winApi.openDirDialog()
  if (filePath) {
    xmlCodeView.value.codePath = filePath
  }
}
const toEditTemplate = () => {
  templateEditVisible.value = true
}
</script>
<template>
  <div class="modelBox">
    <div class="left">
      <div style="text-align: right">
        <el-link type="primary" @click="toEditTemplate()">{{
          $t('code.template-edit')
        }}</el-link>
        <CodeTemplateEdit
          v-if="templateEditVisible"
          v-model:is-show="templateEditVisible"
          :template-id="templateId"
          :title="$t('tmplate-title', ['Xml'])"
          type="Xml"
          @success="editTemlateSuccess"
        ></CodeTemplateEdit>
      </div>
      <div>
        <div>{{ $t('file-name') }}:</div>
        <div><el-input v-model="xmlCodeView!.name" /></div>
      </div>
      <div>
        <div>{{ $t('code.package-name') }}:</div>
        <div><el-input v-model="xmlCodeView!.packageName" /></div>
      </div>
      <div>
        <div>{{ $t('code.source-folder') }}:</div>
        <div><el-input v-model="xmlCodeView!.sourceFolder" /></div>
      </div>
      <div>
        <div>{{ $t('tmplate-space', ['Mapper']) }}:</div>
        <div><el-input v-model="xmlCodeView!.namespace" /></div>
      </div>
      <div>
        <div class="box-lable">{{ $t('code.path') }}：</div>
        <div class="box-file">
          <el-tooltip
            :content="xmlCodeView!.codePath"
            :disabled="
              xmlCodeView.codePath == undefined || xmlCodeView.codePath.trim().length <= 0
            "
            placement="bottom"
          >
            <el-input v-model="xmlCodeView!.codePath">
              <template #append>
                <el-button type="primary" @click="handleOpenMenu">{{
                  $t('code.select-path')
                }}</el-button>
              </template>
            </el-input>
          </el-tooltip>
        </div>
      </div>
      <div>
        <el-checkbox v-model="xmlCodeView.useMybatisPlus">Mybatis-puls</el-checkbox>
      </div>
      <div>
        <el-link
          v-show="!xmlCodeView.useMybatisPlus"
          type="primary"
          @click="clickMethod()"
          >{{ $t('code.gen-method') }}</el-link
        >
      </div>
    </div>
    <div class="right">
      <Codeview v-model:code="xmlCodeView.templateCode" dark></Codeview>
    </div>
  </div>
  <el-dialog
    v-model="methodVisible"
    draggable
    :title="$t('gen-tmplate-method', ['Xml(SQL)'])"
    width="80%"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-checkbox
      v-model="checkAllCodePrams"
      :indeterminate="isIndeterminate"
      @change="handleCheckedAllCodeParamChange"
    >
      {{ $t('select-all') }}
    </el-checkbox>
    <el-checkbox-group v-model="methodList" @change="handleCheckedCodeParamChange">
      <div class="method-list">
        <el-checkbox v-for="item in apis" :key="item" :label="item" :value="item">
          {{ item }}
        </el-checkbox>
      </div>
    </el-checkbox-group>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="clickCancel()">{{ $t('cancel') }}</el-button>
        <el-button @click="clickReset()">{{ $t('reset') }}</el-button>
        <el-button type="primary" @click="clickConfirm()">
          {{ $t('confirm') }}
        </el-button>
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
