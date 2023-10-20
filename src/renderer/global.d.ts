// GlobalComponents for Volar
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $msgBoxUtil: typeof import('@/utils/MessageBox').default
  }
}
export {}
