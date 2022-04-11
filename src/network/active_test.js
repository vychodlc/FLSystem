import { request } from "./request";

export function sendTask(list) {
  let formData = new FormData();
  formData.append('data',list)
  return request({
    method: 'POST',
    url: '/measure/measure',
    data: formData
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
  console.log(params);
  // params.time = (new Date(params.time)).valueOf()/1000;
  params = {
    cycle: params.cycle,
    business_name: '视频监控业务',
    cpe_ip: '10.112.15.59',
    business_ser_ip: '127.0.0.1',
    measure_type: params.measure_type,
    start_time: 1648602829
  }
  return request({
    url: '/measure/statistics',
    params
  })
}