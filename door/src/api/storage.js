import AsyncStorage from '@react-native-community/async-storage';
import Storage from 'react-native-storage';

export const storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: null
});

storage.save({
  key:'token',
  data:"eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIzIiwic3ViIjoidWRldiIsImlhdCI6MTU5Njk3Nzg4NCwiZXhwIjoxNTk3MDAzMDg0fQ.f2Yd5uSOpE3EWG8wNfrOK7BY3oJZvI5RiLX2zEr6-5Y"
})

/**
 * 客户端缓存保存 token 数据
 * @param {string} data.access_token
 */
export function saveToken(access_token) {
  storage.save({
    key: 'token',
    data: access_token
  });
}

export function removeTokens() {
  storage.remove({
    key: 'token'
  });
}