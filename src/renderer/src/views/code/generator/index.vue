<script lang="ts" setup>
import { SelectDataTableData } from '@/api/datasource/types'
import { CodeTemplate, CodeGenerationParam, CodeGenerationResult } from '@/api/code/types'
import { listTemplateConfig, previewCode } from '@/api/code/index'
import { SelectDbable } from '../keys'
import { ArrowRight } from '@element-plus/icons-vue'
import BasicConfig from './template/BasicConfig.vue'
import ModelTemplate from './template/ModelTemplate.vue'
import ServiceTemplate from './template/ServiceTemplate.vue'
import WebTemplate from './template/WebTemplate.vue'
import MapperTemplate from './template/MapperTemplate.vue'
import { buildCodeParams } from '@/utils/codeUtil'
const selectDbTableData = inject(SelectDbable) as Ref<SelectDataTableData>
const selectCodeTemplate = ref<CodeTemplate>()
const codeTemplateList = ref<CodeTemplate[]>()
const codeVisible = ref(false)
const codeDialogTitle = ref('')
const showBasicConfig = ref(false)
const codeGenerationResult = ref<CodeGenerationResult>()
const toPreviewCode = async (templateId: string, params: CodeGenerationParam[]) => {
  console.log('有效的模板ID', templateId, '预览代码参数：', params)
  await previewCode(templateId, params).then((res) => {
    console.log('toPreviewCode:', res)
    codeGenerationResult.value = res.data
  })
}
onMounted(async () => {
  await listTemplateConfig({ language: 'java', needParseTemplate: true }).then((res) => {
    if (res.data) {
      const list = res.data
      codeTemplateList.value = list
      const template = list.filter((item) => item.isDefault === 1)[0] || list[0]
      selectCodeTemplate.value = template
      toPreviewCode(template.id, buildCodeParams(template, selectDbTableData.value))
    }
  })
})

//选择不同的模板配置
const onChangeConfig = (value: any) => {
  console.log('---onChangeConfig', value)
  selectCodeTemplate.value = value
  // toPreviewCode(
  //   selectCodeTemplate.value.id,
  //   CodeGenerationParam.mack(selectDbTableData, selectCodeTemplate.value)
  // )
}
const openCodeDialog = (visible: boolean, title: string, isShowBasicConfig?: boolean) => {
  codeVisible.value = visible
  showBasicConfig.value = isShowBasicConfig
  codeDialogTitle.value = title
}
const cancel = () => {
  codeVisible.value = false
}
const save = (_isShowBasicConfig?: boolean) => {
  // codeVisible.value = isShowBasicConfig
}
watch(codeVisible, (nv, ov) => {
  if (nv !== true && ov == true) {
    showBasicConfig.value = false
  }
})
</script>
<template>
  <box-layout layout="coloum" size="12%" :show-divider="false">
    <template #first>
      <div class="header">
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
        <div class="config">
          <div class="config-select">
            <label>模板配置：</label>
            <el-select
              v-model="selectCodeTemplate"
              placeholder="选择配置"
              value-key="id"
              @change="onChangeConfig"
            >
              <el-option
                v-for="item in codeTemplateList"
                :key="item.id"
                :label="item.templateName"
                :value="item"
              >
                <span style="float: left">{{ item.templateName }}</span>
                <span
                  style="
                    float: right;
                    color: var(--el-text-color-secondary);
                    font-size: 13px;
                  "
                  >{{ item.isInternal === 1 ? 'default' : '' }}</span
                >
              </el-option>
            </el-select>
          </div>
          <el-link @click="openCodeDialog(true, '基本配置', true)">基本配置</el-link>
        </div>
      </div>
    </template>
    <div class="conent">
      <el-tabs class="template-tabs">
        <el-tab-pane label="模型层（POJO）">
          <ModelTemplate :data="codeGenerationResult" :table-data="selectDbTableData" />
        </el-tab-pane>
        <el-tab-pane label="数据持久层（Mapper）">
          <MapperTemplate :data="codeGenerationResult"></MapperTemplate>
        </el-tab-pane>
        <el-tab-pane label="业务层（Service）">
          <ServiceTemplate :data="codeGenerationResult"></ServiceTemplate>
        </el-tab-pane>
        <el-tab-pane label="接口层（Controller）">
          <WebTemplate :data="codeGenerationResult"></WebTemplate>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="bottom">
      <el-button>保存模板</el-button>
      <el-button type="primary" @click="openCodeDialog(true, '生成代码', false)"
        >生成代码</el-button
      >
      <el-dialog
        v-model="codeVisible"
        :title="codeDialogTitle"
        draggable
        :close-on-click-modal="true"
        :close-on-press-escape="true"
      >
        <BasicConfig v-if="showBasicConfig == true" :data="selectCodeTemplate" />
        <div v-else>
          <el-checkbox :checked="true" label="模型层（Entity）" />
          <el-checkbox :checked="true" label="模型层（VO）" />
          <el-checkbox :checked="true" label="数据持久层（Mapper）" />
          <el-checkbox :checked="true" label="数据持久层（XML）" />
          <el-checkbox :checked="true" label="业务层（Service）" />
          <el-checkbox :checked="true" label="接口层（Controller）" />
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="cancel()">取消</el-button>
            <el-button type="primary" @click="save(showBasicConfig)"> 确认 </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </box-layout>
</template>

<style lang="scss" scoped>
.header {
  padding: 4px;
  color: #fff;
  display: flex;
  flex-direction: column;
  width: 100%;
  .config {
    justify-content: center;
    flex-grow: 1;
    display: flex;
    align-items: center;
    .config-select {
      margin-right: 1rem;
    }
  }
}

.conent {
  background-color: #fff;
  width: 100%;
  height: 100%;
  padding: 5px;
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
      // color: #6b778c;
      // font-size: 32px;
      // font-weight: 600;
      // background-color: red;
      height: 100%;
    }
  }

  .el-tabs--right .el-tabs__content,
  .el-tabs--left .el-tabs__content {
    height: 100%;
  }
}
</style>
