<script lang="ts" setup>
const props = defineProps({
  icon: {
    type: String,
    require: false,
    default: '',
  },
})
</script>
<template>
  <div class="box">
    <svg-icon v-if="props.icon" :icon-class="props.icon" size="1.5em" />
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.box {
  width: 220px;
  height: 40px;
  border-radius: 4px;
  padding-left: 10px;
  background-color: red;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 5px 0;
}
</style>
