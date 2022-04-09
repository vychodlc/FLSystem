import { request } from "./request";

export function sendTask(params) {
  return request({
    url: '/measure/measure',
    params
  })
}

export function getList(p) {
  return request({
    url: '/measure/list_measure',
    params: {p:p}
  })
}

export function getFilterList(params) {
  return request({
    url: '/measure/search_measure',
    params
  })
}

export function getDetail(id) {
  return request({
    url: '/measure/detail',
    params: {mea_id:id}
  })
}

export function getForm(params) {
  // params.time = (new Date(params.time)).valueOf()/1000;
  params = {
    cycle: '4',
    business_name: '视频监控业务',
    cpe_ip: '10.112.15.59',
    business_ser_ip: '127.0.0.1',
    measure_type: 'delay',
    time: 1648602829
  }
  return request({
    url: '/measure/statistics',
    params
  })
}