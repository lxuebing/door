import AsyncStorage from '@react-native-community/async-storage';
import Storage from 'react-native-storage';

export const storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: null
});

storage.save({
  key:'token',
  data:"eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIzIiwic3ViIjoidWRldiIsImlhdCI6MTU5NzA3OTY1OSwiZXhwIjoxNTk3MTA0ODU5fQ.03J4c1MChbJ7mczvxWwRwuMrFEb3Bqs12EdHdHMtBFw"
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