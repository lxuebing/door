import React from 'react';
import {StyleSheet, View, Image, Button, Text, TextInput, TouchableHighlight} from 'react-native';
import {get, post} from '../api/request'
import {formatTime} from '../utils/DateUtil'

const styles = StyleSheet.create({
  text: {
    color: '#000',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  productInfo: {
  },
  swiper: {
    width: 200,
    height: 200,
    borderWidth: 10,
    borderColor: 'red'
  },
  swiperImg: {
    height: 300,
  },
  baseInfo: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'silver'
  },
  price: {
    fontSize:30,
    color:'red'
  },
  name: {
    fontSize: 24
  },
  summary: {
    
  },
  detail: {
    padding: 10,
  },
  operation: {
    flexDirection: 'row'
  },
  shoppingCart: {
    width: 50,
    height: 50,
  },
  tinyInput: {
      width: 150,
  },
  params: {

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
  productSummary: {

  }
});

class PlaceOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {},
      order: {}
    };
  }

  getProductDetail(productId) {
    get('/api/product/detail', {id: productId}, res => {
      console.log("商品详情", res)
      this.setState({
        product: res.data
      })
    })
  }

  getOrderDetail() {
    let {orderId} = this.props.route.params
    get('/api/user/order/detail', {orderId}, data => {
      console.log("获取订单信息", data)
        this.setState({
            order: data.data
        })
        this.getProductDetail(data.data.productId)
    })
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.getOrderDetail()
    })
  }

  onProductClicked() {
    this.props.navigation.navigate('Product', {productId: this.state.order.id})
  }

  getCustomType(order) {
    if(order.custom === 1) return '定制门'
    else if(order.custom === 0) return '标准门'
    else return '未知'
  }

  render() {
    let {order, product} = this.state
    let params = order.params
    if(!params) params = {}
    console.log("订单信息", order)
    console.log("参数", params)
    return (
      <View>
        <View style={styles.productInfo}>
            <TouchableHighlight onPress = { (e) => this.onProductClicked() }>
                <View style={styles.listItem}>
                  <Image
                    style={styles.productImg}
                    source={{uri: product.img}}
                  />
                  <View style={styles.productDetail}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productPrice}>￥{product.price}</Text>
                    <Text style={styles.productSummary}>{product.summary}</Text>
                  </View>
                </View>
            </TouchableHighlight>
        </View>
        <View style={styles.row}>
          <Text>{this.getCustomType(order)} </Text>
        </View>
        <View style={styles.row}>
          <Text>颜色：{params.color} </Text>
        </View>
        <View style={styles.row}>
            <Text>开向：{params.openway} </Text>
        </View>
        <View style={styles.row}>
          <Text>尺寸：宽 {params.width} 毫米, 高 {params.height} 毫米 </Text>
        </View>
        <View style={styles.row}>
          <Text>数量：{order.count}</Text>
        </View>
        <View style={styles.row}>
          <Text>下单时间：{formatTime(order.createTime)}</Text>
        </View>
      </View>
    );
  }
}

PlaceOrder.propTypes = {};

export default PlaceOrder;
