import { storage } from './storage';
import {DeviceEventEmitter} from 'react-native'
import axios from 'axios'
import { WToast } from 'react-native-smart-tip';
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
    // for(let i in AUTH_PATH) {
    //     if(url.startsWith(AUTH_PATH[i])) return true
    // }
    return true
}

function doRequest({ url, method, headers, data, callback, fail}) {
  axios({ url, method, headers, data, callback}).then(res => {
    let data = res.data 
    if(data.code === 0) {
      callback(data)
    } else if(data.code === 100401) {
      WToast.show({data: data.msg})
      if(fail) fail(res)
    } else {
      WToast.show({data: data.data})
      if(fail) fail(res)
    }
  }).catch(err => {
    console.log('请求出错:', err)
    WToast.show({data: '请求出错'})
    if(fail) fail(err)
  })
}

export function request({ url, method, headers, params, data}, callback, fail, navigation) {
  let completeUrl = BASE_URL + url;
  if (params) {
    completeUrl = completeUrl + '?' + paramsSerializer(params);
  }
  console.log("发起请求：", completeUrl)
  if(shouldFilter(url)) {
    storage.load({key: 'token'}).then(token => {
      doRequest({url: completeUrl, method, 
        headers: {...headers, token},
        data, callback, fail})
    }).catch(err => {
      console.log("未找到", err)
      WToast.show({data: '您还没有登录'})
      if(fail) fail(err)
    })
  } else {
    doRequest({url: completeUrl, method, headers, data, callback, fail})
  }
  
}

export function get(url, params, callback, fail, navigation) {
    return request({ url, params, method:'GET'}, callback, fail, navigation)
}

export function post(url, data, callback, fail, navigation) {
  return request({url, data, method:'POST'}, callback, fail, navigation)
}

export function uploadImg(img, callback) {
  console.log("source:" + img)
  DeviceEventEmitter.emit('loading', {msg: "图片上传中..."})
  let formData = new FormData()
  formData.append("file", img)
  request({
    method: 'POST',
    url: '/api/manage/resource/qiniu/upload',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  }, res => {
    console.log("上传结果", res)
    DeviceEventEmitter.emit('dismis', {})
    callback(res)
  }, err => {
    console.log('图片上传失败')
    WToast.show({data: '上传失败，' + err.message})
    DeviceEventEmitter.emit('dismis', {})
  })
}

function paramsSerializer(params) {
    return qs.stringify(params, { arrayFormat: 'brackets' });
}
