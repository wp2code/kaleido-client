/** @format */

import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import viteCompression from "vite-plugin-compression";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from "path";
// 引入Unocss
import UnoCSS from "unocss/vite";
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type

const pathSrc = path.resolve(__dirname, "src/renderer/src");
console.log(pathSrc);
export default ({ command }) => {
  console.log(command);
  return defineConfig({
    main: {
      plugins: [externalizeDepsPlugin()],
    },
    preload: {
      plugins: [externalizeDepsPlugin()],
    },
    renderer: {
      resolve: {
        alias: {
          "@": pathSrc,
          "~": resolve("src"),
        },
      },
      css: {
        // CSS 预处理器
        preprocessorOptions: {
          //define global scss variable
          scss: {
            javascriptEnabled: true,
            additionalData: `
              @use "@/styles/variables.scss" as *;
            `,
          },
        },
      },
      server: {
        host: true,
        port: 1027,
        cors: true,
        https: false,
        strictPort: true,
        open: false,
        proxy: {
          "/api": {
            target: "http://localhost:3000/api",
            changeOrigin: true,
            rewrite: (path: any) => path.replace(/^\/api/, ""), // 不可以省略rewrite
          },
        },
      },
      plugins: [
        vue(),
        vueJsx(),
        AutoImport({
          // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
          imports: ["vue", "@vueuse/core"],
          resolvers: [
            // 自动导入 Element Plus 组件
            ElementPlusResolver(),
            // 自动导入图标组件
            IconsResolver({}),
          ],
          vueTemplate: true,
          dts: false,
          // dts: "src/renderer/auto-imports.d.ts",
          eslintrc: {
            enabled: true, // Default `false`
            filepath: "./.eslintrc-auto-import.json", // Default `./.eslintrc-auto-import.json`
            globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
          },
        }),
        Components({
          resolvers: [
            // 自动导入 Element Plus 组件
            ElementPlusResolver(),
            // 自动注册图标组件
            IconsResolver({
              enabledCollections: ["ep"],
            }),
          ],
          // 指定自定义组件位置(默认:src/renderer/src/components)
          dirs: ["src/**/components", "src/components"],
          // 配置文件位置(false:关闭自动生成)
          dts: true,
          // dts: "src/renderer/components.d.ts",
        }),
        Icons({
          autoInstall: true,
        }),
        createSvgIconsPlugin({
          // 指定需要缓存的图标文件夹
          iconDirs: [resolve(pathSrc, "assets/icons")],
          // 指定symbolId格式
          symbolId: "icon-[dir]-[name]",
        }),
        //https://github.com/antfu/unocss
        UnoCSS({}),
        // 代码压缩
        viteCompression({
          verbose: true, // 默认即可
          disable: true, // 是否禁用压缩，默认禁用，true为禁用,false为开启，打开压缩需配置nginx支持
          deleteOriginFile: true, // 删除源文件
          threshold: 10240, // 压缩前最小文件大小
          algorithm: "gzip", // 压缩算法
          ext: ".gz", // 文件类型
        }),
      ],
      optimizeDeps: {
        include: [
          "vue",
          "vue-router",
          "pinia",
          "axios",
          "vue-i18n",
          "path-to-regexp",
          "element-plus/es/components/form/style/css",
          "element-plus/es/components/form-item/style/css",
          "element-plus/es/components/button/style/css",
          "element-plus/es/components/input/style/css",
          "element-plus/es/components/input-number/style/css",
          "element-plus/es/components/switch/style/css",
          "element-plus/es/components/upload/style/css",
          "element-plus/es/components/menu/style/css",
          "element-plus/es/components/col/style/css",
          "element-plus/es/components/icon/style/css",
          "element-plus/es/components/row/style/css",
          "element-plus/es/components/tag/style/css",
          "element-plus/es/components/dialog/style/css",
          "element-plus/es/components/loading/style/css",
          "element-plus/es/components/radio/style/css",
          "element-plus/es/components/radio-group/style/css",
          "element-plus/es/components/popover/style/css",
          "element-plus/es/components/scrollbar/style/css",
          "element-plus/es/components/tooltip/style/css",
          "element-plus/es/components/dropdown/style/css",
          "element-plus/es/components/dropdown-menu/style/css",
          "element-plus/es/components/dropdown-item/style/css",
          "element-plus/es/components/sub-menu/style/css",
          "element-plus/es/components/menu-item/style/css",
          "element-plus/es/components/divider/style/css",
          "element-plus/es/components/card/style/css",
          "element-plus/es/components/link/style/css",
          "element-plus/es/components/breadcrumb/style/css",
          "element-plus/es/components/breadcrumb-item/style/css",
          "element-plus/es/components/table/style/css",
          "element-plus/es/components/tree-select/style/css",
          "element-plus/es/components/table-column/style/css",
          "element-plus/es/components/select/style/css",
          "element-plus/es/components/option/style/css",
          "element-plus/es/components/pagination/style/css",
          "element-plus/es/components/tree/style/css",
          "element-plus/es/components/alert/style/css",
        ],
      },
    },
  });
};
