import React from 'react';
import {DeviceEventEmitter, StyleSheet, View, Image, Button, ImageBackground, Text, TouchableHighlight} from 'react-native';
import avatar from '../images/icons/user.png'
import login from '../images/icons/login.png'
import {removeToken} from '../api/storage'
import axios from 'axios';
import { storage } from '../api/storage';
import { WToast } from 'react-native-smart-tip';

const styles = StyleSheet.create({
  text: {
    color: '#000',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: 'white',
    backgroundColor: 'silver',
  },
  userInfo: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomColor: 'silver',
    borderBottomWidth: 1,
    height: 200,
    flexDirection: 'row',
    
  },
  userDetail: {
    padding: 10,
    flex: 1
  },
  nickname: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  linkButton: {
    color: 'blue',
    fontWeight: 'bold'
  },
  menu: {
    height: 60,
    paddingLeft: 20,
    backgroundColor: 'white',
    borderBottomColor: 'silver',
    borderBottomWidth: 1,
    justifyContent: 'center'
  },
  menuText: {
    fontSize: 25,
  },
  mode: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 5,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
});

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {
        id: -1,
        nickname: "游客",
        username: "anonymous"
      }
    };
  }

  getProfile() {
    storage.load({key: 'token'}).then(token => {
      axios.get('https://www.lemonlog.wang/user/api/profile', {headers: {token}})
      .then(res => {
        let data = res.data
        console.log("用户信息", data)
        if(data.code === 100401) {
          WToast.show({data: "您还没有登录~"})
        } else {
          this.setState({
            userInfo: data.data
          })
        }
      })
      .catch( err => {
        console.log("获取用户信息失败", err)
      })
    }).catch(err => {
      console.log("未找到", err)
      WToast.show({data: '您还没有登录'})
    })
    
  }

  onMenuSelected(menu) {
    console.log('选中菜单：', menu.name)
  }

  switchMode() {
    console.log("change mode")
    this.setState({
      mode: (this.state.mode + 1) % 2
    })
    DeviceEventEmitter.emit('switchMode', {})
  }

  logout() {
    removeToken()
    this.setState({userInfo:{}})
    this.props.navigation.navigate('Login')
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.getProfile()
    })
  }

  componentWillUnmount() {
    this.setState = ()=>false;
  }

  render() {
    let {userInfo, mode} = this.state
    return (
      <View>
        <ImageBackground style={styles.userInfo}
        source={require('../images/images/bk.jpg')}>
          <Image source={ userInfo.avatar ? {uri: userInfo.avatar}:avatar} style={styles.avatar} />
          <View style={styles.userDetail}>
            <Text style={styles.nickname}>{userInfo && userInfo.nickname}</Text>
            <Text style={styles.username}>{userInfo && userInfo.username}</Text>
            {
              userInfo && userInfo.role == 10 &&
              <>
              <View style={styles.mode}>
                <Text style={{color: "black", fontSize: 16, fontWeight: 'bold'}}>客户模式</Text>
                <TouchableHighlight onPress={ (e) => this.switchMode() }>
                  <Text style={styles.linkButton} >切换至管理模式</Text>
                </TouchableHighlight>
              </View>
              </>
            }
            
          </View>
          <View style={{padding: 10}} >
              <Button title={userInfo && userInfo.id > 0 ? "退出登录" : "登录"} onPress={ (e) => this.logout() }/>
          </View>
        </ImageBackground>
        <TouchableHighlight onPress = { (e) => this.onMenuSelected({name: '我的订单'}) }>
          <View style={styles.menu}>
            <Text style={styles.menuText}>个人信息</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

export default User;
