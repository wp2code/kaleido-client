<script lang="ts" setup>
import { CodeTemplateConfig, TemplateConfig } from '@/api/code/types'
const props = defineProps({
  config: {
    type: Object as PropType<CodeTemplateConfig>,
    default: {} as CodeTemplateConfig,
  },
  modelFields: {
    type: Array,
    default: () => [],
  },
  showMybatisPuls: {
    type: Boolean,
    default: true,
  },
})
const templateParams = ref(props.config!.templateParams || ({} as TemplateConfig))
const fieldVisible = ref(false)
const handleOpenMenu = async () => {
  const filePath = await window.winApi.openDialog({ properties: ['openDirectory'] })
  if (filePath) {
    templateParams.value.codePath = filePath
  }
}
</script>
<template>
  <div class="modelBox">
    <div class="left">
      <div>
        <div>类名称:</div>
        <div><el-input v-model="templateParams!.name" /></div>
      </div>
      <div>
        <div>包名称:</div>
        <div><el-input v-model="templateParams!.packageName" /></div>
      </div>
      <div>
        <div>包路径:</div>
        <div><el-input v-model="templateParams!.sourceFolder" /></div>
      </div>
      <div>
        <div>父类:</div>
        <div><el-input v-model="templateParams!.superclass" /></div>
      </div>
      <div>
        <div class="box-lable">代码地址：</div>
        <div class="box-file">
          <el-input v-model="templateParams!.codePath">
            <template #append>
              <el-button type="primary" @click="handleOpenMenu">选择地址</el-button>
            </template>
          </el-input>
        </div>
      </div>
      <div>
        <div>
          <el-checkbox v-model="templateParams!.lombok">Lombok</el-checkbox>
          <el-checkbox v-model="templateParams!.swagger">Swagger</el-checkbox>
          <el-checkbox v-if="showMybatisPuls" v-model="templateParams!.mybatisPuls"
            >Mybatis-puls</el-checkbox
          >
        </div>
      </div>
      <div>
        <el-link type="primary" @click="fieldVisible = true">字段映射</el-link>
      </div>
    </div>
    <div class="right">代码预览</div>
    <el-dialog
      v-model="fieldVisible"
      title="字段映射"
      draggable
      :close-on-click-modal="true"
      :close-on-press-escape="true"
    >
      <el-table :data="modelFields" border style="width: 100%">
        <el-table-column prop="column" label="Column" />
        <el-table-column prop="jdbcType" label="JdbcType" />
        <el-table-column prop="property" label="Property" />
        <el-table-column prop="javaType" label="JavaType" />
      </el-table>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.modelBox {
  display: flex;
  flex-direction: row;
  max-width: 70vw;
  .left {
    padding: 1vh;
    div {
      padding: 0.1rem;
    }
  }

  .right {
    border: 1px solid #6b778c;
    flex-grow: 1;
  }
  .fieldDiv {
    max-width: 70vw;
    padding: 0.1rem;
  }
}
</style>
