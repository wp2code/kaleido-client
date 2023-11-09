<script lang="ts" setup>
import { DropdownInstance } from 'element-plus'
import BookmarkBox from './BookmarkBox.vue'
import { Bookmark } from '~/repositories/entity/Bookmark'
const { proxy } = getCurrentInstance()
interface MoreMenu {
  [key: string]: any
}
const morMenuList: MoreMenu[] = [
  {
    id: 'delete',
    name: '删除',
    icon: 'Delete',
    command: (item: any) => {
      deleteItem(item)
    },
  },
  {
    id: 'edit',
    name: '编辑',
    icon: 'Edit',
    command: (item: any) => {
      editItem(item)
    },
  },
  {
    id: 'addWebsite',
    name: '添加网址',
    icon: 'CirclePlus',
    command: (item: any) => {
      addItem(item)
    },
  },
]
const list = ref<Bookmark[]>([])
const selectData = ref<Bookmark>()
const queryParams = ref()
onMounted(async () => {
  return await initList(queryParams)
})
async function initList(params: any | undefined) {
  const bookmarkList = await window.db.bookmark.queryList(params)
  console.log('bookmarkList', bookmarkList)
  list.value = bookmarkList
}
const filterMorMenu = (canNotAdd: boolean | undefined) => {
  if (canNotAdd) {
    return morMenuList.filter((v) => v.id !== 'addWebsite')
  }
  return morMenuList
}

const morMenuInstance = ref<DropdownInstance>()
const dialogVisible = ref(false)
const active = ref(0)
const dialogTitle = ref('')
const clickMoreMenu = () => {
  if (!morMenuInstance.value) {
    return
  }
  morMenuInstance.value.handleOpen()
}
const save = async (data) => {
  const bookmark = { ...data } as Bookmark
  if (bookmark.id > 0) {
    //更新
    await window.db.bookmark.update(bookmark.id, bookmark).then(async (t) => {
      if (t) {
        await initList(null)
        dialogVisible.value = false
      }
    })
  } else {
    //新增
    await window.db.bookmark.save(bookmark).then((t: any) => {
      if (t) {
        if (bookmark.parentId > 0 && bookmark.type === 0) {
          for (const bk of list.value) {
            if (bk.id === bookmark.parentId) {
              const subList = bk.subList || []
              subList.push({ ...t })
              break
            }
          }
        } else {
          list.value.push({ ...t })
        }
        dialogVisible.value = false
      }
    })
  }
}
const deleteItem = (data: any) => {
  proxy.$msgBoxUtil.confirm('确认删除', {
    ok: async () => {
      const subList = toRaw(data.subList)
      console.log('id', data.id, 'subList', subList)
      return await window.db.bookmark.del(data.id, subList).then(async (res) => {
        const isSuccess = res.success === true
        if (isSuccess) {
          await initList(null)
        }
        return isSuccess
      })
    },
    successMsg: '删除成功',
    failMsg: '删除失败',
  })
}
const addItem = (data: any | undefined) => {
  selectData.value = data
    ? ({ type: 0, parentId: data.id } as Bookmark)
    : ({ type: 0 } as Bookmark)
  dialogTitle.value = '新增'
  dialogVisible.value = true
}
const editItem = (data: any) => {
  selectData.value = { ...data } as Bookmark
  dialogTitle.value = '编辑'
  dialogVisible.value = true
}
//下拉菜单 选择事件
const selectMorMenuItem = (item: any) => {
  console.log('item', item)
  if (item) {
    item.menu.command(item.data)
  }
}
//右键菜单 选择事件
const selectMenuItem = (menu, data) => {
  console.log('menu', menu, 'data', data.label)
  if (menu) {
    menu.command(data)
  }
}
const selectItem = (item: any) => {
  active.value = item.id
  emites('select', item)
}
const emites = defineEmits(['select'])
</script>
<template>
  <el-scrollbar height="100%">
    <div class="box">
      <div class="bm-item">
        <div
          v-for="item of list"
          :key="item.id"
          :class="[
            'item',
            item.type === 0 ? 'link' : null,
            active == item.id ? 'active' : null,
          ]"
          @click.stop
          @click="item.type === 0 ? selectItem(item) : null"
        >
          <div class="header">
            <div class="desc">
              <svg
                v-if="item.type === 0"
                aria-hidden="true"
                style="width: 1em; height: 1em; margin-top: 0.2em"
                fill="#ddd"
              >
                <use :href="`#icon-website`" />
              </svg>
              <Collection v-else style="width: 1em; height: 1em; margin-top: 0.2em" />
              <span>{{ item.label }}</span>
            </div>
            <div class="more" @click.stop @click.self="clickMoreMenu">
              <el-dropdown hide-on-click trigger="click" @command="selectMorMenuItem">
                <el-icon><More /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="menuItem of filterMorMenu(item.type === 0)"
                      :key="menuItem.id"
                      :icon="menuItem.icon"
                      :command="{ menu: menuItem, data: item }"
                    >
                      {{ menuItem.name }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
          <div v-if="item.subList" class="content">
            <template v-for="subItem of item.subList" :key="subItem.id">
              <div
                :class="['content-item', active == subItem.id ? 'active' : null]"
                @click="selectItem(subItem)"
              >
                <ContextMenu
                  class="block"
                  :menu="filterMorMenu(true)"
                  :data="subItem"
                  @select="selectMenuItem"
                >
                  <span>{{ subItem.label }}</span>
                </ContextMenu>
                <div class="more" @click.stop @click.self="clickMoreMenu">
                  <el-dropdown hide-on-click trigger="click" @command="selectMorMenuItem">
                    <el-icon><More /></el-icon>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item
                          v-for="menuItem of filterMorMenu(true)"
                          :key="menuItem.id"
                          :icon="menuItem.icon"
                          :command="{ menu: menuItem, data: subItem }"
                        >
                          {{ menuItem.name }}</el-dropdown-item
                        >
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="bm-btn">
        <el-button type="primary" @click="addItem(null)">
          <svg
            aria-hidden="true"
            style="width: 2em; height: 2em; margin-right: 0.1em"
            fill="#ddd"
          >
            <use :href="`#icon-stars`" />
          </svg>
          新增
        </el-button>
        <Transition>
          <BookmarkBox
            v-if="dialogVisible"
            v-model="dialogVisible"
            :tip="dialogTitle"
            :data="selectData"
            @save="save"
          ></BookmarkBox>
        </Transition>
      </div>
    </div>
  </el-scrollbar>
</template>

<style lang="scss" scoped>
.box {
  color: #ddd;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  // background-color: $menuBg;
  .bm-item {
    width: 100%;
    height: 100%;
    padding: 10px;
    .item {
      margin-top: 10px;
      border: 1px solid #001528;
      border-radius: 5px;
      .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 10px;
        background-color: #001528;
        .desc {
          span {
            margin-left: 4px;
          }
        }
      }
      .content {
        display: flex;
        flex-direction: column;
        .content-item {
          padding: 4px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          // background-color: red;
          span {
            // width: 150px;
            overflow: hidden;
            display: inline-block;
            // background-color: $subMenuBg;
            // border-bottom: 1px #ddd dashed;
            // outline: none;
            text-overflow: ellipsis;
            white-space: nowrap;
            &:hover {
              cursor: pointer;
              color: $menuActiveText;
            }
          }
        }
      }
    }
  }
  .more {
    cursor: pointer;
    i {
      &:hover {
        background-color: $menuActiveText;
        border-radius: 50%;
        color: #ddd;
      }
    }
  }
  .link {
    cursor: pointer;
    &:hover {
      // background-color: #a0cfff;
      color: $menuActiveText;
    }
  }
  .active {
    color: $menuActiveText;
  }
  .bm-btn {
    position: absolute;
    bottom: 10px;
    // background-color: rgba(255, 0, 0, 0.5);
    // left: 50px;
    // right: 50px;
    button {
      // opacity: 0.6;
    }
  }
}
</style>
