import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';

import Home from '../page/home';
import User from '../page/user';
import ShoppingCart from '../page/shoppingCart';
import Category from '../page/category';

const dataSource = [
  {
    icon: require('../images/icons/home.png'),
    selectedIcon: require('../images/icons/homeSelected.png'),
    tabPage: 'Home',
    tabName: '首页',
    component: Home,
  },
  {
    icon: require('../images/icons/category.png'),
    selectedIcon: require('../images/icons/categorySelected.png'),
    tabPage: 'Category',
    tabName: '类别',
    component: Category,
  },
  {
    icon: require('../images/icons/cart.png'),
    selectedIcon: require('../images/icons/cartSelected.png'),
    tabPage: 'ShoppingCart',
    tabName: '购物车',
    component: ShoppingCart,
  },
  {
    icon: require('../images/icons/user.png'),
    selectedIcon: require('../images/icons/userSelected.png'),
    tabPage: 'User',
    tabName: '我的',
    component: User,
  },
];
let navigation = null;
type Props = {navigation: null};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  tabIcon: {
    width: 23,
    height: 23,
  },
});

export default class BottomTab extends React.Component<Props> {
  constructor(props) {
    super(props);
    navigation = this.props.navigation;
    this.state = {
      selectedTab: 'Home',
    };
  }

  render() {
    const tabViews = dataSource.map((item, i) => {
      return (
        <TabNavigator.Item
          title={item.tabName}
          selected={this.state.selectedTab === item.tabPage}
          renderIcon={() => <Image style={styles.tabIcon} source={item.icon} />}
          renderSelectedIcon={() => (
            <Image style={styles.tabIcon} source={item.selectedIcon} />
          )}
          onPress={() => {
            this.setState({selectedTab: item.tabPage});
          }}
          key={i}>
          <item.component navigation={navigation} />
        </TabNavigator.Item>
      );
    });
    return (
      <View style={styles.container}>
        <TabNavigator hidesTabTouch={true}>{tabViews}</TabNavigator>
      </View>
    );
  }
}

BottomTab.propTypes = {};
