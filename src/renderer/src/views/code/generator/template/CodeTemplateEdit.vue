<template>
  <el-dialog
    v-model="isShow"
    draggable
    append-to-body
    :title="titleText"
    top="6vh"
    :close-on-click-modal="false"
  >
    <el-form :model="template" label-width="auto" style="max-width: 600px">
      <el-form-item v-if="type != 'Xml'" :label="$t('code.superclass-name')">
        <el-input v-model="template!.superclassName" />
      </el-form-item>
      <el-form-item :label="$t('code.package-name')">
        <el-input v-model="template!.packageName" />
      </el-form-item>
      <el-form-item :label="$t('code.source-folder')">
        <el-input v-model="template!.sourceFolder" />
      </el-form-item>
      <el-form-item :label="$t('code.name-suffix')">
        <el-input v-model="template!.nameSuffix" />
      </el-form-item>
      <el-form-item :label="$t('code.path')">
        <el-tooltip
          :content="template!.codePath"
          :disabled="
            template.codePath == undefined || template.codePath.trim().length <= 45
          "
          placement="bottom"
        >
          <el-input v-model="template!.codePath">
            <template #append>
              <el-button type="primary" @click="handleOpenMenu">{{
                $t('code.select-path')
              }}</el-button>
            </template>
          </el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="$t('code.default-gen')">
        <el-switch
          v-model="template!.defaultGenerate"
          :active-value="true"
          :inactive-value="false"
        />
      </el-form-item>
      <el-form-item :label="$t('plugin')">
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
      <el-form-item
        v-if="type == 'Entity' || type == 'VO'"
        :label="$t('code.ignore-fields')"
      >
        <el-input
          v-model="modelFields"
          :placeholder="$t('code.default-ignore-fields')"
        /><span style="color: gray; font-size: small">{{
          $t('code.ignore-fields-rule',['|'])
        }}</span>
      </el-form-item>
      <el-form-item
        v-if="
          ((type == 'Mapper' || type == 'Xml') && !template?.useMybatisPlus) ||
          type == 'Controller'
        "
        :label="$t('code.template-method')"
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
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel()"> {{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="save()"> {{ $t('confirm') }} </el-button>
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
import { getInitApiCodeParams } from '@/utils/codeUtil'
import MessageBox from '@/utils/MessageBox'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const isShow = defineModel('isShow', {
  type: Boolean,
  required: true,
  default: true,
})
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
const isIndeterminate = ref(true)
const checkAllCodePrams = ref(true)
const methodList = ref<string[]>()
const apis = ref([])
const checkedApis = ref([])
const handleCheckedAllCodeParamChange = (val: boolean) => {
  if (apis.value) {
    let checked = apis.value.map((item) => {
      return item
    })
    methodList.value = val ? checked : []
    isIndeterminate.value = false
  }
}
const initChecked = () => {
  if (checkedApis.value) {
    const checkedCount = checkedApis.value.length
    methodList.value = checkedApis.value
    checkAllCodePrams.value = checkedCount === apis.value.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < apis.value.length
  }
}
const handleCheckedCodeParamChange = (_value: string[]) => {
  const checkedCount = _value.length
  checkAllCodePrams.value = checkedCount === apis.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < apis.value.length
}
const getTemplate = async (templateId: string, nameList: String[]) => {
  await getTemplateInfo(templateId, nameList).then((res) => {
    const templateConfigList = res.data.templateConfigList
    if (templateConfigList) {
      const templateConfig = templateConfigList[0]
      apis.value = getInitApiCodeParams(templateConfig.name)
      const tempateParam = templateConfig.templateParams
      checkedApis.value = tempateParam.methodList || []
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
  isShow.value = false
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
  template.value.methodList = methodList.value
  if (!template.value.codePath) {
    MessageBox.fail(t('code.path-empty'))
    return
  }
  // if (!template.value.packageName) {
  //   MessageBox.fail('包名称不能为空')
  //   return
  // }
  // if (!template.value.sourceFolder) {
  //   MessageBox.fail('包路径不能为空')
  //   return
  // }
  await updateCodeGenerationTemplateOfPartition(template.value).then((res) => {
    if (res.data) {
      emits('success', template.value)
      MessageBox.ok(t('update-success'))
    }
  })
}
watchEffect(() => {
  initChecked()
})
</script>
<style lang="scss" scoped>
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
}
</style>
