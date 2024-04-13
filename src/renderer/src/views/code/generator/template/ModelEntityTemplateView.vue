<script lang="ts" setup>
import { EntityCodeView, TableFieldColumn } from '@/api/code/types'
const props = defineProps({
  data: {
    type: Object as PropType<EntityCodeView>,
    default: {} as EntityCodeView,
  },
  showMybatisPuls: {
    type: Boolean,
    default: true,
  },
})
const tableFieldColumnMap = ref<TableFieldColumn[]>(props.data?.tableFieldColumnMap)
const entityCodeParams = ref(props.data)
const fieldVisible = ref(false)
const handleOpenMenu = async () => {
  const filePath = await window.winApi.openDialog({ properties: ['openDirectory'] })
  if (filePath) {
    entityCodeParams.value.codePath = filePath
  }
}
</script>
<template>
  <div class="modelBox">
    <div class="left">
      <div>
        <div>类名称:</div>
        <div><el-input v-model="entityCodeParams!.name" /></div>
      </div>
      <div>
        <div>包名称:</div>
        <div><el-input v-model="entityCodeParams!.packageName" /></div>
      </div>
      <div>
        <div>包路径:</div>
        <div><el-input v-model="entityCodeParams!.sourceFolder" /></div>
      </div>
      <div>
        <div>父类:</div>
        <div><el-input v-model="entityCodeParams!.superclassName" /></div>
      </div>
      <div>
        <div class="box-lable">代码地址：</div>
        <div class="box-file">
          <el-input v-model="entityCodeParams!.codePath">
            <template #append>
              <el-button type="primary" @click="handleOpenMenu">选择地址</el-button>
            </template>
          </el-input>
        </div>
      </div>
      <div>
        <div>
          <el-checkbox v-model="entityCodeParams!.useLombok">Lombok</el-checkbox>
          <el-checkbox v-model="entityCodeParams!.useSwagger">Swagger</el-checkbox>
          <el-checkbox v-if="showMybatisPuls" v-model="entityCodeParams!.useMybatisPlus"
            >Mybatis-puls</el-checkbox
          >
        </div>
      </div>
      <div>
        <el-link type="primary" @click="fieldVisible = true">字段映射</el-link>
      </div>
    </div>
    <div class="right">
      <Codeview v-model:code="entityCodeParams.templateCode" dark></Codeview>
    </div>
    <el-dialog
      v-model="fieldVisible"
      title="字段映射"
      draggable
      :close-on-click-modal="true"
      :close-on-press-escape="true"
    >
      <el-table :data="tableFieldColumnMap" border style="width: 100%">
        <el-table-column prop="column" label="Column" />
        <el-table-column prop="jdbcType" label="JdbcType" />
        <el-table-column prop="property" label="Property" />
        <el-table-column prop="javaType" label="JavaType" />
      </el-table>
    </el-dialog>
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
