// 系统设置
interface DefaultSettings {
  /**
   * 系统title
   */
  title: string
  /**
   * 主题模式
   */
  theme: string

  /**
   * 布局大小
   */
  size: string
  /**
   * log展示
   */
  sidevarLogo: boolean
  /**
   * 语言
   */
  language: string
}

const defaultSettings: DefaultSettings = {
  title: 'Kaleido',
  sidevarLogo: true,
  /**
   *  主题模式
   *
   * dark:暗黑模式
   * light: 明亮模式
   */
  theme: 'dark',
  size: 'default', // default |large |small
  language: 'zh-cn', // zh-cn| en
}

export default defaultSettings
