<script lang="ts" setup>
import About from './about/index.vue'
import Help from './help/index.vue'
import General from './general/index.vue'
const componentName = ref()
const componentKey = ref()
const activeComponent = ref('')
const selecComponent = (cname: string) => {
  activeComponent.value = cname
  if (cname == 'About') {
    componentName.value = About
  }
  if (cname == 'Help') {
    componentName.value = Help
  }
  if (cname == 'General') {
    componentName.value = General
  }
}
onMounted(() => {
  activeComponent.value = 'About'
  selecComponent(activeComponent.value)
})
</script>

<template>
  <box-layout layout="row" size="25%" divider-color="#ddd" :show-divider="true">
    <template #first>
      <div class="st-menu">
        <div :class="['st-menu-item', activeComponent == 'General' ? 'active' : '']">
          <svg-icon icon-name="general" size="1em" color="#ddd" />
          <span @click="selecComponent('General')">{{ $t('general') }}</span>
        </div>
        <div :class="['st-menu-item', activeComponent == 'Help' ? 'active' : '']">
          <svg-icon icon-name="help" size="1em" color="#ddd" />
          <span @click="selecComponent('Help')">{{ $t('help') }}</span>
        </div>
        <div :class="['st-menu-item', activeComponent == 'About' ? 'active' : '']">
          <svg-icon icon-name="about" size="1em" color="#ddd" />
          <span @click="selecComponent('About')">{{ $t('about') }}</span>
        </div>
      </div>
    </template>
    <keep-alive>
      <component :is="componentName" :key="componentKey"></component>
    </keep-alive>
  </box-layout>
</template>

<style lang="scss" scoped>
.st-menu {
  height: 100%;
  .st-menu-item {
    padding: 1rem;
    color: #ddd;
    span {
      margin-left: 0.5rem;
      &:hover {
        cursor: pointer;
        color: var(--menuActiveText);
      }
    }
  }
}
.active span {
  color: var(--menuActiveText);
}
</style>
