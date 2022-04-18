import { request } from "./request";

export function getDeviceList(p) {
  return request({
    url: '/safety/list_device',
    params: {p}
  })
}

export function queryDevice(params) {
  return request({
    url: '/safety/search_device',
    params
  })
}

export function getWarningList(p) {
  return request({
    url: '/safety/list_warning',
    params: {p}
  })
}

export function queryWarning(params) {
  return request({
    url: '/safety/search_warning',
    params
  })
}

export function block(params) {
  return request({
    url: '/safety/block_flow',
    params
  })
}