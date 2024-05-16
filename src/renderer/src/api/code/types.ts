import { SelectDataTableData, DataSource } from '../datasource/types'
export interface CodeTemplate {
  id: string
  templateName: string
  language: string
  isInternal: number
  isDefault: number
  basicConfig?: string
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

export abstract class BaseCodeView {
  name: string
  sourceFolder: string
  packageName: string
  templateCode: string
  codePath: string
  codeOutPath: string
  codeType: string
  toCodeGenerationParam(): CodeGenerationParam {
    const param = new CodeGenerationParam()
    param.codePath = this.codePath
    param.configName = this.codeType
    param.name = this.name
    param.packageName = this.packageName
    param.sourceFolder = this.sourceFolder
    return param
  }
}

export class MapperCodeView extends BaseCodeView {
  superclassName: string
  useMybatisPlus: boolean
  methodList?: Array<string>
  toCodeGenerationParam(): CodeGenerationParam {
    const param = super.toCodeGenerationParam()
    param.superclassName = this.superclassName
    param.useMybatisPlus = this.useMybatisPlus
    param.methodList = this.methodList
    return param
  }
}

export class XmlCodeView extends BaseCodeView {
  namespace: string
  useMybatisPlus?: boolean
  methodList?: Array<string>
  toCodeGenerationParam(): CodeGenerationParam {
    const param = super.toCodeGenerationParam()
    param.methodList = this.methodList
    param.namespace = this.namespace
    param.useMybatisPlus = this.useMybatisPlus
    return param
  }
}
export class ServiceApiCodeView extends BaseCodeView {
  superclassName: string
  useMybatisPlus: boolean
  toCodeGenerationParam(): CodeGenerationParam {
    const param = super.toCodeGenerationParam()
    param.superclassName = this.superclassName
    param.useMybatisPlus = this.useMybatisPlus
    return param
  }
}
export class ServiceCodeView extends BaseCodeView {
  superclassName: string
  useMybatisPlus: boolean
  implInterfaceName: string
  toCodeGenerationParam(): CodeGenerationParam {
    const param = super.toCodeGenerationParam()
    param.superclassName = this.superclassName
    param.useMybatisPlus = this.useMybatisPlus
    param.implInterfaceName = this.implInterfaceName
    return param
  }
}

export class WebCodeView extends BaseCodeView {
  superclassName: string
  useMybatisPlus: boolean
  useSwagger: boolean
  toCodeGenerationParam(): CodeGenerationParam {
    const param = super.toCodeGenerationParam()
    param.superclassName = this.superclassName
    param.useMybatisPlus = this.useMybatisPlus
    param.useSwagger = this.useSwagger
    return param
  }
}

export class EntityCodeView extends BaseCodeView {
  useLombok: boolean
  useSwagger: boolean
  useMybatisPlus: boolean
  primaryKey?: string
  superclassName: string
  tableFieldColumnMap?: TableFieldColumn[]
  public toCodeGenerationParam(): CodeGenerationParam {
    const param = super.toCodeGenerationParam()
    param.useLombok = this.useLombok
    param.useSwagger = this.useSwagger
    param.useMybatisPlus = this.useMybatisPlus
    param.superclassName = this.superclassName
    param.tableFieldColumnList = this.tableFieldColumnMap.filter(
      (item) => item.selected
    )
    return param
  }
}
export class VoCodeView extends BaseCodeView {
  useLombok: boolean
  useSwagger: boolean
  superclassName: string
  tableFieldColumnMap?: TableFieldColumn[]
  toCodeGenerationParam(): CodeGenerationParam {
    const param = super.toCodeGenerationParam()
    param.useLombok = this.useLombok
    param.useSwagger = this.useSwagger
    param.superclassName = this.superclassName
    param.tableFieldColumnList = this.tableFieldColumnMap.filter(
      (item) => item.selected
    )
    return param
  }
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
  dataType: Number
  property: string
  javaType: string
  javaTypeSimpleName: string
  primaryKey: Boolean
  selected?: Boolean
  static mack(v: TableFieldColumn): TableFieldColumn {
    const tableFieldColumn = new TableFieldColumn()
    tableFieldColumn.column = v.column
    tableFieldColumn.jdbcType = v.jdbcType
    tableFieldColumn.dataType = v.dataType
    tableFieldColumn.primaryKey = v.primaryKey
    tableFieldColumn.comment = v.comment
    tableFieldColumn.property = v.property
    tableFieldColumn.javaType = v.javaType
    tableFieldColumn.javaTypeSimpleName =
      TableFieldColumn.getJavaTypeSimpleName(v.javaType)
    return tableFieldColumn
  }
  static getJavaTypeSimpleName(javaType: string): string {
    return javaType.substring(javaType.lastIndexOf('.') + 1)
  }
}

export class CodeGenerationParam {
  configName: string
  tableName: string
  name: string
  tableComment: string
  templateName: string
  codePath: string
  packageName: string
  sourceFolder: string
  dataBaseName?: string
  schemaName?: string
  superclassName?: string
  useLombok?: Boolean
  namespace?: string
  implInterfaceName?: string
  useSwagger?: Boolean
  useMybatisPlus?: Boolean
  responseGenericClass?: Boolean
  methodList?: Array<string>
  webMethodList?: Array<string>
  tableFieldColumnList?: Array<TableFieldColumn>
  dataSource?: DataSource
  selectCodeTemplate?: CodeTemplate
  responseTemplateCodeList?: Array<string>
  static mack(
    tableData: SelectDataTableData,
    selectCodeTemplate: CodeTemplate,
    configName: string,
    tableFieldColumnList: TableFieldColumn[] = []
  ): CodeGenerationParam {
    const param = new CodeGenerationParam()
    param.tableName = tableData.table?.tableName
    param.tableComment = tableData.table?.comment
    param.schemaName = tableData.table?.schemaName
    param.dataBaseName = tableData.table?.dataBaseName
    param.configName = configName
    param.tableFieldColumnList = tableFieldColumnList
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
  namespace: string
  codeType: string
  primaryKey?: string
  useLombok: boolean
  useSwagger: boolean
  useMybatisPlus: boolean
  tableFieldColumnMap?: TableFieldColumn[]
}

export interface JavaTypeInfo {
  type: string
  simpleType: string
  classification?: string
}
