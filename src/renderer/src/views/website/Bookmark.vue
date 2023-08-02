<template>
  <el-input
    class="search"
    v-model="filterText"
    :prefix-icon="`Search`"
    placeholder="搜索"
  />
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
            ><img
              :src="getAssetsImge(data.icon)"
              style="width: 16px; height: 16px"
              alt=""
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
  <el-dialog v-model="dialogVisible" :title="dialogTitle" :before-close="resetForm">
    <el-form
      ref="bookmarkDataRef"
      :model="bookmarkData"
      :rules="rules"
      label-width="auto"
      label-position="right"
    >
      <el-form-item prop="label">
        <el-input
          v-model="bookmarkData.label"
          autocomplete="off"
          :placeholder="bookmarkData.type == 'website' ? '输入网址' : '填写目录名称'"
        >
          <template v-if="bookmarkData.type == 'website'" #prepend>
            <el-select v-model="website.protocol" style="width: 80px">
              <el-option label="http" value="http" />
              <el-option label="https" value="https" />
            </el-select>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClose">取消</el-button>
        <el-button type="primary" @click="submitForm"> 保存 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { getAssetsImge } from "@/utils";
import { ElTree, DropdownInstance, ElForm, FormInstance, FormRules } from "element-plus";
// import SvgIcon from "@/components/SvgIcon/index.vue";
import type Node from "element-plus/es/components/tree/src/model/node";
import { Bookmark } from "~/repositories/entity/Bookmark";
interface BookmarkFrom {
  label: string;
  type: string;
}
interface MoreMenu {
  [key: string]: any;
}
const dialogVisible = ref(false);
const dialogTitle = ref("");
const morMenuInstance = ref<DropdownInstance>();
const filterText = ref("");
const bookmarkData = reactive<BookmarkFrom>({
  label: "",
  type: "",
});
const website = reactive({
  protocol: "http",
});
const dataSource: Ref<Bookmark[]> = ref([]);
const treeRef = ref<InstanceType<typeof ElTree>>();
const { proxy } = getCurrentInstance();
const rules = reactive<FormRules<BookmarkFrom>>({
  label: { required: true, message: "请填写", trigger: "blur" },
});
const morMenuList: MoreMenu[] = [
  {
    id: "delete",
    name: "删除",
    icon: "Delete",
    type: "all",
    command: (node: Node, data: Bookmark) => {
      return deleteItem(node, data);
    },
  },
  {
    id: "edit",
    name: "编辑",
    icon: "Edit",
    type: "all",
    command: (node: Node, data: Bookmark) => {
      return editItem(node, data);
    },
  },
  {
    id: "addWebsite",
    name: "添加网址",
    icon: "CirclePlus",
    type: "dir",
    command: (node: Node, data: Bookmark) => {
      return addWebsite(node, data);
    },
  },
  {
    id: "addSubDir",
    name: "添加子目录",
    icon: "CirclePlus",
    type: "dir",
    command: (node: Node, data: Bookmark) => {
      return addSubDir(node, data);
    },
  },
];
onMounted(async () => {
  const bookmarks = await window.db.bookmark.listAll();
  dataSource.value = bookmarks;
});

const resetForm = (done: () => void) => {
  dialogClose();
  done();
};
const dialogClose = () => {
  const formEl = proxy.$refs["bookmarkDataRef"];
  (formEl as FormInstance).resetFields();
  dialogVisible.value = false;
};
const submitForm = async () => {
  const formEl = proxy.$refs["bookmarkDataRef"];
  if (!formEl) return;
  await (formEl as FormInstance).validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
};

const deleteItem = (node: Node, data: Bookmark) => {
  console.log("deleteItem");
};
const editItem = (node: Node, data: Bookmark) => {
  console.log("editItem");
};
const addWebsite = (node: Node, data: Bookmark) => {
  console.log("addWebsite");
  dialogVisible.value = true;
  dialogTitle.value = "添加网址";
  bookmarkData.type = "website";
};
const addSubDir = (node: Node, data: Bookmark) => {
  console.log("addSubDir");
  dialogVisible.value = true;
  dialogTitle.value = "添加子目录";
  bookmarkData.type = "dir";
};

const filterMorrMenu = (data: Bookmark) => {
  return morMenuList.filter(
    (v) =>
      (v.type == "all" && (v.id != "delete" || data.parent)) ||
      (v.type == "dir" && data.children)
  );
};
// let id = 1000;
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
// const append = (dataSource: Tree) => {
//   const newChild = { label: "testtest", children: [] };
//   if (!dataSource.children) {
//     dataSource.children = [];
//   }
//   dataSource.children.push(newChild);
//   dataSource.value = [...dataSource.value];
// };

// const remove = (node: Node, dataSource: Tree) => {
//   const parent = node.parent;
//   const children: Tree[] = parent.data.children || parent.data;
//   const index = children.findIndex((d) => d.id === dataSource.id);
//   children.splice(index, 1);
//   dataSource.value = [...dataSource.value];
// };

// const dataSource2: Tree[] = [
//   {
//     id: 0,
//     label: "Level one 0",
//     icon: getAssetsImge("item.png"),
//   },
//   {
//     id: 1,
//     label: "Level one 1",
//     children: [
//       {
//         id: 4,
//         label: "Level two 1-1",
//         children: [
//           {
//             id: 9,
//             label: "Level three 1-1-1",
//           },
//           {
//             id: 10,
//             label: "Level three 1-1-2",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: 2,
//     label: "Level one 2",

//     children: [
//       {
//         id: 5,
//         label: "Level two 2-1",
//         icon: getAssetsImge("item.png"),
//       },
//       {
//         id: 6,
//         label: "Level two 2-2",
//         icon: getAssetsImge("item.png"),
//       },
//     ],
//   },
//   {
//     id: 3,
//     label: "Level one 3",
//     children: [
//       {
//         id: 7,
//         label: "Level two 3-1",
//       },
//       {
//         id: 8,
//         label: "Level two 3-2",
//       },
//     ],
//   },
// ];
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
.search {
  padding: 0 20px 10px 20px;
}
::v-deep .el-tree-node__content {
  cursor: default;
}
</style>
