<template>
  <div ref="containerRef">
    <slot></slot>
    <Teleport to="body">
      <Transition
        @before-enter="handleBeforeEnter"
        @enter="handleEnter"
        @after-enter="handleAfterEnter"
      >
        <div
          v-if="showMenu"
          class="context-menu"
          :style="{ left: x + 'px', top: y + 'px' }"
        >
          <div class="menu-list">
            <div
              v-for="(item, _i) in menu"
              :key="item?.name"
              class="menu-item"
              @click="handleClick(item)"
            >
              <svg aria-hidden="true" style="width: 14px; height: 14px" color="red">
                <use :href="`#icon-${item?.icon}`" />
              </svg>
              <!-- <svg
                :class="{ 'is-active': isActive }"
                class="hamburger"
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
              >
                <path
                  style="fill: #fff"
                  d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z"
                />
              </svg> -->

              {{ item?.name }}
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import useContextMenu from './useContextMenu'
interface MenuInfo {
  icon?: string
  name: string
}
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  menu: {
    type: Array<MenuInfo>,
    default: () => [],
  },
})
const containerRef = ref(null)
const emit = defineEmits(['select'])
const { x, y, showMenu } = useContextMenu(containerRef)
// 菜单的点击事件
function handleClick(item) {
  // 选中菜单后关闭菜单
  showMenu.value = false
  // 并返回选中的菜单
  emit('select', item, props.data)
}

function handleBeforeEnter(el) {
  el.style.height = 0
}

function handleEnter(el) {
  el.style.height = 'auto'
  const h = el.clientHeight
  el.style.height = 0
  requestAnimationFrame(() => {
    el.style.height = h + 'px'
    el.style.transition = '.5s'
  })
}

function handleAfterEnter(el) {
  el.style.transition = 'none'
}
</script>
<style lang="scss" scoped>
.context-menu {
  position: fixed;
  z-index: 1;
  // color: #ddd;
  // border: 1px solid #ddd;
  // background-color: $subMenuHover;
  background-color: #ffffff;
  padding: 10px;
  outline: none;
  overflow: hidden;
  // box-shadow: 2px 2px 2px #666;
  .menu-list {
    // padding: 5px;
    .menu-item {
      cursor: pointer;
      &:hover {
        color: $menuActiveText;
      }
    }
  }
}
</style>
