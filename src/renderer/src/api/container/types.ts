export interface ContainerConfig {
  id: string
  name: string
  path: string
  type: number
  status: number
  config?: string
  params?: string
  remark?: string
}
