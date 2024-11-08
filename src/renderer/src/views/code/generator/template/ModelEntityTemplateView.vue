<script lang="ts" setup>
import {
  EntityCodeView,
  TableFieldColumn,
  JavaTypeInfo,
  CodeTemplate,
  PartitionTempate,
} from '@/api/code/types'
import { SelectDataTableData, TableFieldColumnParam } from '@/api/datasource/types'
import { getTemplateTableFieldColumnList } from '@/api/code/index'
import { ElTable } from 'element-plus'
import { PropType } from 'vue'
import { previewCode } from '@/api/code/index'
import { buildCodeParamsWithCodeView } from '@/utils/codeUtil'
import MessageBox from '@/utils/MessageBox'
import CodeTemplateEdit from './CodeTemplateEdit.vue'
import { TriggerWatch } from '../../keys'
import { debounce } from 'lodash-es'
const props = defineProps({
  data: {
    type: Object as PropType<EntityCodeView>,
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
const canTriggerWatch = inject(TriggerWatch) as Ref
const selectTableFieldColumn = ref<TableFieldColumn[]>()
const tableFieldColumnData = ref<TableFieldColumn[]>()
const entityCodeParams = ref<EntityCodeView>()
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const fieldVisible = ref(false)
const templateEditVisible = ref(false)
const templateId = ref('')
const refreshFieldColumn = (
  callback?: (tableFieldColumns: TableFieldColumn[]) => void
) => {
  if (props.tableData && props.templateInfo) {
    getTemplateTableFieldColumnList(
      props.templateInfo.id,
      entityCodeParams.value.codeType,
      TableFieldColumnParam.mack(
        props.tableData.dataSource.id,
        props.tableData.table.tableName,
        props.tableData.table.dataBaseName,
        props.tableData.table.schemaName
      )
    ).then((res) => {
      if (res.data) {
        tableFieldColumnData.value = res.data
        if (typeof callback == 'function') {
          callback(res.data)
        }
      }
    })
  }
}
watchEffect(() => {
  entityCodeParams.value = props.data
  templateId.value = props.templateInfo ? props.templateInfo!.id : ''
  tableFieldColumnData.value = props.data!.tableFieldColumnMap
})
watch(
  [
    () => entityCodeParams.value.name,
    () => entityCodeParams.value.useLombok,
    () => entityCodeParams.value.codePath,
    () => entityCodeParams.value.nameSuffix,
    () => entityCodeParams.value.useMybatisPlus,
    () => entityCodeParams.value.useSwagger,
    () => entityCodeParams.value.sourceFolder,
    () => entityCodeParams.value.codeOutPath,
    () => entityCodeParams.value.superclassName,
    () => entityCodeParams.value.packageName,
    () => entityCodeParams.value.tableFieldColumnMap,
  ],
  (_nv, _ov) => {
    // canTriggerWatch.value =
    //   canTriggerWatch.value == false ? _ov[0] != undefined : canTriggerWatch.value
    if (canTriggerWatch!.value == true && _nv !== _ov && _ov[0] != undefined) {
      refreshGenCode(false)
    }
  }
)
const clickFieldMap = () => {
  fieldVisible.value = true
  nextTick(() => {
    multipleTableRef.value.clearSelection()
    tableFieldColumnData.value?.forEach((item) => {
      multipleTableRef.value!.toggleRowSelection(item, item.selected)
    })
  })
}
const editTemlateSuccess = (template: PartitionTempate) => {
  refreshFieldColumn((tableFieldColumns) => {
    entityCodeParams.value = Object.assign(entityCodeParams.value, {
      ...template,
      name: entityCodeParams.value.name,
    })
    entityCodeParams.value.tableFieldColumnMap = tableFieldColumns
    entityCodeParams.value.name = null
  })
}
const refreshGenCode = debounce((directUseTemplateConfig: boolean) => {
  previewCode(
    props.templateInfo.id,
    props.tableData.dataSource?.id,
    directUseTemplateConfig,
    buildCodeParamsWithCodeView([entityCodeParams.value], props.tableData),
    ['Entity']
  ).then((res) => {
    if (res.data.codeGenerationList) {
      EntityCodeView.replace(res.data.codeGenerationList[0], entityCodeParams.value)
    }
  })
}, 300)
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
  refreshFieldColumn((tableFieldColumns) => {
    multipleTableRef.value.clearSelection()
    tableFieldColumns.forEach((item) => {
      multipleTableRef.value!.toggleRowSelection(item, item.selected)
    })
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
  entityCodeParams.value.tableFieldColumnMap = tableFieldColumnData.value
  clickCancel()
  refreshGenCode(false)
}
const handleSelectionChange = (val: TableFieldColumn[]) => {
  selectTableFieldColumn.value = val
}
const indexMethod = (index: number) => {
  return index + 1
}
const handleOpenMenu = async () => {
  const filePath = await window.winApi.openDirDialog()
  if (filePath) {
    entityCodeParams.value.codePath = filePath
  }
}
const toEditTemplate = () => {
  templateEditVisible.value = true
}
</script>
<template>
  <div class="modelBox">
    <div class="left">
      <div style="text-align: right">
        <el-link type="primary" @click="toEditTemplate()">编辑模板</el-link>
        <CodeTemplateEdit
          v-if="templateEditVisible"
          v-model:is-show="templateEditVisible"
          :template-id="templateId"
          title="Entity模板"
          type="Entity"
          @success="editTemlateSuccess"
        ></CodeTemplateEdit>
      </div>
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
          <el-tooltip
            :content="entityCodeParams!.codePath"
            :disabled="
              entityCodeParams.codePath == undefined ||
              entityCodeParams.codePath.trim().length <= 0
            "
            placement="bottom"
          >
            <el-input v-model="entityCodeParams!.codePath">
              <template #append>
                <el-button type="primary" @click="handleOpenMenu">选择地址</el-button>
              </template>
            </el-input>
          </el-tooltip>
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
        <el-link type="primary" @click="clickFieldMap()">字段映射</el-link>
      </div>
    </div>
    <div class="right">
      <Codeview v-model:code="entityCodeParams.templateCode" dark></Codeview>
    </div>
    <el-dialog
      v-model="fieldVisible"
      title="字段映射-Entity"
      draggable
      width="80%"
      append-to-body
      :close-on-click-modal="false"
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
