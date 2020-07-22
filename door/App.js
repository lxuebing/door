/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import homeIcon from './src/images/icons/home.png';
import homeSelectedIcon from './src/images/icons/homeSelected.png';
import categoryIcon from './src/images/icons/category.png';
import categorySelectedIcon from './src/images/icons/categorySelected.png';
import cartIcon from './src/images/icons/cart.png';
import cartSelectedIcon from './src/images/icons/cartSelected.png';
import userIcon from './src/images/icons/user.png';
import userSelectedIcon from './src/images/icons/userSelected.png';

import Home from './src/page/home';
import Category from './src/page/category';
import ShoppingCart from './src/page/shoppingCart';
import User from './src/page/user';

const styles = StyleSheet.create({
  icon: {
    width: 22,
    height: 22,
  },
});

const Tab = createBottomTabNavigator();

const App: () => React$Node = () => {
  return (
    <NavigationContainer>
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
    </NavigationContainer>
  );
};

export default App;
