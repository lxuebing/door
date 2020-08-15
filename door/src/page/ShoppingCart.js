import React from 'react'
import {StyleSheet, Button, View, Image, ScrollView, TouchableHighlight, Text, ViewPagerAndroid} from 'react-native'
import {formatTime} from '../utils/DateUtil'
import {get, post, } from '../api/request';
import {WToast} from 'react-native-smart-tip'
import RefreshListView, { RefreshState } from "react-native-refresh-list-view"

const styles = StyleSheet.create({
  text: {
    color: 'black',
  },
  orderList: {
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  listItem: {
    borderColor: 'silver',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
    marginBottom: 5,
    flexDirection: 'row'
  },
  productImg: {
    width: 100,
    height: 100
  },
  productDetail: {
    flex: 1,
  },
  productName: {
    fontSize: 24
  },
  productPrice: {
    fontSize: 20,
    color: 'red',
  },
  received: {
    color: 'green'
  }
});

class ShoppingCart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshState: RefreshState.Idle,
      orderList: [
      ]
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.loadMore()
    })
  }

  componentWillUnmount() {
    this.setState = ()=>false;
  }

  loadMore(startId) {
    let {orderList} = this.state
    let query = {
      limit: 10,
      startId
    }
    get('/api/user/order/list', query, res => {
      console.log("订单列表", res)
      let data = res.data
      if(data.length === 0) {
        WToast.show({data: '没有更多了'})
        return
      } 
      this.setState({
        orderList: startId ? orderList.concat(data): data
      })
    })
  }

  getLastId() {
    let orderList = this.state.orderList
    if(orderList && orderList.length > 0) {
      return orderList[orderList.length-1].id
    } else {
      return 0
    }
  }

  onHeaderRefresh() {
    console.log("下拉刷新")
    this.loadMore()
  }

  onFooterRefresh() {
    console.log("加载更多")
    this.loadMore(this.getLastId())
  }

  onItemClicked(item) {
    console.log("点击订单：", item)
    this.props.navigation.navigate('OrderDetail', {orderId: item.id})
  }

  placeOrder(item) {
    console.log("下单", item)
    get('/api/user/order/place', {orderId: item.id}, res => {
      console.log("下单结果",res.data)
      WToast.show({data: res.data.data})
      this.loadMore()
    })
  }

  getStatus(item){
    if(item.status === 0) {
      return (<Text style={{}}>{'未下单'}</Text>)
    }
    if(item.status === 1) {
      return (<Text style={{}}>{'已下单'}</Text>)
    }
    if(item.status === 2) {
      return (<Text style={{}}>{'出货中'}</Text>)
    }
    if(item.status === 3) {
      return (<Text style={{color:'green'}}>{'已签收'}</Text>)
    }
  }

  renderCell(item) {
    return (
      <TouchableHighlight onPress={() => {this.onItemClicked(item)}}>
        <View style={styles.listItem}>
          <Image
            style={styles.productImg}
            source={{uri: item.productImg}}
          />
          <View style={styles.productDetail}>
            <Text style={styles.productName}>{item.productName}</Text>
            <View style={{...styles.row, flex: 1}}>
              <Text style={styles.productPrice}>￥{item.price}</Text>
              <Text>数量：{item.count}</Text>
              <Text>{formatTime(item.createTime)}</Text>
            </View>
            <View style={styles.row}>
              { this.getStatus(item)}
              { item.status === 0 && <Button title="下单" onPress={() => this.placeOrder(item)}/>}
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  render() {
    let {orderList, refreshState} = this.state
    return (
      <RefreshListView data={orderList} 
        refreshState={refreshState} 
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => this.renderCell(item)}
        onHeaderRefresh={() => this.onHeaderRefresh()}
        onFooterRefresh={() => this.onFooterRefresh()}
        />
      
    );
  }
}

ShoppingCart.propTypes = {};

export default ShoppingCart;
