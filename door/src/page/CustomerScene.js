import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

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
import ProductList from './ProductList';
import Product from './Product';
import PlaceOrder from './PlaceOrder';
import Login from './Login';
import OrderDetail from './OrderDetail';

const styles = StyleSheet.create({
  icon: {
    width: 22,
    height: 22,
  },
});

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function CustomerTab() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        // eslint-disable-next-line react/prop-types
        tabBarIcon: ({focused}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? homeSelectedIcon : homeIcon;
          } else if (route.name === 'Category') {
            iconName = focused ? categorySelectedIcon : categoryIcon;
          } else if (route.name === 'ShoppingCart') {
            iconName = focused ? cartSelectedIcon : cartIcon;
          } else if (route.name === 'User') {
            iconName = focused ? userSelectedIcon : userIcon;
          }
          return <Image source={iconName} style={styles.icon} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#5695D7',
        inactiveTintColor: '#000',
      }}>
      <Tab.Screen name="Home" component={Home} options={{title:'首页'}} />
      <Tab.Screen name="Category" component={Category} options={{title:'分类'}} />
      <Tab.Screen name="ShoppingCart" component={ShoppingCart} options={{title:'购物车'}} />
      <Tab.Screen name="User" component={User} options={{title:'我的'}} />
    </Tab.Navigator>
  )
}

export default class MainScene extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            selectedTab: '检测',
        };
    }

    render() {
      return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="CustomerTab" component={CustomerTab} options={{title:'门业帮'}}/>
            <Stack.Screen name="ProductList" component={ProductList} options={{title:'商品列表'}}/>
            <Stack.Screen name="Product" component={Product} options={{title:'商品详情'}}/>
            <Stack.Screen name="PlaceOrder" component={PlaceOrder} options={{title:'下单'}}/>
            <Stack.Screen name="Login" component={Login} options={{title:'登录'}}/>
            <Stack.Screen name="OrderDetail" component={OrderDetail} options={{title:'订单详情'}}/>
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
  
};
