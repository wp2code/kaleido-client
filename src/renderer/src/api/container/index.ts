import { AxiosPromise } from 'axios'
import request from '../request'
import { ContainerConfig } from './types'

/**
 *
 * @param queryParams
 * @returns
 */
export function listContainerConfig(
  queryParams?: any
): AxiosPromise<ContainerConfig[]> {
  return request({
    url: '/v1/container-config/list',
    method: 'post',
    data: queryParams || {},
  })
}
/**
 *
 * @param queryParams
 * @returns
 */
export function getContainerConfig(id: string): AxiosPromise<ContainerConfig> {
  return request({
    url: `/v1/container-config/${id}/info`,
    method: 'get',
  })
}
/**
 *
 * @param queryParams
 * @returns
 */
export function deleteContainerConfig(id: string): AxiosPromise<Boolean> {
  return request({
    url: `/v1/container-config/${id}/delete`,
    method: 'delete',
  })
}
/**
 *
 * @param queryParams
 * @returns
 */
export function updateContainerConfig(
  id: string,
  param: ContainerConfig
): AxiosPromise<Boolean> {
  return request({
    url: `/v1/container-config/${id}/udpate`,
    method: 'put',
    data: param || {},
  })
}
