<script lang="ts" setup>
import { CodeTemplateBasicConfig, CodeTemplate,ApplyTemplateParam } from '@/api/code/types'
import {
  updateGlobalConfig
} from '@/api/code/index'
import MessageBox from '@/utils/MessageBox'
import {getLicense,LicenseType } from '@/utils/licenseUtil'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const isShow = defineModel('isShow', {
  type: Boolean,
  required: true,
  default: true,
})
const props = defineProps({
  data:{
    type: Object as PropType<CodeTemplateBasicConfig>,
    required: true,
  },
  codeTemplateList: {
    type: Array<CodeTemplate>,
    required: true
  },
})
const options=ref()
const includeCodePath=ref(false)
const applyTemplteList=ref<[]>()
const tpProps = { multiple: true }
const basicConfigView = ref<CodeTemplateBasicConfig>()
const handleOpenMenu = async () => {
  const filePath = await window.winApi.openDirDialog()
  if (filePath) {
    basicConfigView.value.codePath = filePath
  }
}
const emits = defineEmits<{
  refresh:[data:any]
}>()
const basicConfigViewBk=ref<CodeTemplateBasicConfig>()
const bk=(tpConfig:CodeTemplateBasicConfig) => {
  if(tpConfig!==undefined && basicConfigViewBk.value==undefined){
    basicConfigViewBk.value={
      codePath:tpConfig.codePath,
      license:tpConfig.license,
      author:tpConfig.author,
    } as CodeTemplateBasicConfig
  }
}
watchEffect(()=>{
  basicConfigView.value=props.data
  bk(basicConfigView.value)
  const codeTemplateList= props.codeTemplateList
  if(codeTemplateList!==undefined && codeTemplateList.length>0){
    const list= codeTemplateList.map((item)=>{
      return {
        value:item.id,
        label: item.templateName,
        children:[
          {
            label:'Entity | '+t('code.tab-pojo'),value:'Entity'
           },
           {
            label:'VO | '+t('code.tab-pojo'),value:'VO'
           },
          {
            label:'Mapper | '+t('code.tab-mapper'),value:'Mapper'
           },
           {
            label:'Xml(SQL) | '+t('code.tab-mapper'),value:'Xml'
           },
          {
            label:'ServiceApi | '+t('code.tab-service'),value:'ServiceApi'
           },
          {
            label:'ServiceImpl | '+t('code.tab-service'),value:'Service'
           },
          {
           label:t('code.tab-controller'),value:'Controller'
          }
        ]
      }
    })
    options.value=[{value:0, label:t('select-all'),children: list||[] }]
  }
})
const handleChange = (_value) => {
  // console.log(value)
}
const cancel = () => {
  isShow.value = false
}
const clickReset = () => {
  basicConfigView.value.codePath=basicConfigViewBk.value.codePath
  basicConfigView.value.author=basicConfigViewBk.value.author
  basicConfigView.value.license=basicConfigViewBk.value.license
  applyTemplteList.value=[]
  includeCodePath.value=false
}
const save = async () => {
  const licenseInfo=basicConfigView.value.license
  if(licenseInfo && licenseInfo!=''){
    if(!licenseInfo.startsWith("/*") || !licenseInfo.endsWith("*/")){
      MessageBox.fail(t('code.license-msg'),4000)
      return
    }
  }
  let codePath=null
  if(includeCodePath.value){
    codePath=basicConfigView.value.codePath;
    if(!codePath || codePath.length<=0){
    MessageBox.fail(t('code.default-path-empty'))
    return
    }
  }
  const applyTempltes=applyTemplteList.value
  if(!applyTempltes || applyTempltes.length<=0){
    MessageBox.fail(t('code.template-select'))
    return
  }
  const applyTemplteMap =applyTempltes.reduce((result,item)=>{
    const templateId=item[1]
    const templateCodeType=item[2]
    if(result.has(templateId)){
      const atp=result.get(templateId)
      if(atp.codeTypeList){
        atp.codeTypeList.push(templateCodeType)
      }
    }else{
      result.set(templateId,ApplyTemplateParam.mack(templateId,[templateCodeType]))
    }
    return result
  },new Map<string,ApplyTemplateParam>())
  const {author,license}=reactive(basicConfigView.value)
    const param={author,license,codePath} as CodeTemplateBasicConfig
    param.applyTemplateList=[...applyTemplteMap.values()]
   await  updateGlobalConfig(param).then((res) => {
      if (res) {
        emits('refresh',res)
        MessageBox.ok(t('update-success'))
      }
    })
}
const selectLicense=(type:LicenseType)=>{
  const licenseInfo=getLicense(type)
  basicConfigView.value.license=licenseInfo?.info
}
const handleLicense=async (type:string)=>{
  if(type=='clear'){
    basicConfigView.value.license=null
  }else{
    const license=basicConfigView.value.license
    if(license){
      await window.winApi.copy(license)
      MessageBox.ok(t('copy-success'))
    }else{
      MessageBox.fail(t('is-empty',['license']))
    }
  }
}
</script>
<template>
  <el-dialog
    v-model="isShow"
    top="6vh"
    draggable
    append-to-body
    :title="$t('code.global-config')"
    width="65%"
    :close-on-click-modal="false"
  >
    <div class="box">
      <div>
        <div class="box-lable">{{ $t('code.author') }}：</div>
        <div>
          <el-input v-model="basicConfigView!.author" placeholder="代码作者" />
        </div>
      </div>
      <div>
        <div class="box-lable">{{ $t('code.license') }}：</div>
        <el-input
          v-model="basicConfigView!.license"
          type="textarea"
          :placeholder="$t('code.license-placeholder')"
        />
        <div class="box-tag">
          <div class="flex gap-2">
            <el-check-tag
              :checked="true"
              type="primary"
              @click="selectLicense(LicenseType.Apache2)"
              >Apache2.0</el-check-tag
            >
            <el-check-tag
              :checked="true"
              type="success"
              @click="selectLicense(LicenseType.MIT)"
              >MIT</el-check-tag
            >
          </div>
          <div
            v-if="
              basicConfigView.license != undefined &&
              basicConfigView.license.trim().length > 0
            "
            class="flex gap-2"
          >
            <el-popover
              v-if="basicConfigView.license.trim().length > 100"
              placement="left"
              trigger="hover"
              effect="dark"
              :width="400"
              :content="basicConfigView.license"
            >
              <template #reference>
                <el-link type="info">{{ $t('search') }}</el-link>
              </template>
            </el-popover>
            <el-link type="primary" @click="handleLicense('copy')">{{
              $t('copy')
            }}</el-link>
            <el-link type="warning" @click="handleLicense('clear')">{{
              $t('clean')
            }}</el-link>
          </div>
        </div>
      </div>
      <div>
        <div class="box-lable">
          {{ $t('code.path') }}：
          <el-switch v-model="includeCodePath" inline-prompt />
        </div>
        <div class="box-file">
          <el-input
            v-model="basicConfigView!.codePath"
            :disabled="!includeCodePath"
            :placeholder="$t('code.default-path')"
          >
            <template #append>
              <el-button
                :disabled="!includeCodePath"
                type="primary"
                @click="handleOpenMenu"
                >{{ $t('code.select-path') }}</el-button
              >
            </template>
          </el-input>
        </div>
      </div>
      <div>
        <div class="box-lable">{{ $t('code.use-template') }}：</div>
        <div>
          <el-cascader-panel
            v-model="applyTemplteList"
            :props="tpProps"
            :options="options"
            @change="handleChange"
          >
            <template #default="scope">
              <el-tooltip
                :content="scope.data.label"
                :disabled="
                  scope.data.label == undefined || scope.data.label.trim().length <= 20
                "
                placement="bottom"
              >
                {{ scope.data.label }}</el-tooltip
              >
            </template>
          </el-cascader-panel>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel()">{{ $t('cancel') }}</el-button>
        <el-button @click="clickReset()">{{ $t('reset') }}</el-button>
        <el-button type="primary" @click="save()"> {{ $t('confirm') }} </el-button>
      </span>
    </template>
  </el-dialog>
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
  .box-lable {
    font-weight: 600;
    margin-top: 10px;
  }
  .box-tag {
    margin-top: 0.2rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
