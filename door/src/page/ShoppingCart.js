import React from 'react'
import {StyleSheet, Button, View, Image, ScrollView, TouchableHighlight, Text, ViewPagerAndroid} from 'react-native'
import {formatTime} from '../utils/DateUtil'
import {get, post, } from '../api/request';
import {WToast} from 'react-native-smart-tip'

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
    width: 150,
    height: 150
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
      orderList: [
      ]
    };
  }

  componentDidMount() {
    this.loadOrderList()
  }

  loadOrderList() {
    get('/api/user/order/list')
    .then((res) => {
      console.log("订单列表", res.data)
      if(res.data.code == 0) {
        this.setState({
          orderList: res.data.data
        })
      } else {
        // todo: 报错
        console.log("获取订单失败", res.data)
      }
    })
    .catch((error) => {
      console.log("获取订单列表失败", error)
    }
  )
  }

  onItemClicked(item) {
    console.log("点击订单：", item)
  }

  placeOrder(item) {
    console.log("下单", item)
    get('/api/user/order/place', {orderId: item.id})
    .then(res => {
      console.log("下单结果",res.data)
      WToast.show({data: res.data.data})
      this.loadOrderList()
    }).catch(err => {
      console.log("下单出错", err)
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

  render() {
    let {orderList} = this.state
    return (
      <ScrollView style={styles.orderList}>
        {
          orderList && orderList.map((item, index) => (
            <TouchableHighlight key={index} onPress={() => {this.onItemClicked(item)}}>
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
          )
        }
      </ScrollView>
    );
  }
}

ShoppingCart.propTypes = {};

export default ShoppingCart;
