<script lang="ts" setup>
import { DbConfig } from '~/repositories/entity/DbConfig'
import { deleteMenu, editMenu, type IMenu } from '@/utils/MenuOpions'
const { proxy } = getCurrentInstance()
const list = ref<DbConfig[]>([])
const emits = defineEmits<{
  select:[dbConfig:DbConfig,isEdit:Boolean]
}>()

const selectDeleteConnect=(item:any)=>{
  proxy.$msgBoxUtil.confirm('确认删除', {
    ok: async () => {
      const id=item!.id
      return await window.db.DbConfig.del(id).then((bol) => {
        if (bol===true) {
           queryList(null)
          return true
        }
        return false
      })
    },
    successMsg: '删除成功',
    failMsg: '删除失败',
  })

}
//选择编辑
const selectEditConnect=(item:any)=>{
  emits('select', item, true)
}
//选择连接数据库
const selectToConnect = (item: any) => {
  emits('select', item, false)
}
//下拉菜单 选择事件
const selectMorMenuItem = (menu: IMenu) => {
  if (menu) {
    menu.exeCommand(menu.bindData)
  }
}

async function queryList(_params: any) {
  list.value = await window.db.DbConfig.queryList()
}
const menuBindData=(menu:IMenu,data:any):IMenu=>{
  menu.bindData=data||{}
  return menu;
}
const morMenuList: IMenu[] = [editMenu(selectEditConnect), deleteMenu(selectDeleteConnect)]
onMounted(() => {
  queryList(null)
})
defineExpose({ queryList })
</script>

<template>
  <div class="panel">
    <div class="header">连接</div>
    <el-scrollbar class="box-scrollbar">
      <div class="box">
        <div
          v-for="(item, index) of list"
          :key="index"
          class="item"
          @click="selectToConnect(item)"
        >
          <div class="desc">
            <svg-icon
              :icon-name="item.icon"
              style="width: 1.1em; height: 1.1em; margin: 4px"
            />
            <div>
              {{ item.name }}
            </div>
          </div>
          <div class="more" @click.stop>
            <el-dropdown @command="selectMorMenuItem">
              <el-icon><More /></el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="menuItem of morMenuList"
                    :key="menuItem.id"
                    :icon="menuItem.icon"
                    :command="menuBindData(menuItem, item)"
                  >
                    {{ menuItem.name }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.panel {
  width: 100%;
  height: 100%;
}
.header {
  font-size: large;
  font-weight: bold;
  color: #ddd;
  height: 15%;
  z-index: 1;
  padding: 10px 0 0px 10px;
}
.box-scrollbar {
  height: 85%;
}
.box {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  overflow: hidden;
  margin-bottom: 10px;
}
.item {
  width: 210px;
  padding: 10px 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  overflow: hidden;
  .desc {
    display: flex;
    width: 180px;
    div {
      overflow: hidden;
      text-overflow: ellipsis;
      color: #ddd;
      margin: 0 4px 0 0;
      // background-color: red;
    }
  }
  &:hover {
    cursor: pointer;
    background-color: $menuBg;
  }
  .more {
    &:hover {
      cursor: pointer;
      color: $menuActiveText;
    }
  }
}
</style>
