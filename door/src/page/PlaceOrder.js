import React from 'react';
import {StyleSheet, View, Image, Button, Text, TextInput, TouchableHighlight} from 'react-native';
import Selector from './component/Selector'
import {get, post} from '../api/request'
import {buildParamsString} from '../utils/StringUtil'
import { WToast } from 'react-native-smart-tip';

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
  }
});

class PlaceOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {
      },
      colors: [
          {key: 1, value:'红色'},
          {key: 2, value:'黑色'},
          {key: 3, value:'白色'}
      ],
      openways: [
          {key: 1, value: '内左'},
          {key: 2, value: '内右'},
          {key: 3, value: '外左'},
          {key: 4, value: '外右'},
      ],
      count: 1
    };
  }

  getProductDetail() {
    if(!this.props.route || !this.props.route.params || !this.props.route.params.productId) {
      return
    }
    let {productId} = this.props.route.params
    get('/api/product/detail', {id: productId})
      .then((res) => {
        let data = res.data
        console.log("商品详情", data)
        if(data.code == 0) {
          this.setState({
            product: data.data
          })
        } else {
          // todo: 报错
          console.log("获取商品失败：", data.msg)
        }
      })
      .catch((error) => {
        console.log("获取商品失败: ", error)
      }
    )
  }

  getItemDetail() {
    if(!this.isCustom() && this.props.route.params.itemId) {
        get('/api/product/item', {itemId: this.props.route.params.itemId})
        .then(res => {
            let data = res.data
            console.log("获取商品item", data)
            if(data.code === 0) {
                this.setState({
                    item: data.data
                })
            } else {
                console.log("获取商品item失败")
            }
        }).catch(err => {
            console.log("获取商品item失败")
        })
    }
  }

  isCustom() {
    return this.props.route && this.props.route.params && this.props.route.params.custom && this.props.route.params.custom === 1
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.getProductDetail()
      this.getItemDetail()
      this.setState({custom: this.isCustom() ? 1:0})
    })
  }

  componentWillUnmount() {
    this.setState = ()=>false;
  } 

  onColorChoose(color) {
    this.setState({
        color
    })
  }

  onOpenwayChoose(open) {
      this.setState({
        open
      })
  }

  onProductClicked() {
    this.props.navigation.navigate('Product', {productId: this.state.product.id})
  }

  addOrder() {
    console.log("提交订单")
    let {product, color, open, custom, width, height, count, item} = this.state
    let data = {productId: product.id, count, custom}
    if(custom === 1) {
        data = {
            ...data,
            params: {
                color: color.value,
                open: open.value,
                width,
                height
            }
        }
    } else {
        data = {...data,
            itemId: item.id,
            params: item.params
        }
    }
    console.log("提交订单数据", data) 
    post('/api/user/order/add', data)
    .then(res => {
        let data = res.data 
        console.log("提交订单结果", data)
        if(data.code === 0) {
            WToast.show({data:"已提交订单"})
        } else {
            WToast.show({data:data.data})
        }
    }).catch(err => {
        console.log("提交订单失败", err)
    })
  }

  getParams() {
    let {product, color, open, custom, item} = this.state
    if(custom === 0) {
        return (
            <View style={styles.parms}>
                <Text>{item && item.params && buildParamsString(item.params)}</Text>
            </View>
        )
    } else {
        return (
        <View style={styles.parms}>
            <View style={styles.row}>
                <Text>颜色：</Text>
                <Selector items={this.state.colors} selected={color} onItemSelected={(color) => {this.onColorChoose(color)}}/>
            </View>
            <View style={styles.row}>
                <Text>开向：</Text>
                <Selector items={this.state.openways} selected={open} onItemSelected={(open) => {this.onOpenwayChoose(open)}}/>
            </View>
            <View style={styles.row}>
                <Text>尺寸：</Text>
                <TextInput style={styles.tinyInput} placeholder={'输入宽度(mm)'} onChangeText={(text) => this.setState({width: text})}></TextInput>
                <Text> - </Text>
                <TextInput style={styles.tinyInput} placeholder={'输入高度(mm)'} onChangeText={(text) => this.setState({height: text})}></TextInput>
            </View>
        </View>)
    }
    
  }

  render() {
    let {product, count} = this.state
    console.log("商品信息", product)
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
                  </View>
                </View>
            </TouchableHighlight>
        </View>
        {
            this.getParams()
        }
        
        <View style={styles.row}>
            <Text>数量：</Text>
            <TextInput style={styles.tinyInput} defaultValue={'' +count} onChangeText={(count) => this.setState({count})}></TextInput>
        </View>
        <View style={styles.operation}>
          <Button title="提交订单" onPress={() => this.addOrder()}/>
        </View>
      </View>
    );
  }
}

PlaceOrder.propTypes = {};

export default PlaceOrder;
