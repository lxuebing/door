import React from 'react';
import {DeviceEventEmitter, Image, StyleSheet, Button, TouchableHighlight, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import homeIcon from '../images/icons/home.png';
import homeSelectedIcon from '../images/icons/homeSelected.png';
import categoryIcon from '../images/icons/category.png';
import categorySelectedIcon from '../images/icons/categorySelected.png';
import cartIcon from '../images/icons/cart.png';
import cartSelectedIcon from '../images/icons/cartSelected.png';
import userIcon from '../images/icons/user.png';
import userSelectedIcon from '../images/icons/userSelected.png';

import Home from './Home';
import Category from './Category';
import ShoppingCart from './ShoppingCart';
import User from './User';

const styles = StyleSheet.create({
  icon: {
    width: 22,
    height: 22,
  },
  linkButton: {
    color: 'blue'
  },
});

const Tab = createBottomTabNavigator();

export default class ManageScene extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            selectedTab: '检测',
        };
    }

    switchMode() {
      console.log("change mode")
      this.setState({
        mode: (this.state.mode + 1) % 2
      })
      DeviceEventEmitter.emit('switchMode', {})
    }

    render() {
        return (
          <>
            <Text>管理模式</Text>
            <TouchableHighlight onPress={ (e) => this.switchMode() }>
              <Text style={styles.linkButton}>切换至客户模式</Text>
            </TouchableHighlight>
      
            {/* <NavigationContainer>
              <Tab.Navigator
                screenOptions={({route}) => ({
                  // eslint-disable-next-line react/prop-types
                  tabBarIcon: ({focused}) => {
                    let iconName;
        
                    if (route.name === '首页') {
                      iconName = focused ? homeSelectedIcon : homeIcon;
                    } else if (route.name === '分类') {
                      iconName = focused ? categorySelectedIcon : categoryIcon;
                    } else if (route.name === '购物车') {
                      iconName = focused ? cartSelectedIcon : cartIcon;
                    } else if (route.name === '我的') {
                      iconName = focused ? userSelectedIcon : userIcon;
                    }
                    return <Image source={iconName} style={styles.icon} />;
                  },
                })}
                tabBarOptions={{
                  activeTintColor: '#5695D7',
                  inactiveTintColor: '#000',
                }}>
                <Tab.Screen name="首页" component={Home} />
                <Tab.Screen name="分类" component={Category} />
                <Tab.Screen name="购物车" component={ShoppingCart} />
                <Tab.Screen name="我的" component={User} />
              </Tab.Navigator>
            </NavigationContainer> */}

            </>
          )
    }
  
};
