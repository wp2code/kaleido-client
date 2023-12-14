<script lang="ts" setup>
import DbConnectionBox from '@/views/code/db/DbConnectionBox.vue'
import { DbConfig, DbType, getDefault } from '~/repositories/entity/DbConfig'

const list = ref<DbConfig[]>([])
const showConnentBox = ref(false)
const loayoutSize = ref(3)
const selectDbConfig = ref<DbConfig>()
const toConnent = (item: any) => {
  showConnentBox.value = true
  selectDbConfig.value = item
}
onMounted(() => {
  list.value = [
    getDefault(DbType.MySQL),
    getDefault(DbType.PostgreSQL),
    getDefault(DbType.Oracle),
    getDefault(DbType.TDengine),
  ]
})

const spaceCount = computed(() => {
  const size = list.value.length
  const mod = size % loayoutSize.value
  return mod == 0 ? 0 : size - mod
})
const itemStyle = computed(() => {
  return { 'flex-grow': list.value.length > loayoutSize.value ? 1 : 0 }
})
const cancelShow = (_from: string) => {
  showConnentBox.value = false
}
</script>
<template>
  <div class="box">
    <div v-if="showConnentBox">
      <DbConnectionBox :data="selectDbConfig" @cancel="cancelShow" />
    </div>
    <div v-else class="box-list">
      <template v-for="item of list" :key="item.type">
        <div class="item" :style="itemStyle" @click="toConnent(item)">
          <div class="itemBox">
            <div class="itemBox-desc">
              <svg-icon
                :icon-name="item.icon"
                size="1.1em"
                style="margin: 2px 5px 0 0"
              ></svg-icon>
              <div>
                {{ item.type }}
              </div>
            </div>
            <div class="itemBox-ops">+</div>
          </div>
        </div>
      </template>
      <div v-for="_f in spaceCount" :key="_f" class="space"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  flex: 1 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.box-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  max-width: 800px;
  .item {
    color: #ddd;
    height: 50px;
    width: 200px;
    margin: 10px 10px;
    padding: 0 16px;
    border-radius: 8px;
    overflow: hidden;
    box-sizing: border-box;
    border: 1px solid #ddd;
    .itemBox {
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: space-between;
      .itemBox-desc {
        display: flex;
        flex-flow: row;
      }
      .itemBox-ops {
        opacity: 0;
      }
    }
    &:hover {
      color: $menuActiveText;
      border: 1px solid $menuActiveText;
      cursor: pointer;
      .itemBox-ops {
        opacity: 1;
      }
    }
  }
  .space {
    flex-grow: 1;
    width: 200px;
    margin: 0 20px;
    padding: 0 16px;
    box-sizing: border-box;
  }
}
</style>
