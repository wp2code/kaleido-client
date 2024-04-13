import { SelectDataTableData, DataSource } from '../datasource/types'

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

abstract class BaseCodeView {
  name: string
  sourceFolder: string
  packageName: string
  templateCode: string
  codePath: string
  codeOutPath: string
  codeType: string
}

export class VoCodeView extends BaseCodeView {
  useLombok: boolean
  useSwagger: boolean
  superclassName: string
  tableFieldColumnMap?: TableFieldColumn[]
}

export class MapperCodeView extends BaseCodeView {
  superclassName: string
  useMybatisPlus: boolean
}

export class XmlCodeView extends BaseCodeView {
  namespace: string
}
export class ServiceApiCodeView extends BaseCodeView {
  superclassName: string
  useMybatisPlus: boolean
  supperInterfaceName: string
}
export class ServiceCodeView extends BaseCodeView {
  superclassName: string
  useMybatisPlus: boolean
  implInterface: string
}

export class WebCodeView extends BaseCodeView {
  superclassName: string
  useMybatisPlus: boolean
  useSwagger: boolean
}

export class EntityCodeView extends BaseCodeView {
  useLombok: boolean
  useSwagger: boolean
  useMybatisPlus: boolean
  primaryKey?: string
  superclassName: string
  tableFieldColumnMap?: TableFieldColumn[]
}

export class ModelCodeViewWapper {
  vo: VoCodeView
  entity: EntityCodeView
  constructor(vo: VoCodeView, entity: EntityCodeView) {
    this.vo = vo
    this.entity = entity
  }
}

export class GenerationCodeParam {
  templateId: string
  codeGenerationList: []
}
export class TableFieldColumn {
  comment: string
  column: string
  jdbcType: string
  jdbcTypeCode: Number
  xmlJdbcType: string
  property: string
  javaType: string
  javaTypeSimpleName: string
  primaryKey: Boolean
}

export class CodeGenerationParam {
  configName: string
  tableName: string
  name: string
  templateName: string
  tableComment: string
  schemaName: string
  codePath: string
  packageName: string
  sourceFolder: string
  superclassName: string
  useLombok: Boolean
  useSwagger?: Boolean
  useMybatisPlus?: Boolean
  responseGenericClass?: Boolean
  methodList?: Array<string>
  webMethodList?: Array<string>
  tableFieldColumnList?: Array<TableFieldColumn>
  dataSource?: DataSource
  selectCodeTemplate?: CodeTemplate
  static mack(
    tableData: SelectDataTableData,
    selectCodeTemplate: CodeTemplate,
    configName: string
  ): CodeGenerationParam {
    const param = new CodeGenerationParam()
    param.tableName = tableData.table?.tableName
    param.tableComment = tableData.table?.comment
    param.schemaName = tableData.table?.schemaName
    param.configName = configName
    param.tableFieldColumnList = []
    param.dataSource = tableData.dataSource
    param.selectCodeTemplate = selectCodeTemplate
    return param
  }
}
export interface CodeGenerationResult {
  templateInfo?: CodeTemplate
  codeGenerationList: CodeGenerationView[]
}

export interface CodeGenerationView {
  name: string
  sourceFolder: string
  codePath: string
  packageName: string
  templateCode: string
  superclassName: string
  codeOutPath: string
  supperInterfaceName: string
  implInterfaceName: string
  codeType: string
  primaryKey?: string
  useLombok: boolean
  useSwagger: boolean
  useMybatisPlus: boolean
}
