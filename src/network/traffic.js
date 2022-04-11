import { request } from "./request";

export function overview() {
  return request({
    url: '/traffic/overview',
  })
}