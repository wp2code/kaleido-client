<script lang="ts" setup>
import {
  openConnectDataSource,
  openDataBase,
  closeConnectDataSource,
  getDataSourceByConnectionId,
} from '@/api/datasource/index'
import { Schema, Table, Database, SimpleDatabase } from '@/api/datasource/types'
import type Node from 'element-plus/es/components/tree/src/model/node'
const emits = defineEmits(['select'])
interface Tree {
  id: string
  label: string
  data: Table | Schema | Database | SimpleDatabase
  connectionId?: string
  children?: Tree[]
  leaf: boolean
  disabled?: string
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
    default: null,
  },
})
const datasourceId = ref<string>(props.data?.id)
const dataSourceMetaTree = ref<Tree[]>()
const openConnection = (id: string) => {
  if (!id) {
    return
  }
  openConnectDataSource(id).then((res) => {
    const data = res.data
    if (data) {
      const treeData = data.databases.map((item) => {
        return {
          id: item.dataBaseName,
          label: item.dataBaseName,
          data: item,
          leaf: false,
          connectionId: data.connectionId,
          children: [],
        }
      })
      dataSourceMetaTree.value = treeData
    }
  })
}
const clickSelectTable = async (tree: Tree) => {
  if (tree.leaf) {
    await getDataSourceByConnectionId(tree.connectionId).then((res) => {
      console.log('选择表', tree.data, res.data)
      emits('select', tree.data as Table, res.data)
    })
  }
}
const selectLoadNode = (node: Node, resolve: (data: Tree[]) => void) => {
  if (node.level == 0) {
    return resolve(dataSourceMetaTree.value)
  }
  const data = node.data
  if (node.level == 1) {
    openDataBase(data.connectionId, (data.data as SimpleDatabase).dataBaseName).then(
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
    const tableList = data.data.tableList
    if (tableList) {
      resolve(
        data.data.tableList?.map((item) => {
          return {
            id: item.tableName,
            label: item.tableName,
            data: item,
            leaf: true,
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

const tableBoxRef = ref<HTMLElement>()
onMounted(() => {
  openConnection(datasourceId.value)
})
onBeforeUpdate(() => {
  closeConnectDataSource(datasourceId.value)
})
// const headerRef = ref<HTMLElement>()
const treeHeight = ref()
watchEffect(async () => {
  treeHeight.value = tableBoxRef.value?.offsetHeight
  // treeHeight.value = tableBoxRef.value?.offsetHeight - headerRef.value?.offsetHeight
})
</script>
<template>
  <div ref="tableBoxRef" class="table-tree">
    <!-- <div
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
    </div> -->
    <div class="table-tree-content">
      <el-scrollbar v-if="dataSourceMetaTree" :height="treeHeight">
        <el-tree
          :data="dataSourceMetaTree"
          :props="treeProps"
          :empty-text="'~什么也没有'"
          highlight-current
          lazy
          :load="selectLoadNode"
          @node-click="clickSelectTable"
        >
          <template #default="{ node }">
            <!-- <span class="prefix" :class="{ 'is-leaf': node.isLeaf }">[ElementPlus]</span> -->
            <span>{{ node.label }}</span>
          </template>
        </el-tree>
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
