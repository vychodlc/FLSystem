import { request } from "./request";

export function getList(p) {
  console.log('当前请求页数：',p);
  return request({
    url: '/measure/list_measure',
    params: {p:p}
  })
}