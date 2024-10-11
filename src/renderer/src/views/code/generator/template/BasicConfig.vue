<script lang="ts" setup>
import { CodeTemplateBasicConfig, CodeTemplate,ApplyTemplateParam } from '@/api/code/types'
import {
  updateGlobalConfig
} from '@/api/code/index'
import MessageBox from '@/utils/MessageBox'
const visible = defineModel('visible')
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
const handleChange = (value) => {
  console.log(value)
}
const cancel = () => {
  visible.value = false
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
        MessageBox.ok('更新成功')
      }
    })
}
</script>
<template>
  <el-dialog
    v-model="visible"
    top="8vh"
    draggable
    append-to-body
    title="全局配置"
    width="65%"
  >
    <div class="box">
      <div>
        <div class="box-lable">默认代码地址：</div>
        <div class="box-file">
          <el-input v-model="basicConfigView!.codePath">
            <template #append>
              <el-button type="primary" @click="handleOpenMenu">选择地址</el-button>
            </template>
          </el-input>
        </div>
      </div>
      <div>
        <div class="box-lable">代码作者：</div>
        <div><el-input v-model="basicConfigView!.author" /></div>
      </div>
      <div>
        <div>
          <div class="box-lable">代码license：</div>
          <div>
            <el-tooltip
              :content="basicConfigView.license"
              :disabled="
                basicConfigView.license == undefined ||
                basicConfigView.license.trim().length <= 100
              "
              placement="bottom"
            >
              <el-input v-model="basicConfigView!.license" type="textarea" />
            </el-tooltip>
          </div>
        </div>
      </div>
      <div>
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
}
</style>
