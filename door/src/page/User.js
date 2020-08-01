import React from 'react';
import {StyleSheet, View, Image, ImageBackground, Text, TouchableHighlight} from 'react-native';
import avatar from '../images/images/avatar.jpg';

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
    padding: 10
  },
  linkButton: {
    color: 'blue'
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
  }
});

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {
        id: 1,
        username: 'zhangsan',
        nickname: '张三',
        role: 1
      },
      mode: '客户模式'
    };
  }

  onMenuSelected(menu) {
    console.log('选中菜单：', menu.name)
  }

  render() {
    let {userInfo, mode} = this.state
    return (
      <View>
        <ImageBackground style={styles.userInfo}
        source={require('../images/images/bk.jpg')}>
          <Image source={avatar} style={styles.avatar} />
          <View style={styles.userDetail}>
            <Text style={styles.text}>{userInfo.nickname}</Text>
            <Text style={styles.text}>{userInfo.username}</Text>
            {
              userInfo.role == 1 &&
              <Text style={styles.linkButton}>{mode}</Text>
            }
            
          </View>
        </ImageBackground>
        <TouchableHighlight onPress = { (e) => this.onMenuSelected({name: '我的订单'}) }>
          <View style={styles.menu}>
            <Text style={styles.menuText}>我的订单</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

User.propTypes = {};

export default User;
