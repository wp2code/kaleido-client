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

export interface GitAccount {
  username: string
  password: string
}

export interface ContainerConfigWrapper {
  gitAccount?: GitAccount
  containerConfig: ContainerConfig
}

export enum RepositoryType {
  Local = 'Local',
  Remote = 'Remote',
  GitLab = 'GitLab',
}
