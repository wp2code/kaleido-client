<script lang="ts" setup>
import {
  openConnectDataSource,
  openDataBase,
  getDataSourceByConnectionId,
  getTableDDL,
  closeOtherConnectDataSource
} from '@/api/datasource/index'
import {
  Schema,
  Table,
  Database,
  SimpleDatabase,
  TableDDLParam,
} from '@/api/datasource/types'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { Close, Search } from '@element-plus/icons-vue'
import { ElTree, ElLoading } from 'element-plus'
import { type MenuInfoType,type IMenuItemType } from '@/directive/contextmenu/type'
import MessageBox from '@/utils/MessageBox'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const emits = defineEmits(['select'])
interface Tree {
  id: string
  label: string
  data: Table | Schema | Database | SimpleDatabase
  connectionId?: string
  children?: Tree[]
  isDb?: boolean
  isTable?: boolean
  leaf: boolean
  disabled?: string
  iconColor?: string
}
const treeProps = {
  value: 'id',
  label: 'label',
  children: 'children',
  isLeaf: 'leaf',
}
const props = defineProps({
  data: {
    type: Object,
    default: {} as Table,
  },
})
const datasourceId = ref(props.data?.id)
const dataSourceMetaTree = ref<Tree[]>([])
const serachSwitch = ref<Boolean>(false)
const query = ref<string>()
const tableTreeRef = ref<InstanceType<typeof ElTree>>()
const serachRef = ref(null)
const tableDDLName=ref()
const tableDDL = ref()
const tableDDLDialogVisible = ref(false)
const tableContextmenuRef = ref()
const openConnection = (id: string) => {
  if (!id) {
    return
  }
  const loadingInstance = ElLoading.service({
    target: '.table-box',
    lock: true,
    background: '#1f2d3d',
  })
  openConnectDataSource(id)
    .then((res) => {
      const data = res.data
      if (data) {
        //关闭其它连接
        closeOtherConnectDataSource(data.connectionId)
        const treeData = data.databases.map((item) => {
          return {
            id: item.dataBaseName,
            label: item.dataBaseName,
            data: item,
            isDb: true,
            leaf: false,
            isTable: false,
            connectionId: data.connectionId,
            children: [],
          }
        })
        dataSourceMetaTree.value = treeData
      }
    })
    .finally(() => {
      nextTick(() => {
        loadingInstance.close()
      })
    })
}
const clickSelectTable = async (tree: Tree) => {
  if (tree.leaf) {
    await getDataSourceByConnectionId(tree.connectionId).then((res) => {
      if (res.data) {
        res.data.connectionId=tree.connectionId
        emits('select', tree.data as Table, res.data)
      }
    })
  }
}
const onSerachSwitch = (_isOpen: Boolean) => {
  serachSwitch.value = _isOpen
  if (_isOpen) {
    nextTick(() => {
      serachRef.value.focus()
    })
  }
}
const onSerach = (value: string) => {
  tableTreeRef.value!.filter(value)
}
const refreshTable = (id: string) => {
  openConnection(id)
}
const selectLoadNode = (node: Node, resolve: (data: Tree[]) => void) => {
  const data = toRaw(node.data)
  if (node.level == 0) {
    return resolve(dataSourceMetaTree.value)
  }
  if (node.level == 1) {
    const databaseParam=data.data as SimpleDatabase
    openDataBase(data.connectionId, databaseParam.dataBaseName).then(
      (res) => {
        if (res.data) {
          const database = res.data as Database
          if (database.supportSchema) {
            resolve(
              database.schemaList?.map((item) => {
                return {
                  id: item.schemaName,
                  label: item.schemaName,
                  data: item,
                  leaf: false,
                  isDb: false,
                  isTable: false,
                  connectionId: data.connectionId,
                  children: [],
                }
              })
            )
          } else {
            if (database.tableList) {
              resolve(
                database.tableList?.map((item) => {
                  return {
                    id: item.tableName,
                    label: item.tableName,
                    data: item,
                    leaf: true,
                    isDb: false,
                    isTable: true,
                    connectionId: data.connectionId,
                    children: [],
                  }
                })
              )
            } else {
              resolve([])
            }
          }
        }
      }
    )
  }
  if (node.level == 2) {
    const tableList = data.data?.tableList
    if (tableList) {
      resolve(
        tableList.map((item) => {
          return {
            id: item.tableName,
            label: item.tableName,
            data: item,
            leaf: true,
            isDb: false,
            isTable: true,
            connectionId: data.connectionId,
            children: [],
          }
        })
      )
    } else {
      resolve([])
    }
  }
}
const filterTable = (value: string, data: Tree) => {
  if (!value) return true
  return data.label.includes(value)
}
onMounted(() => {
  if (props.data.id) {
    openConnection(props.data.id)
    datasourceId.value = props.data.id
  }
})
watchPostEffect(() => {
  if(serachSwitch.value){
    onSerach(query.value)
  }
})
const onNodeExpand = (tree: Tree, _node: Node, _self: any) => {
  tree.iconColor = '#67C23A'
}
const tableContextmenuInfo = ref<MenuInfoType>({
  items: [{ icon:'ddl', lable:t('code.query-ddl'),onclick:(_e,data)=>{
    getDDLMetaInfo(data)
  }
  } as IMenuItemType],
} as MenuInfoType)
const getDDLMetaInfo = (selectNode?:Node) => {
  if (selectNode && selectNode.data) {
    const data = selectNode.data
    getTableDDL(
      TableDDLParam.mack(
        data.connectionId,
        data.data?.tableName,
        data.data?.dataBaseName,
        data.data?.schemaName
      )
    ).then((res) => {
      tableDDLName.value= t('query-table-ddl',[`${data.data?.tableName}`])
      tableDDL.value = res.data
      tableDDLDialogVisible.value=true
    })
  }
}
const handleTableDDLCopy = async () => {
  if (tableDDL.value && tableDDL.value != '') {
    await window.winApi.copy(tableDDL.value)
    MessageBox.ok(t('copy-success'))
    tableDDLDialogVisible.value=false
  }
}
</script>
<template>
  <div class="table-box">
    <div ref="headerRef" :class="['table-box-header', serachSwitch ? 'div-center' : '']">
      <div v-if="serachSwitch" class="header-serach">
        <el-input
          ref="serachRef"
          v-model="query"
          v-focus
          :placeholder="$t('keywords-search')"
          clearable
          class="query-input"
        >
          <template #append>
            <el-button type="primary" :icon="Close" @click="onSerachSwitch(false)" />
          </template>
        </el-input>
      </div>
      <div v-else class="header-options">
        <div class="header-options-name">{{ data?.name }}</div>
        <div>
          <el-icon class="icon" :size="20" @click="refreshTable(datasourceId)">
            <Refresh />
          </el-icon>
          <el-icon class="icon" :size="20" @click="onSerachSwitch(true)">
            <Search />
          </el-icon>
        </div>
      </div>
    </div>
    <div class="table-box-content">
      <el-scrollbar>
        <el-tree
          ref="tableTreeRef"
          :data="dataSourceMetaTree"
          :props="treeProps"
          :empty-text="$t('nothing')"
          highlight-current
          lazy
          :icon="() => {}"
          node-key="id"
          :load="selectLoadNode"
          :filter-node-method="filterTable"
          @node-click="clickSelectTable"
          @node-expand="onNodeExpand"
        >
          <template #default="{ node }">
            <SvgIcon v-if="node.isLeaf && node.data?.isTable" icon-name="table" />
            <SvgIcon
              v-else-if="node.data?.isDb"
              icon-name="db"
              :color="node.data?.iconColor"
            />
            <SvgIcon v-else icon-name="schema" :color="node.data?.iconColor" />
            <span
              v-if="node.isLeaf && node.data?.isTable"
              :ref="tableContextmenuRef"
              v-contextmenu="{ ...tableContextmenuInfo, data: node }"
              class="table-tree-lable"
              >{{ node.label }}</span
            >
            <span v-else class="table-tree-lable" :node-data="node">{{
              node.label
            }}</span>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
    <el-dialog
      v-model="tableDDLDialogVisible"
      append-to-body
      top="6vh"
      :close-on-click-modal="false"
      :title="tableDDLName"
      draggable
      width="60%"
    >
      <Codeview v-model:code="tableDDL" dark></Codeview>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="tableDDLDialogVisible = false">{{ $t('cancel') }}</el-button>
          <el-button type="primary" @click="handleTableDDLCopy">
            {{ $t('confirm-copy') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
$tb-header-width: 40px;
$tb-color: #ddd;
.table-box {
  width: 100%;
  height: 100%;
  color: $tb-color;
  position: absolute;
  .table-box-header {
    height: $tb-header-width;
    .header-serach {
      width: 95%;
    }
    .header-options {
      justify-content: space-between;
      flex-direction: row;
      align-items: center;
      display: flex;
      padding: 0.2rem 0.2rem 0 0.2rem;
      .header-options-name {
        width: 80%;
        font-size: medium;
        font-weight: 600;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .icon {
      cursor: pointer;
      outline: none;
      &:hover {
        color: #409efc;
      }
    }
  }
  .table-box-content {
    width: 100%;
    height: calc(100% - $tb-header-width);
  }
}
.query-input {
  :deep() {
    .el-input__wrapper > .el-input__inner {
      color: $tb-color;
    }
  }
}
.div-center {
  display: grid;
  place-items: center;
}
.table-tree-lable {
  color: $tb-color;
  margin-left: 2px;
  &:hover {
    font-size: medium;
  }
}
:deep() {
  .el-tree-node__expand-icon {
    padding: 0;
  }
  .el-input--default > .el-input__wrapper {
    background-color: var(--subMenuBg);
  }
  .el-tree {
    background-color: var(--subMenuBg);
  }
  .el-tree-node__content:hover {
    background-color: #4b5f7e66 !important;
  }

  .el-tree-node.is-current > .el-tree-node__content {
    background-color: #4b5f7e66 !important;
  }

  .el-tree-node:focus > .el-tree-node__content {
    background-color: #4b5f7e66 !important;
  }
}
</style>
