import { saveToken, storage } from './storage';
import axios from 'axios'
const qs = require('qs');

const BASE_URL = 'https://www.lemonlog.wang/api/shop';
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json;charset=utf-8'
};

const AUTH_PATH = [
    '/api/manage',
    '/api/user'
]

function shouldFilter(url) {
    for(let i in AUTH_PATH) {
        if(url.startsWith(AUTH_PATH[i])) return true
    }
    return false
}

function requestWithToken({ url, method, headers, params, data}) {
  return new Promise((resolve, reject) => {
    storage.load({key: 'token'}).then(token => {
      axios({
        method,
        url,
        headers: {...headers, token},
        data
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    }).catch(err => {
        // todo 没有找到，跳转登录
        reject(err)
    })
  })
};

/**
 * 请求 API 接口
 *
 * @param {Object} options
 * @param {string} options.url - 接口地址
 * @param {string} options.method - 请求类型
 * @param {Object} options.headers - 请求头
 * @param {Object} options.params - url 参数
 * @param {Object} options.data - 请求体数据
 */
export function request({ url, method, headers, params, data}) {
  let completeUrl = BASE_URL + url;
  if (params) {
    completeUrl = completeUrl + '?' + paramsSerializer(params);
  }
  console.log("发起请求：", completeUrl)
  if(shouldFilter(url)) {
    return requestWithToken({ url: completeUrl, method, headers, params, data})
  } else {
    return axios({url:completeUrl, method, headers, data})
  }
}

export function get(url, params) {
    return request({ url, params, method:'GET'})
}

export function post(url, data) {
  return request({url, data, method:'POST'})
}

export function uploadImg(img) {
  let formData = new FormData()
  formData.append("file", img)
  return request({
    method: 'POST',
    url: '/api/manage/resource/qiniu/upload',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

function paramsSerializer(params) {
    return qs.stringify(params, { arrayFormat: 'brackets' });
}
