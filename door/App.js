/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';

import Home from './src/page/home';
import Category from './src/page/category';
import ShoppingCart from './src/page/shoppingCart';
import User from './src/page/user';

const Tab = createBottomTabNavigator();
const App: () => React$Node = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="首页" component={Home} />
        <Tab.Screen name="分类" component={Category} />
        <Tab.Screen name="购物车" component={ShoppingCart} />
        <Tab.Screen name="我的" component={User} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
