<script lang="ts" setup>
import {
  VoCodeView,
  TableFieldColumn,
  JavaTypeInfo,
  CodeTemplate,
} from '@/api/code/types'
import { SelectDataTableData } from '@/api/datasource/types'
import { previewCode } from '@/api/code/index'
import { buildCodeParamsWithCodeView } from '@/utils/codeUtil'
import { ElTable } from 'element-plus'
import MessageBox from '@/utils/MessageBox'
const props = defineProps({
  data: {
    type: Object as PropType<VoCodeView>,
    default: {} as VoCodeView,
  },
  showMybatisPuls: {
    type: Boolean,
    default: true,
  },
  javaTypeInfoList: {
    type: Object as PropType<JavaTypeInfo[]>,
    required: false,
  },
  templateInfo: {
    type: Object as PropType<CodeTemplate>,
    required: true,
  },
  tableData: {
    type: Object as PropType<SelectDataTableData>,
    required: true,
  },
})
const voCodeParams = ref<VoCodeView>()
const fieldVisible = ref(false)
const selectTableFieldColumn = ref<TableFieldColumn[]>()
const tableFieldColumnData = ref<TableFieldColumn[]>()
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
watchEffect(() => {
  const codeView = props.data as VoCodeView
  voCodeParams.value = {
    ...codeView,
    toCodeGenerationParam: codeView.toCodeGenerationParam,
    tableFieldColumnMap: codeView.tableFieldColumnMap?.map(
      (item) =>
        ({
          ...item,
          selected: true,
        } as TableFieldColumn)
    ),
  }
})
watch(
  [
    () => voCodeParams.value.useLombok,
    () => voCodeParams.value.useSwagger,
    () => voCodeParams.value.name,
    () => voCodeParams.value.superclassName,
    () => voCodeParams.value.packageName,
  ],
  (_nv, _ov) => {
    if (_nv !== _ov && _ov[0] != undefined) {
      refreshGenCode()
    }
  }
)

const backTableFieldColumn = computed(() => {
  const codeView = props.data as VoCodeView
  return codeView.tableFieldColumnMap?.map(
    (item) =>
      ({
        ...item,
        selected: true,
      } as TableFieldColumn)
  )
})
const refreshGenCode = () => {
  previewCode(
    props.templateInfo.id,
    props.tableData.dataSource?.id,
    buildCodeParamsWithCodeView([voCodeParams.value], props.tableData),
    ['VO']
  ).then((res) => {
    if (res.data.codeGenerationList) {
      voCodeParams.value.templateCode = res.data.codeGenerationList[0].templateCode
    }
  })
}
const clickFieldMap = () => {
  fieldVisible.value = true
  if (voCodeParams.value.tableFieldColumnMap) {
    nextTick(() => {
      if (multipleTableRef.value) {
        multipleTableRef.value.clearSelection()
        tableFieldColumnData.value = voCodeParams.value.tableFieldColumnMap?.map(
          (item) => {
            multipleTableRef.value!.toggleRowSelection(item, item.selected == true)
            return { ...item } as TableFieldColumn
          }
        )
      }
    })
  }
}
const clickSelectChange = (row: TableFieldColumn) => {
  tableFieldColumnData.value?.forEach((v) => {
    if (v.column == row.column) {
      v.javaType = row.javaType
      v.javaTypeSimpleName = TableFieldColumn.getJavaTypeSimpleName(row.javaType)
    }
  })
}
const clickInputChange = (row: TableFieldColumn) => {
  tableFieldColumnData.value?.forEach((v) => {
    if (v.column == row.column) {
      v.property = row.property
    }
  })
}
const clickReset = () => {
  tableFieldColumnData.value = backTableFieldColumn.value.map((item) => {
    multipleTableRef.value!.toggleRowSelection(item, item.selected == true)
    return { ...item } as TableFieldColumn
  })
}
const clickCancel = () => {
  fieldVisible.value = false
}
const clickConfirm = () => {
  if (selectTableFieldColumn.value.length <= 0) {
    MessageBox.fail('请选择字段')
    return
  }
  const valMap = selectTableFieldColumn.value.reduce((m, v) => {
    m.set(v.column, v)
    return m
  }, new Map<String, TableFieldColumn>())
  tableFieldColumnData.value.forEach((v) => {
    v.selected = valMap.has(v.column)
  })
  voCodeParams.value.tableFieldColumnMap = tableFieldColumnData.value
  refreshGenCode()
}
const handleSelectionChange = (val: TableFieldColumn[]) => {
  selectTableFieldColumn.value = val
}
const indexMethod = (index: number) => {
  return index + 1
}
const handleOpenMenu = async () => {
  const filePath = await window.winApi.openDialog({ properties: ['openDirectory'] })
  if (filePath) {
    voCodeParams.value.codePath = filePath
  }
}
</script>
<template>
  <div class="modelBox">
    <div class="left">
      <div>
        <div>类名称:</div>
        <div><el-input v-model="voCodeParams!.name" /></div>
      </div>
      <div>
        <div>包名称:</div>
        <div><el-input v-model="voCodeParams!.packageName" /></div>
      </div>
      <div>
        <div>包路径:</div>
        <div><el-input v-model="voCodeParams!.sourceFolder" /></div>
      </div>
      <div>
        <div>父类:</div>
        <div><el-input v-model="voCodeParams!.superclassName" /></div>
      </div>
      <div>
        <div class="box-lable">代码地址：</div>
        <div class="box-file">
          <el-input v-model="voCodeParams!.codePath">
            <template #append>
              <el-button type="primary" @click="handleOpenMenu">选择地址</el-button>
            </template>
          </el-input>
        </div>
      </div>
      <div>
        <div>
          <el-checkbox v-model="voCodeParams!.useLombok">Lombok</el-checkbox>
          <el-checkbox v-model="voCodeParams!.useSwagger">Swagger</el-checkbox>
          <el-checkbox v-if="showMybatisPuls" v-model="voCodeParams!.useSwagger"
            >Mybatis-puls</el-checkbox
          >
        </div>
      </div>
      <div>
        <el-link type="primary" @click="clickFieldMap">字段映射</el-link>
      </div>
    </div>
    <div class="right">
      <Codeview v-model:code="voCodeParams.templateCode" dark></Codeview>
    </div>
    <el-dialog
      v-model="fieldVisible"
      title="字段映射-Vo"
      draggable
      width="80%"
      append-to-body
      :close-on-click-modal="true"
      :close-on-press-escape="true"
    >
      <el-table
        ref="multipleTableRef"
        max-height="400"
        :data="tableFieldColumnData"
        border
        width="100%"
        row-key="column"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="index" :index="indexMethod" />
        <el-table-column prop="column" label="Column" show-overflow-tooltip />
        <el-table-column prop="jdbcType" label="JdbcType" show-overflow-tooltip />
        <el-table-column prop="property" label="Property" :width="200">
          <template #default="scope">
            <el-input
              v-model="scope.row.property"
              @change="clickInputChange(scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="javaType" label="JavaType" :width="200">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-select
                v-model="scope.row.javaType"
                filterable
                placeholder="Select"
                @change="clickSelectChange(scope.row)"
              >
                <el-option
                  v-for="item in javaTypeInfoList"
                  :key="item.simpleType"
                  :label="item.simpleType"
                  :value="item.type"
                >
                  <span
                    >{{ item.simpleType }}
                    <span style="color: var(--el-text-color-secondary); font-size: 13px"
                      >({{ item.type }})</span
                    ></span
                  >
                </el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="Comment" show-overflow-tooltip />
        <el-table-column type="selection" width="55" :reserve-selection="true" />
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="clickCancel()">取消</el-button>
          <el-button @click="clickReset()">重置</el-button>
          <el-button type="primary" @click="clickConfirm()"> 确认 </el-button>
        </span>
      </template>
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
