import { SelectDataTableData, DataSource } from '../datasource/types'
export interface CodeTemplate {
  id: string
  templateName: string
  language: string
  isInternal: number
  isDefault: number
  sourceType: number
  source?: string
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
  codePath?: string
  templateParams?: TemplateConfig
}

export interface CodeTemplateBasicConfig {
  author?: string
  codePath?: string
  license?: string
  applyTemplateList?: ApplyTemplateParam[]
}

export class ApplyTemplateParam {
  templateId: string
  codeTypeList?: Array<string>
  static mack(
    templateId: string,
    codeTypeList?: Array<string>
  ): ApplyTemplateParam {
    const p = new ApplyTemplateParam()
    p.templateId = templateId
    p.codeTypeList = codeTypeList || []
    return p
  }
}
export class PartitionTempate {
  templateId: string
  templateName: string
  sourceFolder: string
  packageName: string
  codePath?: string
  nameSuffix?: string
  superclassName?: string
  useLombok?: boolean
  useMybatisPlus?: boolean
  useSwagger?: boolean
  methodList?: Array<string>
  defaultIgFields?: Array<string>
}
export interface TemplateConfig {
  name?: string
  sourceFolder?: string
  codePath?: string
  packageName?: string
  configName?: string
  superclass?: Superclass
  implInterface?: string
  responseGenericClass?: string
  namespace?: string
  useLombok?: boolean
  useMybatisPlus?: boolean
  useSwagger?: boolean
  defaultIgFields?: Array<string>
  methodList?: Array<string>
}
export interface Superclass {
  name: string
  generics?: String[]
}
export abstract class BaseCodeView {
  name: string
  nameSuffix?: string
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
    param.nameSuffix = this.nameSuffix
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
  static replace(
    codeView: CodeGenerationView,
    view: MapperCodeView
  ): MapperCodeView {
    view.sourceFolder = codeView.sourceFolder
    view.useMybatisPlus = codeView.useMybatisPlus
    view.templateCode = codeView.templateCode
    view.packageName = codeView.packageName
    view.codePath = codeView.codePath
    view.name = codeView.name
    view.nameSuffix = codeView.nameSuffix
    return view
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
  static replace(codeView: CodeGenerationView, view: XmlCodeView): XmlCodeView {
    view.sourceFolder = codeView.sourceFolder
    view.useMybatisPlus = codeView.useMybatisPlus
    view.templateCode = codeView.templateCode
    view.packageName = codeView.packageName
    view.codePath = codeView.codePath
    view.name = codeView.name
    view.namespace = codeView.namespace
    return view
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
  static replace(
    codeView: CodeGenerationView,
    view: ServiceApiCodeView
  ): ServiceApiCodeView {
    view.sourceFolder = codeView.sourceFolder
    view.useMybatisPlus = codeView.useMybatisPlus
    view.superclassName = codeView.superclassName
    view.templateCode = codeView.templateCode
    view.packageName = codeView.packageName
    view.codePath = codeView.codePath
    view.name = codeView.name
    return view
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
  static replace(
    codeView: CodeGenerationView,
    view: ServiceCodeView
  ): ServiceCodeView {
    view.sourceFolder = codeView.sourceFolder
    view.useMybatisPlus = codeView.useMybatisPlus
    view.templateCode = codeView.templateCode
    view.superclassName = codeView.superclassName
    view.packageName = codeView.packageName
    view.codePath = codeView.codePath
    view.name = codeView.name
    return view
  }
}

export class WebCodeView extends BaseCodeView {
  superclassName: string
  useMybatisPlus: boolean
  useSwagger: boolean
  webMethodList?: Array<string>
  toCodeGenerationParam(): CodeGenerationParam {
    const param = super.toCodeGenerationParam()
    param.superclassName = this.superclassName
    param.useMybatisPlus = this.useMybatisPlus
    param.webMethodList = this.webMethodList
    param.useSwagger = this.useSwagger
    return param
  }
  static replace(codeView: CodeGenerationView, view: WebCodeView): WebCodeView {
    view.sourceFolder = codeView.sourceFolder
    view.useMybatisPlus = codeView.useMybatisPlus
    view.useSwagger = codeView.useSwagger
    view.templateCode = codeView.templateCode
    view.superclassName = codeView.superclassName
    view.packageName = codeView.packageName
    view.codePath = codeView.codePath
    view.name = codeView.name
    return view
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
  static replace(
    codeView: CodeGenerationView,
    view: EntityCodeView
  ): EntityCodeView {
    view.sourceFolder = codeView.sourceFolder
    view.useLombok = codeView.useLombok
    view.useMybatisPlus = codeView.useMybatisPlus
    view.useSwagger = codeView.useSwagger
    view.superclassName = codeView.superclassName
    view.templateCode = codeView.templateCode
    view.packageName = codeView.packageName
    view.codePath = codeView.codePath
    view.name = codeView.name
    return view
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
  static replace(codeView: CodeGenerationView, view: VoCodeView): VoCodeView {
    view.sourceFolder = codeView.sourceFolder
    view.useLombok = codeView.useLombok
    view.useSwagger = codeView.useSwagger
    view.superclassName = codeView.superclassName
    view.templateCode = codeView.templateCode
    view.packageName = codeView.packageName
    view.codePath = codeView.codePath
    view.name = codeView.name
    return view
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
  selected?: boolean
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
  nameSuffix?: string
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
  generationCodeFile?: Boolean
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
  nameSuffix?: string
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
  fileSuffix?: string
  useLombok: boolean
  useSwagger: boolean
  useMybatisPlus: boolean
  methodList?: Array<string>
  tableFieldColumnMap?: TableFieldColumn[]
}

export interface JavaTypeInfo {
  type: string
  simpleType: string
  classification?: string
}
