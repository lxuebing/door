import React from 'react';
import {DeviceEventEmitter, Image, StyleSheet, Button, TouchableHighlight, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import homeIcon from '../images/icons/home.png';
import homeSelectedIcon from '../images/icons/homeSelected.png';
import categoryIcon from '../images/icons/category.png';
import categorySelectedIcon from '../images/icons/categorySelected.png';
import cartIcon from '../images/icons/cart.png';
import cartSelectedIcon from '../images/icons/cartSelected.png';
import userIcon from '../images/icons/user.png';
import userSelectedIcon from '../images/icons/userSelected.png';

import ProductMng from './ProductMng';
import CategoryMng from './CategoryMng';
import OrderMng from './OrderMng';
import UserMng from './UserMng';
import ProductEdit from './ProductEdit';

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
const Stack = createStackNavigator();

function ManageTab() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        // eslint-disable-next-line react/prop-types
        tabBarIcon: ({focused}) => {
          let iconName;

          if (route.name === 'ProductMng') {
            iconName = focused ? homeSelectedIcon : homeIcon;
          } else if (route.name === 'CategoryMng') {
            iconName = focused ? categorySelectedIcon : categoryIcon;
          } else if (route.name === 'OrderMng') {
            iconName = focused ? cartSelectedIcon : cartIcon;
          } else if (route.name === 'UserMng') {
            iconName = focused ? userSelectedIcon : userIcon;
          }
          return <Image source={iconName} style={styles.icon} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#5695D7',
        inactiveTintColor: '#000',
      }}>
      <Tab.Screen name="ProductMng" component={ProductMng} options={{title:'商品管理'}}/>
      <Tab.Screen name="CategoryMng" component={CategoryMng} options={{title:'品类管理'}}/>
      <Tab.Screen name="OrderMng" component={OrderMng} options={{title:'订单管理'}}/>
      <Tab.Screen name="UserMng" component={UserMng} options={{title:'我的'}}/>
    </Tab.Navigator>
  )
}

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
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="ManageTab" component={ManageTab} options={{title:'搜索'}}/>
            <Stack.Screen name="ProductEdit" component={ProductEdit} options={{title:'商品编辑'}}/>
          </Stack.Navigator>
        </NavigationContainer> 
      )
    }
  
};
