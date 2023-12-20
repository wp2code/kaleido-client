import { DataSource, DataSourceMeta, DataSourceQuery } from './types'
import { AxiosPromise } from 'axios'
import request from '../request'

/**
 *
 * @param data
 * @returns
 */
export function addDataSource(data: DataSource) {
  return request({
    url: '/api/v1/datasource/add',
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
    url: '/api/v1/datasource/' + id + '/update',
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
    url: '/api/v1/datasource/list',
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
    url: '/api/v1/datasource/' + id + '/get',
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
    url: '/api/v1/datasource/' + id + '/delete',
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
    url: `/api/v1/datasource/meta/${id}/info`,
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
    url: `/api/v1/datasource/meta/${id}/all/info`,
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
    url: '/api/v1/datasource/test/connect',
    method: 'post',
    data: data,
  })
}
