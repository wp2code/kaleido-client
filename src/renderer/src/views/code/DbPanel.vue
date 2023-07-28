<script lang="ts" setup></script>

<template>
  <el-scrollbar>
    <Box v-for="n in 100" :key="n" icon="code"> {{ n }} </Box>
  </el-scrollbar>
</template>

<style lang="scss" scoped></style>
