export interface CodeTemplate {
  id: string
  templateName: string
  language: string
  isInternal: number
  isDefault: number
  basicConfig?: CodeTemplateBasicConfig
  templateConfigList?: CodeTemplateConfig[]
}

export interface CodeTemplateConfig {
  id: string
  templateId: string
  name: string
  alias: string
  hideStatus: number
  configName: string
  templateContent: string
  templateParams?: TemplateConfig
}

export interface CodeTemplateBasicConfig {
  author?: string
  codePath?: string
  license?: string
}

export interface TemplateConfig {
  name?: string
  sourceFolder?: string
  codePath?: string
  packageName?: string
  configName?: string
  superclass?: string
  implInterface?: string
  responseGenericClass?: string
  namespace?: string
  lombok?: boolean
  mybatisPuls?: boolean
  swagger?: boolean
}

export interface ModelFieldMap {
  property: string
  javaType: string
  column: string
  jdbcType: string
  isEffect: boolean
}
