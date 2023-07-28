<script lang="ts" setup>
import DbPanel from "./DbPanel.vue";
import DbTable from "./DbTable.vue";

function newC(): void {
  console.log("新增连接。。。");
}
</script>
<template>
  <div class="app-main">
    <main-Left title="代码生成">
      <div class="am-code-view">
        <DbPanel class="cv-db-panel" />
        <DbTable class="cv-db-table" />
      </div>
      <div class="am-code-btn">
        <el-button size="small" type="primary" @click="newC">新增连接</el-button>
      </div>
    </main-Left>
    <main-right> <div>Code Right</div></main-right>
  </div>
</template>

<style lang="scss" scoped>
.am-code-view {
  position: fixed;
  left: $sideBarWidth;
  bottom: 0;
  width: 250px;
  height: calc(100% - 30px);
  .cv-db-panel {
    height: 40%;
    display: flex;
    justify-content: center;
    // border: 1px solid seagreen;
  }
  .cv-db-table {
    height: 60%;
    // background-color: rgb(194, 118, 26);
    border: 1px solid var(--el-border-color);
    // background-color: transparent;
    // border: 1px solid blue;
  }
}
.am-code-btn {
  position: fixed;
  left: $sideBarWidth;
  bottom: 10px;
  width: 250px;
  text-align: center;
  .el-button--small {
    padding: 0 40px;
    // font-size: 8px;
  }
  // border: 1px solid var(--el-border-color);
}
</style>
