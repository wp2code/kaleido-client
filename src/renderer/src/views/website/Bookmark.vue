<template>
  <el-input v-model="filterText" :prefix-icon="`Search`" placeholder="搜索" />
  <el-tree
    ref="treeRef"
    class="filter-tree"
    :data="dataSource"
    :indent="11"
    :filter-node-method="filterNode"
    icon="Folder"
  >
    <template #default="{ node, data }">
      <div class="bookMark-box">
        <div>
          <span v-if="data.icon" style="margin-right: 5px; vertical-align: -4px"
            ><img :src="data.icon" style="width: 16px; height: 16px" alt=""
          /></span>
          <span>{{ node.label }}</span>
        </div>
        <div style="cursor: pointer" @click.stop @click.self="handleClikMore()">
          <el-dropdown hide-on-click trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              <el-icon><More /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="item in filterMorrMenu(data)"
                  :key="item.id"
                  :icon="item.icon"
                  :command="{ item, data, node }"
                >
                  {{ item.name }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </template>
  </el-tree>
</template>
<script lang="ts" setup>
import { getAssetsImge } from "@/utils";
import { ElTree, DropdownInstance } from "element-plus";
import BookmarkApi from "@/repository/bookmark";
// import SvgIcon from "@/components/SvgIcon/index.vue";
import type Node from "element-plus/es/components/tree/src/model/node";
interface Tree {
  [key: string]: any;
}
interface MoreMenu {
  [key: string]: any;
}

const morMenuInstance = ref<DropdownInstance>();
const filterText = ref("");
const treeRef = ref<InstanceType<typeof ElTree>>();

const morMenuList: MoreMenu[] = [
  {
    id: 1,
    name: "删除",
    icon: "Delete",
    type: "all",
    command: (node: Node, data: Tree) => {
      return deleteItem(node, data);
    },
  },
  {
    id: 1,
    name: "编辑",
    icon: "Edit",
    type: "all",
    command: (node: Node, data: Tree) => {
      return editItem(node, data);
    },
  },
  {
    id: 2,
    name: "添加网址",
    icon: "CirclePlus",
    type: "dir",
    command: (node: Node, data: Tree) => {
      return addWebsite(node, data);
    },
  },
  {
    id: 3,
    name: "添加子目录",
    icon: "CirclePlus",
    type: "dir",
    command: (node: Node, data: Tree) => {
      return addSubDir(node, data);
    },
  },
];

const deleteItem = (node: Node, data: Tree) => {
  console.log("deleteItem");
  console.log(node);
  console.log(data);
};
const editItem = (node: Node, data: Tree) => {
  console.log("editItem");
  console.log(node);
  console.log(data);
};
const addWebsite = (node: Node, data: Tree) => {
  console.log("addWebsite");
  console.log(data);
};
const addSubDir = (node: Node, data: Tree) => {
  console.log("addSubDir");
  console.log(data);
  BookmarkApi.add({ icon: "测试", lable: "HelpFilled" });
};
const filterMorrMenu = (data: Tree) => {
  return morMenuList.filter((v) => v.type == "all" || (v.type == "dir" && data.children));
};
let id = 1000;
watch(filterText, (val) => {
  treeRef.value!.filter(val);
});

const filterNode = (value: string, dataSource: Tree) => {
  if (!value) return true;
  return dataSource.label.includes(value);
};

const handleClikMore = () => {
  if (!morMenuInstance.value) return;
  morMenuInstance.value.handleOpen();
};
const handleCommand = (obj) => {
  obj.item.command(obj.node, obj.data);
};
const append = (dataSource: Tree) => {
  const newChild = { id: id++, label: "testtest", children: [] };
  if (!dataSource.children) {
    dataSource.children = [];
  }
  dataSource.children.push(newChild);
  dataSource.value = [...dataSource.value];
};

const remove = (node: Node, dataSource: Tree) => {
  const parent = node.parent;
  const children: Tree[] = parent.data.children || parent.data;
  const index = children.findIndex((d) => d.id === dataSource.id);
  children.splice(index, 1);
  dataSource.value = [...dataSource.value];
};
const renderContent = (
  h,
  {
    node,
    data,
    store,
  }: {
    node: Node;
    data: Tree;
    store: Node["store"];
  }
) => {
  return h(
    "span",
    {
      class: "custom-tree-node",
    },
    h("span", null, node.label),
    h(
      "span",
      null,
      h(
        "a",
        {
          onClick: () => append(data),
        },
        "Append "
      ),
      h(
        "a",
        {
          style: "margin-left: 8px",
          onClick: () => remove(node, data),
        },
        "Delete"
      )
    )
  );
};
const dataSource: Tree[] = [
  {
    id: 0,
    label: "Level one 0",
    icon: getAssetsImge("item.png"),
  },
  {
    id: 1,
    label: "Level one 1",
    children: [
      {
        id: 4,
        label: "Level two 1-1",
        children: [
          {
            id: 9,
            label: "Level three 1-1-1",
          },
          {
            id: 10,
            label: "Level three 1-1-2",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "Level one 2",

    children: [
      {
        id: 5,
        label: "Level two 2-1",
        icon: getAssetsImge("item.png"),
      },
      {
        id: 6,
        label: "Level two 2-2",
        icon: getAssetsImge("item.png"),
      },
    ],
  },
  {
    id: 3,
    label: "Level one 3",
    children: [
      {
        id: 7,
        label: "Level two 3-1",
      },
      {
        id: 8,
        label: "Level two 3-2",
      },
    ],
  },
];
</script>
<style lang="scss" scoped>
.bookmark-tree {
  background-color: antiquewhite;
}
.bookMark-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 10px;
  border-color: transparent;
  outline: none;
  width: 100%;
}
.el-input {
  padding: 0 20px 10px 20px;
}
::v-deep .el-tree-node__content {
  cursor: default;
}
</style>
