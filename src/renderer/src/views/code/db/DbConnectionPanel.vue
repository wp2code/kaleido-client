<script lang="ts" setup>
import { deleteMenu, editMenu,refreshMenu,type IMenu } from '@/utils/MenuOpions'
import { listDataSource, deleteDataSource ,checkConnectDataSourceIsOpen,closeCurrentConnectDataSource} from '@/api/datasource/index'
import { DataSource } from '@/api/datasource/types'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const { proxy } = getCurrentInstance()
const list = ref<DataSource[]>([])
const emits = defineEmits<{
  select:[dbConfig:DataSource,event:String,isRefresh:Boolean]
  refresh:[data:Object,eventName:string]
}>()
const activeItemId=ref("-1")
const selectDeleteConnect=(item:any)=>{
  proxy.$msgBoxUtil.confirm(t('delete-confirm')+'?', {
    ok:  async () => {
      return  await deleteDataSource(item.id).then(response=>{
        if(response){
          queryList()
          emits('refresh',item.id,'delete')
          return true
        }
        return false
      })
    },
    successMsg: t('delete-success'),
    failMsg: t('delete-fail'),
  })

}
//选择编辑
const selectEditConnect=async (item:any)=>{
  //校验是否已经打开了
 await checkConnectDataSourceIsOpen(item.id).then((res)=>{
    if(res.data){
      const connectionId=  res.data
      proxy.$msgBoxUtil.confirm(t('connection-edit-confirm'), {
        ok: () => {
          closeCurrentConnectDataSource(connectionId).then((_res)=>{
            emits('select', item, 'edit',true)
          })
        },
        confirmButtonText: t('close-edit'),
        showElMessage: false
      })
    }else{
      emits('select', item, 'edit',false)
    }
  })
}
//选择刷新
const selectRefreshConnect=async (item:any)=>{
  const isRefresh=activeItemId.value==item.id
  emits('select', item, 'refresh', isRefresh)
}
//选择连接
const selectToConnect = (item: any) => {
  const isRefresh=activeItemId.value!=item.id
  activeItemId.value=item.id
  emits('select', item, 'connect', isRefresh)
}
//下拉菜单 选择事件
const selectMorMenuItem = (menu: IMenu) => {
  if (menu) {
    menu.exeCommand(menu.bindData)
  }
}
async function queryList(_params?: any) {
    await listDataSource().then(response=>{
    list.value=response.data||[]
  })
}
const menuBindData=(menu:IMenu,data:any):IMenu=>{
  menu.bindData=data||{}
  return menu;
}
const morMenuList: IMenu[] = [editMenu(selectEditConnect), deleteMenu(selectDeleteConnect),refreshMenu(selectRefreshConnect)]
onMounted(() => {
  queryList()
})
defineExpose({ queryList })
</script>

<template>
  <div class="panel">
    <div class="header">{{ $t('code.connections') }}</div>
    <el-scrollbar class="box-scrollbar">
      <div class="box">
        <div
          v-for="(item, index) of list"
          :key="index"
          :class="['item', item.id == activeItemId ? 'active-item' : '']"
          @click.stop="selectToConnect(item)"
        >
          <div class="desc">
            <svg-icon
              :icon-name="item?.icon"
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
  color: #ddd;
}
.header {
  font-size: large;
  font-weight: bold;
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
  width: 100%;
}
.item {
  width: 80%;
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
      margin: 0 4px 0 0;
    }
  }
  &:hover {
    cursor: pointer;
    font-size: medium;
  }
  .more {
    &:hover {
      cursor: pointer;
      color: $menuActiveText;
    }
  }
}
.active-item {
  background-color: $menuBg;
}
</style>
