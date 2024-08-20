<template>
  <el-dialog v-model="visible" draggable append-to-body :title="titleText">
    <el-form :model="template" label-width="auto" style="max-width: 600px">
      <el-form-item v-if="type != 'Xml'" label="父类">
        <el-input v-model="template!.superclassName" />
      </el-form-item>
      <el-form-item label="包名称">
        <el-input v-model="template!.packageName" />
      </el-form-item>
      <el-form-item label="包路径">
        <el-input v-model="template!.sourceFolder" />
      </el-form-item>
      <el-form-item label="代码地址">
        <el-tooltip
          :content="template!.codePath"
          :disabled="
            template.codePath == undefined || template.codePath.trim().length <= 45
          "
          placement="bottom"
        >
          <el-input v-model="template!.codePath">
            <template #append>
              <el-button type="primary" @click="handleOpenMenu">选择地址</el-button>
            </template>
          </el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="插件">
        <el-checkbox v-if="type != 'VO'" v-model="template!.useMybatisPlus"
          >Mybatis-puls</el-checkbox
        >
        <el-checkbox v-if="type == 'Entity' || type == 'VO'" v-model="template!.useLombok"
          >Lombok</el-checkbox
        >
        <el-checkbox
          v-if="type == 'Entity' || type == 'VO' || type == 'Controller'"
          v-model="template!.useSwagger"
          >Swagger</el-checkbox
        >
      </el-form-item>
      <el-form-item v-if="type == 'Entity' || type == 'VO'" label="过滤字段">
        <el-input v-model="modelFields" placeholder="默认不生成字段" /><span
          style="color: gray; font-size: small"
          >多个用|分割</span
        >
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="save()"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import {
  getTemplateInfo,
  updateCodeGenerationTemplateOfPartition,
} from '@/api/code/index'
import { PartitionTempate } from '@/api/code/types'
import MessageBox from '@/utils/MessageBox'
const visible = defineModel('visible')
const emits = defineEmits<{
  success: [template: PartitionTempate]
}>()
const props = defineProps<{
  title?: string
  width?: string
  templateId: string
  type: string
}>()
const template = ref<PartitionTempate>(new PartitionTempate())
const modelFields = ref(null)
const getTemplate = async (templateId: string, nameList: String[]) => {
  await getTemplateInfo(templateId, nameList).then((res) => {
    const templateConfigList = res.data.templateConfigList
    if (templateConfigList) {
      const templateConfig = templateConfigList[0]
      const tempateParam = templateConfig.templateParams
      template.value = {
        templateId: res.data.id,
        codePath: templateConfig.codePath,
        templateName: res.data.templateName,
        ...tempateParam,
        superclassName: tempateParam.superclass ? tempateParam.superclass.name : null,
      } as PartitionTempate
      const defaultIgFields = tempateParam.defaultIgFields
      if (defaultIgFields !== undefined && defaultIgFields.length > 0) {
        modelFields.value = defaultIgFields.join('|')
      }
    }
  })
}
onMounted(() => {
  if (props.templateId) {
    getTemplate(props.templateId, [props.type])
  }
})
const titleText = computed(() => {
  return template.value.templateName + '(' + props.title + ')'
})
const handleOpenMenu = async () => {
  const filePath = await window.winApi.openDirDialog()
  if (filePath) {
    template.value.codePath = filePath
  }
}
const cancel = () => {
  visible.value = false
}
const save = async () => {
  if (modelFields.value && modelFields.value.length > 0) {
    template.value.defaultIgFields = modelFields.value
      .split('|')
      .map((item) => item.trim())
      .filter((item) => item !== undefined && item.length > 0 && item !== '|')
  } else {
    template.value.defaultIgFields = []
  }
  await updateCodeGenerationTemplateOfPartition(template.value).then((res) => {
    if (res.data) {
      emits('success', template.value)
      MessageBox.ok('更新成功')
    }
  })
}
</script>
<style lang="scss" scoped>
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
}
</style>
