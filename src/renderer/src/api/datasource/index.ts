import {
  DataSource,
  DataSourceMeta,
  Database,
  DataSourceQuery,
  ConnectionData,
  TableFieldColumnParam,
} from './types'
import { TableFieldColumn } from '../code/types'
import { AxiosPromise } from 'axios'
import request from '../request'

/**
 *
 * @param data
 * @returns
 */
export function addDataSource(data: DataSource) {
  return request({
    url: '/v1/datasource/add',
    method: 'post',
    data: data,
  })
}
/**
 *
 * @param id
 * @param data
 * @returns
 */
export function updateDataSource(
  id: string,
  data: DataSource
): AxiosPromise<Boolean> {
  return request({
    url: '/v1/datasource/' + id + '/update',
    method: 'put',
    data: data,
  })
}
/**
 *
 * @param queryParams
 * @returns
 */
export function listDataSource(
  queryParams?: DataSourceQuery
): AxiosPromise<DataSource[]> {
  return request({
    url: '/v1/datasource/list',
    method: 'post',
    data: queryParams || {},
  })
}
/**
 *
 * @param id
 * @returns
 */
export function getDataSourceDetail(id: string): AxiosPromise<DataSource> {
  return request({
    url: '/v1/datasource/' + id + '/get',
    method: 'get',
  })
}
/**
 *
 * @param id
 * @returns
 */
export function deleteDataSource(id: string) {
  return request({
    url: '/v1/datasource/' + id + '/delete',
    method: 'delete',
  })
}

/**
 *
 * @param id
 * @returns
 */
export function getDataSourceMeta(id: string): AxiosPromise<DataSourceMeta> {
  return request({
    url: `/v1/datasource/meta/${id}/info`,
    method: 'get',
  })
}
/**
 *
 * @param id
 * @returns
 */
export function getDataSourceMetaAll(id: string): AxiosPromise<DataSourceMeta> {
  return request({
    url: `/v1/datasource/meta/${id}/all/info`,
    method: 'get',
  })
}
/**
 *
 * @param data
 * @returns
 */
export function connectTestDataSource(data: DataSource): AxiosPromise<Boolean> {
  return request({
    url: '/v1/datasource/test/connect',
    method: 'post',
    data: data,
  })
}

/**
 * 打开连接
 *
 * @param id
 * @returns
 */
export function openConnectDataSource(
  id: string
): AxiosPromise<ConnectionData> {
  return request({
    url: `/v1/datasource/connect/${id}/open`,
    method: 'get',
  })
}
/**
 * 校验是否打开连接
 *
 * @param id
 * @returns
 */
export function checkConnectDataSourceIsOpen(id: string): AxiosPromise<string> {
  return request({
    url: `/v1/datasource/connect/${id}/checkOpen`,
    method: 'get',
  })
}
/**
 *  关闭其它连接
 *
 * @param connectionId
 * @returns
 */
export function closeOtherConnectDataSource(
  connectionId: string
): AxiosPromise<Boolean> {
  return request({
    url: `/v1/datasource/connect/other/${connectionId}/close`,
    method: 'delete',
  })
}
/**
 *  关闭当前连接
 *
 * @param connectionId
 * @returns
 */
export function closeCurrentConnectDataSource(
  connectionId: string
): AxiosPromise<Boolean> {
  return request({
    url: `/v1/datasource/connect/current/${connectionId}/close`,
    method: 'delete',
  })
}
/**
 * 打开数据库
 *
 * @param connectionId
 * @param databaseName
 * @returns
 */
export function openDataBase(
  connectionId: string,
  databaseName: string
): AxiosPromise<Database> {
  return request({
    url: `/v1/datasource/db/${connectionId}/${databaseName}/open`,
    method: 'get',
  })
}

/**
 * 关闭数据库
 *
 * @param id
 * @returns
 */
export function closeDataBase(
  connectionId: string,
  databaseName: string
): AxiosPromise<Boolean> {
  return request({
    url: `/v1/datasource/db/${connectionId}/${databaseName}/close`,
    method: 'delete',
  })
}
/**
 * 获取连接的数据源
 *
 * @param connectionId
 * @returns
 */
export function getDataSourceByConnectionId(
  connectionId: string
): AxiosPromise<DataSource> {
  return request({
    url: `/v1/datasource/connection/${connectionId}`,
    method: 'get',
  })
}

/**
 * 获取连接的数据源
 *
 * @param connectionId
 * @returns
 */
export function getTableFieldColumnList(
  param: TableFieldColumnParam
): AxiosPromise<TableFieldColumn[]> {
  return request({
    url: `/v1/datasource/table/column/fields`,
    method: 'post',
    data: { ...param },
  })
}
