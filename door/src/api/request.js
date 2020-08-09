import { saveToken, storage } from './storage';
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
        fetch(url, {method, headers:{...headers, token}, body: data})
        .then(response => {
            return response.json()
        })
        .then(res => {
            resolve(res)
        })
        .catch(err => {
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
  
  if(shouldFilter(url)) {
    return requestWithToken({ completeUrl, method, headers, params, data})
  } else {
    return fetch(completeUrl, {method, headers, body: data})
    .then(response => {
        return response.json()
    })
  }
}

export function get(url, params) {
    return request({ url, params, method:'GET'})
}
  
/**
 * 请求参数序列化
 *
 * @param {Object} params - 请求参数
 * @returns {string}
 */
function paramsSerializer(params) {
    return qs.stringify(params, { arrayFormat: 'brackets' });
}