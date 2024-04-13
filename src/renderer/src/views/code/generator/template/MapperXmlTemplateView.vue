<script lang="ts" setup>
// import { CodeTemplateConfig, TemplateConfig } from '@/api/code/types'
import { XmlCodeView } from '@/api/code/types'
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
})
const xmlCodeView = ref(props.data)
const handleOpenMenu = async () => {
  const filePath = await window.winApi.openDialog({ properties: ['openDirectory'] })
  if (filePath) {
    xmlCodeView.value.codePath = filePath
  }
}
</script>
<template>
  <div class="modelBox">
    <div class="left">
      <div>
        <div>文件名称:</div>
        <div><el-input v-model="xmlCodeView!.name" /></div>
      </div>
      <div>
        <div>包名称:</div>
        <div><el-input v-model="xmlCodeView!.packageName" /></div>
      </div>
      <div>
        <div>包路径:</div>
        <div><el-input v-model="xmlCodeView!.sourceFolder" /></div>
      </div>
      <div>
        <div>Mapper空间:</div>
        <div><el-input v-model="xmlCodeView!.namespace" /></div>
      </div>
      <div>
        <div class="box-lable">代码地址：</div>
        <div class="box-file">
          <el-input v-model="xmlCodeView!.codePath">
            <template #append>
              <el-button type="primary" @click="handleOpenMenu">选择地址</el-button>
            </template>
          </el-input>
        </div>
      </div>
      <div>
        <div class="method-list">
          <el-checkbox :checked="true" label="insert" />
          <el-checkbox :checked="true" label="update" />
          <el-checkbox :checked="true" label="insertOrUpdate" />
          <!-- <el-checkbox :checked="true" label="selectList" /> -->
        </div>
        <div class="method-list">
          <el-checkbox :checked="true" label="insertOrUpdate" />
          <!-- <el-checkbox :checked="true" label="selectList" /> -->
        </div>
      </div>
    </div>
    <div class="right">
      <Codeview v-model:code="xmlCodeView.templateCode" dark></Codeview>
    </div>
  </div>
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
