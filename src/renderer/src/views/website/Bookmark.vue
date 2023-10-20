<template>
  <el-input
    v-model="filterText"
    class="search"
    :prefix-icon="`Search`"
    placeholder="搜索"
  />
  <el-tree
    ref="treeRef"
    class="filter-tree"
    :data="dataSource"
    :indent="11"
    :filter-node-method="filterNode"
    icon="Folder"
  >
    <template #default="{ node, data }">
      <div class="bookMark-box">
        <div>
          <span v-if="data.icon" style="margin-right: 5px; vertical-align: -4px"
            ><img
              :src="getAssetsImge(data.icon)"
              style="width: 16px; height: 16px"
              alt=""
          /></span>
          <span v-if="data.isDir">{{ node.label }}</span>
          <span v-else style="cursor: pointer" @click.self="toHref(node.label)">{{
            node.label
          }}</span>
        </div>
        <div style="cursor: pointer" @click.stop @click.self="handleClikMore()">
          <el-dropdown hide-on-click trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              <el-icon><More /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="item in filterMorrMenu(data)"
                  :key="item.id"
                  :icon="item.icon"
                  :command="{ item, data, node }"
                >
                  {{ item.name }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </template>
  </el-tree>
  <EditBookmark
    v-model="dialogVisible"
    title="测试"
    :is-add-sub="isAddSub"
    :data="targetBookmark.info"
    @close="dialogVisible = false"
    @submit="saveBookmark"
  ></EditBookmark>
  <!-- <el-dialog v-model="dialogVisible" :title="dialogTitle" :before-close="resetForm">
    <el-form
      ref="bookmarkDataRef"
      :model="bookmarkData"
      :rules="rules"
      node-key="id"
      label-width="auto"
      label-position="right"
    >
      <el-form-item prop="label">
        <el-input
          v-model="bookmarkData.label"
          autocomplete="off"
          :placeholder="bookmarkData.type == 'website' ? '输入网址' : '填写目录名称'"
        >
          <template v-if="bookmarkData.type == 'website'" #prepend>
            <el-select v-model="website.protocol" style="width: 80px">
              <el-option label="http" value="http" />
              <el-option label="https" value="https" />
            </el-select>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClose">取消</el-button>
        <el-button type="primary" @click="submitForm"> 保存 </el-button>
      </span>
    </template>
  </el-dialog> -->
</template>
<script lang="ts" setup>
import { getAssetsImge } from '@/utils'
import EditBookmark from './EditBookmark.vue'
import { ElTree, DropdownInstance } from 'element-plus'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { Bookmark } from '~/repositories/entity/Bookmark'
const { proxy } = getCurrentInstance()
interface BookmarkFrom {
  label: string
  type: string
  isDir: boolean
}
interface MoreMenu {
  [key: string]: any
}
declare type TargetBookmark = {
  info?: Bookmark
  node?: Node
}
const dialogVisible = ref(false)
const dialogTitle = ref('')
const morMenuInstance = ref<DropdownInstance>()
const filterText = ref('')
const bookmarkData = reactive<BookmarkFrom>({
  label: '',
  type: '',
  isDir: false,
})

const targetBookmark = ref<TargetBookmark>({})
const dataSource = ref<Bookmark[]>([])
const treeRef = ref<InstanceType<typeof ElTree>>()
const isAddSub = ref(false)
const morMenuList: MoreMenu[] = [
  {
    id: 'delete',
    name: '删除',
    icon: 'Delete',
    type: 'all',
    command: (node: Node, data: Bookmark) => {
      return deleteItem(node, data)
    },
  },
  {
    id: 'edit',
    name: '编辑',
    icon: 'Edit',
    type: 'all',
    command: (node: Node, data: Bookmark) => {
      return editItem(node, data)
    },
  },
  {
    id: 'addWebsite',
    name: '添加网址',
    icon: 'CirclePlus',
    type: 'dir',
    command: (node: Node, data: Bookmark) => {
      return addWebsite(node, data)
    },
  },
  {
    id: 'addSubDir',
    name: '添加子目录',
    icon: 'CirclePlus',
    type: 'dir',
    command: (node: Node, data: Bookmark) => {
      return addSubDir(node, data)
    },
  },
]
onMounted(async () => {
  init()
})
watch(filterText, (val) => {
  treeRef.value!.filter(val)
})
const init = async () => {
  const bookmarks = await window.db.bookmark.listAll()
  dataSource.value = bookmarks
}
const append = (data: Bookmark) => {
  const children = targetBookmark.value.info.children || []
  children.push(data)
  dataSource.value = [...dataSource.value]
}
const remove = (node: Node, data: Bookmark) => {
  const parent = node.parent
  const children: Bookmark[] = parent.data.children || parent.data
  const index = children.findIndex((d) => d.id === data.id)
  children.splice(index, 1)
  dataSource.value = [...dataSource.value]
}
const saveBookmark = (data: Bookmark) => {
  console.log('saveBookmark', data.label)
}
//  const submitForm = async () => {
//   const formEl = proxy.$refs['bookmarkDataRef']
//   if (!formEl) return
//   await (formEl as FormInstance).validate(async (valid, fields) => {
//     if (valid) {
//       const bkInfo = new Bookmark()
//       bkInfo.label = bookmarkData.label
//       bkInfo.icon = bookmarkData.isDir ? 'Folder' : 'item.png'
//       bkInfo.parent = toRaw(targetBookmark.value.info)
//       bkInfo.isDir = bookmarkData.isDir
//       await window.db.bookmark
//         .save(bkInfo)
//         .then((res) => {
//           if (res) {
//             append(res)
//             dialogClose()
//           }
//         })
//         .catch((err) => {
//           console.error('save Error', err)
//         })
//     } else {
//       console.log('error submit!', fields)
//     }
//   })
// }

const deleteItem = (node: Node, data: Bookmark) => {
  proxy.$msgBoxUtil.confirm('确认删除', {
    ok: async () => {
      const res = await window.db.bookmark.del(toRaw(data))
      if (res) {
        remove(node, data)
        return true
      }
      return false
    },
    successMsg: '删除成功',
    failMsg: '删除失败',
  })
}

const editItem = (node: Node, data: Bookmark) => {
  dialogVisible.value = true
  dialogTitle.value = '编辑'
  bookmarkData.type = 'website'
  isAddSub.value = false
  bookmarkData.isDir = data.isDir
  targetBookmark.value.info = data
  targetBookmark.value.node = node
}
const addWebsite = (node: Node, data: Bookmark) => {
  dialogVisible.value = true
  dialogTitle.value = '添加网址'
  bookmarkData.type = 'website'
  bookmarkData.isDir = true
  isAddSub.value = true
  targetBookmark.value.info = data
  targetBookmark.value.node = node
}
const addSubDir = (node: Node, data: Bookmark) => {
  dialogVisible.value = true
  dialogTitle.value = '添加子目录'
  bookmarkData.type = 'dir'
  bookmarkData.isDir = true
  isAddSub.value = true
  targetBookmark.value.info = data
  targetBookmark.value.node = node
}

const filterMorrMenu = (data: Bookmark) => {
  return morMenuList.filter((v) => {
    if (!data.parent && v.id == 'delete') {
      return false
    }
    return v.type == 'all' || (v.type == 'dir' && data.isDir)
  })
}

const filterNode = (value: string, dataSource: Bookmark) => {
  if (!value) return true
  return dataSource.label.includes(value)
}

const handleClikMore = () => {
  if (!morMenuInstance.value) return
  morMenuInstance.value.handleOpen()
}
const handleCommand = (obj) => {
  obj.item.command(obj.node, obj.data)
}
const toHref = (link: string) => {
  window.open(link, 'linkRef')
}
</script>
<style lang="scss" scoped>
.bookmark-tree {
  background-color: antiquewhite;
}
.bookMark-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 10px;
  border-color: transparent;
  outline: none;
  width: 100%;
}
.search {
  padding: 0 20px 10px 20px;
}
::v-deep .el-tree-node__content {
  cursor: default;
}
</style>
