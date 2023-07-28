<script lang="ts" setup>
import { translateRouteTitleI18n } from "@/utils/i18n";
const props = defineProps({
  title: String,
});
const titleValue = computed(() => {
  return translateRouteTitleI18n(props.title);
});
</script>
<template>
  <div class="am-left">
    <span class="title">{{ titleValue }}</span>
    <el-scrollbar>
      <slot></slot>
    </el-scrollbar>
  </div>
</template>
