<script lang="ts" setup>
import { SelectDataTableData, TableDDLParam } from '@/api/datasource/types'
import { getTableDDL } from '@/api/datasource/index'
import {
  CodeTemplate,
  CodeGenerationParam,
  CodeGenerationResult,
  CodeTemplateBasicConfig,
} from '@/api/code/types'
import {
  listTemplateConfig,
  previewCode,
  generationCode,
  checkTemplateNameExists,
  copyAddTemplate,
  updateTemplateName,
  deleteCodeGenerationTemplate,
  updateDefaultTemplate,
  exportTemplate,
  saveUploadTemplate,
  getDefaultGenerateTemplateConfigList,
} from '@/api/code/index'
import { SelectDbable, TriggerWatch } from '../keys'
import { MoreMenu, initFilterMoreMenu } from './type'
import { ArrowRight } from '@element-plus/icons-vue'
import BasicConfig from './template/BasicConfig.vue'
import CodeResult from './template/CodeResult.vue'
import ModelTemplate from './template/ModelTemplate.vue'
import ServiceTemplate from './template/ServiceTemplate.vue'
import WebTemplate from './template/WebTemplate.vue'
import MapperTemplate from './template/MapperTemplate.vue'
import {
  buildCodeParamsWithTemplate,
  buildCodeParamsWithCache,
  initBuildCodePrams,
} from '@/utils/codeUtil'
import MessageBox from '@/utils/MessageBox'
import IoUtil from '@/utils/IoUtil'
import { ElLoading } from 'element-plus'
import { debounce } from 'lodash-es'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const morMenuList = ref<MoreMenu[]>()
const selectedCodeParams = ref([])
const allCodeParams = initBuildCodePrams()
const checkAllCodePrams = ref(true)
const isIndeterminate = ref(true)
const selectDbTableData = inject(SelectDbable) as Ref<SelectDataTableData>
const selectCodeTemplate = ref<CodeTemplate>()
const selectEditCodeTemplate = ref<CodeTemplate>()
const codeTemplateList = ref<CodeTemplate[]>()
const allCodeTemplateList = ref<CodeTemplate[]>()
const codeVisible = ref(false)
const codeDialogTitle = ref('')
const basicConfigVisible = ref(false)
const codeGenerationResult = ref<CodeGenerationResult>()
const generationCodeFlag = ref(false)
const basicConfigInfo = ref<CodeTemplateBasicConfig>()
const tpTablsKey = ref('')
const selectCTKey = ref()
const actionVisabel = ref(false)
const actionTitle = ref('')
const canTriggerWatch = ref(false)
const tableDDLName = ref()
const tableDDL = ref()
const tableDDLDialogVisible = ref(false)
const actionActive = ref<MoreMenu>()
const initTemplateList = async (
  directUseTemplateConfig: boolean,
  seleteTemplateId?: string
) => {
  handleCheckedAllCodeParamChange(true)
  await listTemplateConfig({
    needParseTemplate: true,
  }).then((res) => {
    if (res.data) {
      const list = res.data
      codeTemplateList.value = list
      allCodeTemplateList.value = list
      let template
      if (seleteTemplateId) {
        template = list.find((item) => item.id == seleteTemplateId)
      }
      if (template == undefined || !template) {
        template = list.filter((item) => item.isDefault == 1)[0]
        if (template == undefined || !template) {
          template = list[0]
        }
      }
      selectCodeTemplate.value = template
      const config = selectCodeTemplate.value?.basicConfig
      if (config) {
        basicConfigInfo.value = config
          ? (JSON.parse(config) as CodeTemplateBasicConfig)
          : null
      }
      initFilterMoreMenuList()
      refrshClick(directUseTemplateConfig)
    }
  })
}
const initDefaultGenerationTemplateConfig = async () => {
  await getDefaultGenerateTemplateConfigList(selectCodeTemplate.value.id).then((res) => {
    if (res) {
      selectedCodeParams.value = res.data
      isIndeterminate.value = selectedCodeParams.value.length !== allCodeParams.length
      checkAllCodePrams.value = !isIndeterminate.value
    }
  })
}
onMounted(() => {
  initTemplateList(true)
})
const copyTemplate = (item: any) => {
  actionTitle.value = t('copy-add')
  actionVisabel.value = true
  selectEditCodeTemplate.value.templateName =
    selectEditCodeTemplate.value.templateName + 'Copy'
  actionActive.value = (item.menu || {}) as MoreMenu
  actionActive.value.data = item.template
}
const deleteTemplate = (item: any) => {
  actionActive.value = (item.menu || {}) as MoreMenu
  actionActive.value.data = item.template
  MessageBox.confirm(
    t('delete-confirm') + `【${selectEditCodeTemplate.value.templateName}】? `,
    {
      ok: async () => {
        await deleteCodeGenerationTemplate(selectEditCodeTemplate.value.id).then(
          (res) => {
            initTemplateList(true)
            return res.data
          }
        )
      },
      successMsg: t('delete-success'),
      failMsg: t('delete-fail'),
    }
  )
}
const renameTemplate = (item: any) => {
  actionTitle.value = t('rename')
  actionVisabel.value = true
  actionActive.value = (item.menu || {}) as MoreMenu
  actionActive.value.data = item.template
}
const exoprtTemplate = async (_item: any) => {
  const path = await window.winApi.openSaveDialog({
    defaultPath: selectEditCodeTemplate.value.templateName,
    filters: [{ name: 'Json Template', extensions: ['json'] }],
    buttonLabel: t('export'),
  })
  if (path && path !== undefined) {
    exportTemplate(selectEditCodeTemplate.value.id).then(async (response) => {
      if (response) {
        await IoUtil.exportData(path, response.data, true, (_err) => {
          if (_err) {
            MessageBox.fail(t('export-fail'))
          } else {
            MessageBox.ok(t('export-success'))
          }
        })
      }
    })
  }
}
const importTemplate = async (_item: any) => {
  const filePath = await window.winApi.openFileDialog(false, {
    filters: [{ name: 'Json Template', extensions: ['json'] }],
    buttonLabel: t('import'),
  })
  if (filePath) {
    const data = IoUtil.importData(filePath, (_err) => {
      if (_err) {
        MessageBox.fail(t('import-fail'))
      }
    })
    if (data) {
      saveUploadTemplate(data).then((_res) => {
        MessageBox.ok(t('import-success'))
        initTemplateList(true, selectCodeTemplate.value.id)
      })
    }
  }
}
const settingDefaultTemplate = async (_item: any) => {
  if (selectEditCodeTemplate.value.isDefault == 1) {
    MessageBox.ok(t('template-is-default'))
    return
  }
  updateDefaultTemplate(selectEditCodeTemplate.value.id).then((res) => {
    if (res) {
      MessageBox.ok(t('set-success'))
      initTemplateList(true, selectCodeTemplate.value.id)
    }
  })
}
const initFilterMoreMenuList = () => {
  const copyTemplateItem = MoreMenu.mack(
    'copyAdd',
    t('copy-add'),
    'CopyDocument',
    copyTemplate
  )
  const renameTemplateItem = MoreMenu.mack('rename', t('rename'), 'SetUp', renameTemplate)
  const deleteTemplateItem = MoreMenu.mack(
    'delete',
    t('delete'),
    'Delete',
    deleteTemplate
  )
  const exportTemplateItem = MoreMenu.mack(
    'export',
    t('export'),
    'Download',
    exoprtTemplate
  )
  const importTemplateItem = MoreMenu.mack(
    'import',
    t('import'),
    'Upload',
    importTemplate
  )
  const settingDefaultItem = MoreMenu.mack(
    'settingDefault',
    t('set-default'),
    'Star',
    settingDefaultTemplate
  )
  morMenuList.value = initFilterMoreMenu(
    [
      copyTemplateItem,
      renameTemplateItem,
      deleteTemplateItem,
      exportTemplateItem,
      importTemplateItem,
      settingDefaultItem,
    ],
    (item: MoreMenu) => {
      if (selectCodeTemplate.value.isInternal == 1) {
        return item.id !== 'delete' && item.id !== 'rename'
      }
      if (selectCodeTemplate.value.isDefault == 1) {
        return item.id !== 'settingDefault'
      }
      return true
    }
  )
}
const actionSave = async () => {
  const actionActiveMenu = actionActive.value
  if (!actionActiveMenu) {
    return
  }
  if (actionActiveMenu!.id == 'rename') {
    if (!selectEditCodeTemplate.value.templateName) {
      MessageBox.fail(t('code.template-name-empty'))
      return
    }
    const templateName = actionActive.value?.data!.templateName
    if (selectEditCodeTemplate.value.templateName == templateName) {
      MessageBox.fail(t('code.template-name-exists'))
      return
    }
    await checkTemplateNameExists(
      selectEditCodeTemplate.value.templateName,
      selectCodeTemplate.value.id
    ).then(async (res) => {
      if (!res.data) {
        await updateTemplateName(
          selectCodeTemplate.value.id,
          selectEditCodeTemplate.value.templateName
        ).then((result) => {
          if (result.data) {
            MessageBox.ok(t('rename-success'))
            selectCodeTemplate.value.templateName =
              selectEditCodeTemplate.value.templateName
            actionVisabel.value = false
          } else {
            MessageBox.fail(t('rename-fail'))
          }
        })
      } else {
        MessageBox.fail(t('code.template-name-exists'))
      }
    })
  }
  if (actionActiveMenu!.id == 'copyAdd') {
    if (!selectEditCodeTemplate.value.templateName) {
      MessageBox.fail(t('code.template-name-empty'))
      return
    }
    await checkTemplateNameExists(selectEditCodeTemplate.value.templateName).then(
      async (res) => {
        if (!res.data) {
          await copyAddTemplate(
            selectCodeTemplate.value.id,
            selectEditCodeTemplate.value.templateName
          ).then((result) => {
            if (result.data) {
              MessageBox.ok(t('copy-add-success'))
              initTemplateList(true, result.data)
              actionVisabel.value = false
            } else {
              MessageBox.fail(t('copy-add-fail'))
            }
          })
        } else {
          MessageBox.fail(t('code.template-name-exists'))
        }
      }
    )
  }
}
const toPreviewCode = async (
  templateId: string,
  connectionId: string,
  params: CodeGenerationParam[],
  firstRequest: boolean
) => {
  canTriggerWatch.value = false
  const loadingInstance = ElLoading.service({
    target: '.conent',
    lock: true,
  })
  await previewCode(templateId, connectionId, firstRequest, params)
    .then((res) => {
      codeGenerationResult.value = res.data
      generationCodeFlag.value = false
    })
    .finally(() => {
      nextTick(() => {
        loadingInstance.close()
        canTriggerWatch.value = true
      })
    })
}
const refrshClick = debounce((directUseTemplateConfig: boolean) => {
  tpTablsKey.value = Math.random() + 'TB'
  toPreviewCode(
    selectCodeTemplate.value.id,
    selectDbTableData.value.dataSource?.id,
    buildCodeParamsWithTemplate(selectCodeTemplate.value, selectDbTableData.value),
    directUseTemplateConfig
  )
}, 300)

provide(TriggerWatch, canTriggerWatch)
const onChangeConfig = (value: any) => {
  selectCodeTemplate.value = value
  canTriggerWatch.value = false
  initFilterMoreMenuList()
  refrshClick(true)
}
const openCodeDialog = (visible: boolean, title: string) => {
  codeVisible.value = visible
  codeDialogTitle.value = title
  initDefaultGenerationTemplateConfig()
}
const openBasicCOnfigDialog = () => {
  basicConfigVisible.value = true
}
const openTableDDLDialog = () => {
  if (selectDbTableData.value) {
    const dataSource = selectDbTableData.value.dataSource
    const table = selectDbTableData.value.table
    getTableDDL(
      TableDDLParam.mack(
        dataSource.connectionId,
        table?.tableName,
        table?.dataBaseName,
        table?.schemaName
      )
    ).then((res) => {
      tableDDLName.value = t('code.query-table-ddl', [`${table?.tableName}`])
      tableDDL.value = res.data
      tableDDLDialogVisible.value = true
    })
  }
}
const handleTableDDLCopy = async () => {
  if (tableDDL.value && tableDDL.value != '') {
    await window.winApi.copy(tableDDL.value)
    MessageBox.ok(t('copy-success'))
    tableDDLDialogVisible.value = false
  }
}
const cancel = () => {
  codeVisible.value = false
}
const saveGenCode = async () => {
  if (selectedCodeParams.value.length <= 0) {
    MessageBox.fail(t('template-input'))
    return
  }
  const loadingInstance = ElLoading.service({
    target: '.code-result',
    lock: true,
  })
  await generationCode(
    selectCodeTemplate.value.id,
    selectDbTableData.value.dataSource?.id,
    buildCodeParamsWithCache(
      selectCodeTemplate.value,
      selectDbTableData.value,
      selectedCodeParams.value
    ),
    selectedCodeParams.value
  )
    .then((res) => {
      generationCodeFlag.value = true
      codeGenerationResult.value = res.data
    })
    .finally(() => {
      nextTick(() => {
        loadingInstance.close()
      })
    })
}
const handleCheckedAllCodeParamChange = (val: boolean) => {
  let checked = allCodeParams.map((item) => {
    return item.name
  })
  selectedCodeParams.value = val ? checked : []
  isIndeterminate.value = false
}
const handleCheckedCodeParamChange = (_value: string[]) => {
  const checkedCount = _value.length
  checkAllCodePrams.value = checkedCount === allCodeParams.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < allCodeParams.length
}

watch(codeVisible, (nv, _ov) => {
  if (nv == false) {
    codeGenerationResult.value.codeGenerationList = []
  }
})
const selectMoreMenuItem = (item: any) => {
  if (item) {
    selectEditCodeTemplate.value = { ...item.template } as CodeTemplate
    item.menu.command(item)
  }
}
const refrshBasicConfig = (_data: any) => {
  refrshClick(true)
}
const clickReset = () => {
  initDefaultGenerationTemplateConfig()
}
</script>
<template>
  <box-layout layout="column" size="12%" :show-divider="false">
    <template #first>
      <div class="header lable-text">
        <div>
          <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item>{{
              selectDbTableData.dataSource.name
            }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{
              selectDbTableData.table.tableName
            }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div>
          <el-row>
            <el-col :offset="6" :span="10">
              <div class="header-select">
                <div>
                  <!-- <label>：</label> -->
                  {{ $t('code.template') }}：
                </div>
                <el-select
                  :key="selectCTKey"
                  v-model="selectCodeTemplate"
                  :placeholder="$t('code.select-template')"
                  value-key="id"
                  @change="onChangeConfig"
                >
                  <el-option
                    v-for="item in codeTemplateList"
                    :key="item.id"
                    :label="item.templateName"
                    :value="item"
                  >
                    <span style="float: left">{{ item.templateName }} </span>
                    <span v-if="item.isDefault == 1" style="float: right">
                      <el-icon><Star color="#67C23A" /></el-icon>
                    </span>
                  </el-option>
                </el-select>
                <el-dropdown
                  hide-on-click
                  class="more-menu"
                  trigger="click"
                  @command="selectMoreMenuItem"
                >
                  <el-icon><Tools /></el-icon>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        v-for="menuItem of morMenuList"
                        :key="menuItem.id"
                        :icon="menuItem.icon"
                        :command="{ menu: menuItem, template: selectCodeTemplate }"
                      >
                        {{ menuItem.name }}</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </el-col>
            <el-col :offset="1" :span="5" class="col-center">
              <BasicConfig
                v-if="basicConfigVisible == true"
                v-model:is-show="basicConfigVisible"
                :data="basicConfigInfo"
                :code-template-list="allCodeTemplateList"
                @refresh="refrshBasicConfig"
              />
              <el-link class="lable-text" @click.stop="openBasicCOnfigDialog()">{{
                $t('code.global-config')
              }}</el-link>
            </el-col>
          </el-row>
        </div>
        <el-dialog
          v-model="tableDDLDialogVisible"
          top="6vh"
          append-to-body
          :close-on-click-modal="false"
          :title="tableDDLName"
          draggable
          width="60%"
        >
          <Codeview v-model:code="tableDDL" dark></Codeview>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="tableDDLDialogVisible = false">{{
                $t('cancel')
              }}</el-button>
              <el-button type="primary" @click="handleTableDDLCopy">
                {{ $t('confirm-copy') }}
              </el-button>
            </div>
          </template>
        </el-dialog>
        <el-dialog
          v-model="actionVisabel"
          draggable
          width="50%"
          append-to-body
          :title="actionTitle"
          :close-on-click-modal="false"
        >
          <el-input
            v-model="selectEditCodeTemplate.templateName"
            :placeholder="$t('code.template-name-input')"
          />
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="actionVisabel = false">{{ $t('cancel') }}</el-button>
              <el-button type="primary" @click="actionSave()">
                {{ $t('confirm') }}
              </el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </template>
    <div class="conent">
      <el-tabs :key="tpTablsKey" class="template-tabs">
        <el-tab-pane :label="$t('code.tab-pojo')">
          <ModelTemplate
            :data="codeGenerationResult"
            :table-data="selectDbTableData"
          ></ModelTemplate>
        </el-tab-pane>
        <el-tab-pane :label="$t('code.tab-mapper')">
          <MapperTemplate
            :data="codeGenerationResult"
            :table-data="selectDbTableData"
          ></MapperTemplate>
        </el-tab-pane>
        <el-tab-pane :label="$t('code.tab-service')">
          <ServiceTemplate
            :data="codeGenerationResult"
            :table-data="selectDbTableData"
          ></ServiceTemplate>
        </el-tab-pane>
        <el-tab-pane :label="$t('code.tab-controller')">
          <WebTemplate
            :data="codeGenerationResult"
            :table-data="selectDbTableData"
          ></WebTemplate>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="bottom">
      <el-button @click.stop="openTableDDLDialog()">{{ $t('code.query-ddl') }}</el-button>
      <el-button @click.stop="refrshClick(true)">{{ $t('btn-reset') }}</el-button>
      <el-button type="primary" @click.stop="openCodeDialog(true, $t('btn-gen-code'))">{{
        $t('btn-gen-code')
      }}</el-button>
      <el-dialog
        v-model="codeVisible"
        :title="codeDialogTitle"
        width="70%"
        draggable
        append-to-body
        :close-on-click-modal="false"
      >
        <div>
          <el-checkbox
            v-model="checkAllCodePrams"
            :indeterminate="isIndeterminate"
            @change="handleCheckedAllCodeParamChange"
          >
            {{ $t('select-all') }}
          </el-checkbox>
          <el-checkbox-group
            v-model="selectedCodeParams"
            @change="handleCheckedCodeParamChange"
          >
            <el-checkbox
              v-for="param in allCodeParams"
              :key="param.name"
              :label="param.name"
            >
              {{ param.description }}
            </el-checkbox>
          </el-checkbox-group>
          <div class="code-result">
            <el-divider>{{ $t('result') }}</el-divider>
            <CodeResult
              v-if="
                generationCodeFlag == true &&
                codeGenerationResult.codeGenerationList.length > 0
              "
              :data="codeGenerationResult"
            />
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="cancel()">{{ $t('cancel') }}</el-button>
            <el-button @click="clickReset()">{{ $t('reset') }}</el-button>
            <el-button type="primary" @click="saveGenCode()">
              {{
                generationCodeFlag == true &&
                codeGenerationResult.codeGenerationList.length > 0
                  ? $t('btn-agin-code')
                  : $t('confirm')
              }}
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </box-layout>
</template>

<style lang="scss" scoped>
.header {
  width: 100%;
  & > :first-child {
    padding: 0.2rem 0 0.8rem 0.2rem;
  }
  .header-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    & > :first-child {
      width: 180px;
      text-align: right;
    }
    & > :last-child {
      padding-left: 0.2rem;
    }
  }
}
.more-menu {
  &:hover {
    cursor: pointer;
  }
}
.col-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.conent {
  background-color: #fff;
  width: 100%;
  height: 100%;
  padding: 5px;
}
.lable-text {
  color: #ddd;
}
.bottom {
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 10;
}
:deep() {
  .template-tabs {
    .el-tabs__content {
      padding: 10px;
      height: 100%;
    }
  }

  .el-tabs--right .el-tabs__content,
  .el-tabs--left .el-tabs__content {
    height: 100%;
  }
}
</style>
