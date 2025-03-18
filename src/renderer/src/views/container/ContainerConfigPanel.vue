<script lang="ts" setup>
const toLocal = () => {}
const toRemote = () => {}
const toGitLab = () => {}
</script>

<template>
  <div class="box-div">
    <div class="box-1">
      <div class="item" @click="toLocal()">
        <div class="itemBox">
          <div class="itemBox-desc">
            <svg-icon
              icon-name="localdir"
              size="1.1em"
              style="margin: 2px 5px 0 0"
            ></svg-icon>
            <div>本地仓库</div>
          </div>
          <div class="itemBox-ops">+</div>
        </div>
      </div>
    </div>
    <div class="box-2">
      <div class="item" @click="toRemote()">
        <div class="itemBox">
          <div class="itemBox-desc">
            <svg-icon
              icon-name="gittree"
              size="1.1em"
              style="margin: 2px 5px 0 0"
            ></svg-icon>
            <div>远程仓库</div>
          </div>
          <div class="itemBox-ops">+</div>
        </div>
      </div>
      <div class="item" @click="toGitLab()">
        <div class="itemBox">
          <div class="itemBox-desc">
            <svg-icon
              icon-name="gitlab"
              size="1.1em"
              style="margin: 2px 5px 0 0"
            ></svg-icon>
            <div>GitLab</div>
          </div>
          <div class="itemBox-ops">+</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.box-div {
  width: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
}
.box-2 {
  display: flex;
  flex-flow: row;
  align-items: center;
}
.item {
  color: #ddd;
  height: 80px;
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
</style>
