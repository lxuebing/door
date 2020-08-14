import React from 'react';
import {StyleSheet, View, ScrollView, Text, Image, Button, TouchableHighlight, Dimensions} from 'react-native';
import {formatTime} from '../utils/DateUtil'
import {get} from '../api/request'

const styles = StyleSheet.create({
  text: {
    color: 'black',
  },
  container: {
    height: Dimensions.get('window').height,
    backgroundColor: '#eeeeee',
    padding: 5,
    flex:1,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  img: {
    height: 60,
    width: 60
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
    fontSize: 30
  },
  productName: {
    fontSize: 24
  },
  productPrice: {
    fontSize: 20,
    color: 'red',
  }
});

class OrderMng extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderList: [
        
      ]
    };
  }

  onItemClicked(item) {
    console.log("选择订单: ", item.id)
    this.props.navigation.navigate('OrderDetail', {orderId: item.id})
  }

  loadMore() {
    // todo: 滑动至底部时加载下一页
  }

  setOrder(item) {
    console.log("向供应商订货", item)
    get('/api/manage/order/set', {orderId: item.id}, res => {
      console.log("发起供应商订单", res)
      this.loadOrderList()
    })
  }

  componentDidMount() {
    this.loadOrderList()
  }

  loadOrderList() {
    get('/api/manage/order/list', {}, res => {
      console.log("订单列表", res)
      this.setState({
        orderList: res.data
      })
    })
    
  }

  getStatus(item){
    if(item.status === 1) {
      return (<Text style={{}}>{'待处理'}</Text>)
    }
    if(item.status === 2) {
      return (<Text style={{}}>{'已向供应商订货'}</Text>)
    }
    if(item.status === 3) {
      return (<Text style={{color:'green'}}>{'已签收'}</Text>)
    }
  }

  render() {
    let {orderList} = this.state
    return (
      <ScrollView style={styles.container}>
        {
          orderList && orderList.map((item,index) => (
            <View key={index}>
              <TouchableHighlight key={index} onPress = { (e) => this.onItemClicked(item) }>
                <View style={styles.listItem}>
                  <Image
                    style={styles.productImg}
                    source={{uri: item.productImg}}
                  />
                  <View style={styles.productDetail}>
                    <Text style={styles.productName}>{item.productName}</Text>
                    <View style={styles.row}>
                      <Text style={styles.productPrice}>￥{item.price}</Text>
                      <Text>数量：{item.count}</Text>
                      <Text>{formatTime(item.createTime)}</Text>
                    </View>
                    <View style={styles.row}>
                      <Text>经销商：{item.customer}</Text>
                    </View>
                    <View style={styles.row}>
                      <Text>地址：{item.address}</Text>
                    </View>
                    <View style={styles.row}>
                      {this.getStatus(item)}
                      { item.status === 1 &&
                        <Button title="订货" onPress={() => this.setOrder(item)}/>
                      }
                    </View>
                  </View>
                </View>
              </TouchableHighlight>
            </View>
          ))
        }
      </ScrollView>
    );
  }
}

OrderMng.propTypes = {};

export default OrderMng;
