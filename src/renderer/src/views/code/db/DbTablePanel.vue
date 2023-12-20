<script lang="ts" setup>
import { getDataSourceMetaAll } from '@/api/datasource/index'
import { DataSource, Schema, Table, Database } from '@/api/datasource/types'
import { ElInput, ElTreeV2, TreeNode } from 'element-plus'
import { Refresh, Search } from '@element-plus/icons-vue'
import { TreeNodeData } from 'element-plus/es/components/tree-v2/src/types'
interface Tree {
  id: string
  label: string
  data: Table | Schema | Database
  children?: Tree[]
  disabled?: string
}

const treeProps = {
  value: 'id',
  label: 'label',
  children: 'children',
}
const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
})
const datasourceId = ref<string>(props.data?.id)
const dataSourceMetaTree = ref<Tree[]>()
const dataSource = ref<DataSource>()
const emits = defineEmits<{
  select: [table: Table, dataSource: DataSource]
}>()
//转换获取子节点
function getChildren(
  parentName: string = '',
  arr: Array<Table | Schema>,
  isSchema: boolean
): Tree[] {
  return arr?.map((item) => {
    if (isSchema === true) {
      const schema = item as Schema
      const tableList = schema.tableList || []
      return {
        id: parentName + '_' + schema.schemaName,
        label: schema.schemaName,
        data: schema,
        children:
          tableList.length > 0
            ? getChildren(parentName + '_' + schema.schemaName, tableList, false)
            : [],
      } as Tree
    } else {
      const table = item as Table
      return {
        id: parentName + '_' + table.tableName,
        label: table.tableName,
        data: table,
        children: [],
      } as Tree
    }
  })
}
const query = ref('')
const tableTreeRef = ref<InstanceType<typeof ElTreeV2>>()
const filterTableTree = (query: string, node: Tree) => {
  return node?.label!.includes(query)
}
const onTableFilter = (query: string) => {
  tableTreeRef.value!.filter(query)
}
const serachRef = ref<InstanceType<typeof ElInput>>()
const serachSwitch = ref<boolean>(false)
const onSerachSwitch = (onOff: boolean) => {
  serachSwitch.value = onOff
  if (onOff) {
    nextTick(() => {
      serachRef.value.focus()
    })
  }
}
const loading = ref(false)
const queryMetaList = (id: string) => {
  if (id) {
    loading.value = true
    getDataSourceMetaAll(id)
      .then((res) => {
        loading.value = false
        if (res.data) {
          const data = res.data || {}
          dataSource.value = res.data!.dataSource
          const treeData = data.dateBaseList.map((item) => {
            return {
              id: item.name,
              label: item.name,
              data: item,
              children: getChildren(
                item.name,
                item.supportSchema == true ? item.schemaList : item.tableList,
                item.supportSchema
              ),
            }
          })
          dataSourceMetaTree.value = treeData
        }
      })
      .catch((_err) => {
        loading.value = false
      })
  }
}
//选中表
const selectTable = (nodeData: TreeNodeData, node: TreeNode, e: MouseEvent) => {
  const tableName = nodeData.data.tableName
  if (tableName) {
    console.log('data', nodeData.data)
    console.log('node', node)
    console.log('e', e)
    emits('select', nodeData.data as Table, dataSource.value)
  }
}
const refreshTable = (id: string) => {
  queryMetaList(id)
}
const tableBoxRef = ref<HTMLElement>()
onMounted(() => {
  queryMetaList(datasourceId.value)
})
const headerRef = ref<HTMLElement>()
const treeHeight = ref()
watchEffect(async () => {
  treeHeight.value = tableBoxRef.value?.offsetHeight - headerRef.value?.offsetHeight
})
</script>
<template>
  <div ref="tableBoxRef" class="table-tree">
    <div
      ref="headerRef"
      class="table-tree-header"
      :style="{ width: '100%', minHeight: '32px' }"
    >
      <el-input
        v-if="serachSwitch"
        ref="serachRef"
        v-model="query"
        v-focus
        :prefix-icon="Search"
        class="header-serach"
        placeholder="搜索"
        clearable
        @input="onTableFilter"
        @blur="onSerachSwitch(false)"
      />
      <div v-else class="header-options">
        <div>{{ dataSource?.name }}</div>
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
    <div class="table-tree-content">
      <el-scrollbar v-if="dataSourceMetaTree">
        <el-tree-v2
          ref="tableTreeRef"
          v-loading="loading"
          :data="dataSourceMetaTree"
          highlight-current
          :height="treeHeight"
          :props="treeProps"
          :empty-text="'~什么也没有'"
          :filter-method="filterTableTree"
          @node-click="selectTable"
        >
          <template #default="{ node }">
            <!-- <span class="prefix" :class="{ 'is-leaf': node.isLeaf }">[ElementPlus]</span> -->
            <span>{{ node.label }}</span>
          </template>
        </el-tree-v2>
      </el-scrollbar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table-tree {
  width: 100%;
  height: 100%;
  color: white;
  position: relative;
  .table-tree-header {
    .header-serach {
      margin-bottom: 2px;
    }
    .header-options {
      justify-content: space-between;
      flex-direction: row;
      align-items: center;
      display: flex;
    }
    .icon {
      cursor: pointer;
      outline: none;
      margin-right: 2px;
      :hover {
        color: #409efc;
      }
    }
  }
  padding: 5px;
  .table-tree-content {
  }
}

:deep() {
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
