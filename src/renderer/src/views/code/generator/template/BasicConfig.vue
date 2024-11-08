<script lang="ts" setup>
import { CodeTemplateBasicConfig, CodeTemplate,ApplyTemplateParam } from '@/api/code/types'
import {
  updateGlobalConfig
} from '@/api/code/index'
import MessageBox from '@/utils/MessageBox'
import {getLicense,LicenseType } from '@/utils/licenseUtil'
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
            label:'Entity | 模型层（POJO）',value:'Entity'
           },
           {
            label:'VO | 模型层（POJO）',value:'VO'
           },
          {
            label:'Mapper | 数据持久层（Mapper）',value:'Mapper'
           },
           {
            label:'Xml(SQL) | 数据持久层（Mapper）',value:'Xml'
           },
          {
            label:'ServiceApi | 业务层（Service）',value:'ServiceApi'
           },
          {
            label:'ServiceImpl | 业务层（Service）',value:'Service'
           },
          {
           label:'接口层（Controller）',value:'Controller'
          }
        ]
      }
    })
    options.value=[{value:0, label:'全部',children: list||[] }]
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
}
const save = async () => {
  if(!basicConfigView.value.codePath || basicConfigView.value.codePath.length<=0){
    MessageBox.fail('默认代码地址不能为空')
    return
  }
  const licenseInfo=basicConfigView.value.license
  if(licenseInfo && licenseInfo!=''){
    if(!licenseInfo.startsWith("/*") || !licenseInfo.endsWith("*/")){
      MessageBox.fail('代码license格式错误格式：/*开头*/结束',4000)
      return
    }
  }
  const applyTempltes=applyTemplteList.value
  if(!applyTempltes || applyTempltes.length<=0){
    MessageBox.fail('请选择应用的模板')
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
    basicConfigView.value.applyTemplateList=[...applyTemplteMap.values()]
   await  updateGlobalConfig(basicConfigView.value).then((res) => {
      if (res) {
        emits('refresh',res)
        MessageBox.ok('更新成功')
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
      MessageBox.ok('复制成功')
    }else{
      MessageBox.fail('license为空')
    }
  }
}
</script>
<template>
  <el-dialog
    v-model="isShow"
    top="8vh"
    draggable
    append-to-body
    title="全局配置"
    width="65%"
    :close-on-click-modal="false"
  >
    <div class="box">
      <div>
        <div class="box-lable">默认代码地址：</div>
        <div class="box-file">
          <el-input v-model="basicConfigView!.codePath" placeholder="默认代码地址">
            <template #append>
              <el-button type="primary" @click="handleOpenMenu">选择地址</el-button>
            </template>
          </el-input>
        </div>
      </div>
      <div>
        <div class="box-lable">代码作者：</div>
        <div>
          <el-input v-model="basicConfigView!.author" placeholder="代码作者" />
        </div>
      </div>
      <div>
        <div class="box-lable">代码license：</div>
        <el-input
          v-model="basicConfigView!.license"
          type="textarea"
          placeholder="代码license，选择标签或自定义，格式：/***/"
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
                <el-link type="info">查看</el-link>
              </template>
            </el-popover>
            <el-link type="primary" @click="handleLicense('copy')">复制</el-link>
            <el-link type="warning" @click="handleLicense('clear')">清空</el-link>
          </div>
        </div>
      </div>
      <div>
        <div class="box-lable">应用模板：</div>
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
        <el-button @click="cancel()">取消</el-button>
        <el-button @click="clickReset()">重置</el-button>
        <el-button type="primary" @click="save()"> 确认 </el-button>
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
