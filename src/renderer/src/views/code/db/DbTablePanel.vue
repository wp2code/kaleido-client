<script lang="ts" setup>
import { DbConfig } from '~/repositories/entity/DbConfig'

const props = defineProps({
  data: {
    type: DbConfig || undefined,
    default: () => {},
  },
})
const dbConfig = ref<DbConfig>(props.data)
onMounted(() => {})
</script>
<template>
  <el-scrollbar>
    <div>111</div>
  </el-scrollbar>
</template>

<style lang="scss" scoped></style>
