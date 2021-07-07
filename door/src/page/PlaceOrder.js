import React from 'react';
import {StyleSheet, View, ScrollView, KeyboardAvoidingView, Image, Button, Text, TextInput, TouchableHighlight} from 'react-native';
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
    flexDirection: 'row-reverse',
    borderColor: 'silver',
    borderWidth: 1,
    padding: 5,
    backgroundColor: 'white'
  },
  shoppingCart: {
    width: 50,
    height: 50,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'silver',
    flex: 1,
    margin: 10,
  },
  tinyInput: {
      width: 150,
  },
  params: {
    fontSize: 16,
    padding: 10
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
      product: {
      },
      colors: [
      ],
      openways: [
      ],
      count: 1
    };
  }

  getProductDetail() {
    if(!this.props.route || !this.props.route.params || !this.props.route.params.productId) {
      return
    }
    let {productId} = this.props.route.params
    get('/api/product/detail', {id: productId}, res => {
      console.log("商品详情", res)
      this.setState({
        product: res.data
      })
    })
  }

  getItemDetail() {
    if(!this.isCustom() && this.props.route.params.itemId) {
        get('/api/product/item', {itemId: this.props.route.params.itemId}, data => {
          console.log("获取商品item", data)
            this.setState({
                item: data.data
            })
         
        })
    }
  }

  loadDict() {
    get('/api/dict/color', {}, res => {
        this.setState({
            colors: res.data
        })
    })
    get('/api/dict/openway', {}, res => {
      this.setState({
          openways: res.data
      })
    })
  }

  isCustom() {
    return this.props.route && this.props.route.params && !this.props.route.params.itemId
  }

  componentDidMount() {
    this.loadDict()
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

  onOpenwayChoose(openway) {
      this.setState({
        openway
      })
  }

  onProductClicked() {
    this.props.navigation.navigate('Product', {productId: this.state.product.id})
  }

  addOrder() {
    console.log("提交订单")
    let {product, color, openway, custom, width, height, count, note, item} = this.state
    if(!product) {
      WToast.show({data: '未选择商品'})
      return
    }
    if(!count) count = 1
    let data = {productId: product.id, count, custom}
    if(custom === 1) {
      if(!color || !openway || !width || !height || !count) {
        WToast.show({data: '请把订单填写完整'})
        return
      }
      data = {
          ...data,
          params: {
              color: color.value,
              openway: openway.value,
              width,
              height,
              note
          }
      }
    } else {
      if(!item || !count) {
        WToast.show({data: '请把订单填写完整'})
        return
      }
      data = {...data,
          itemId: item.id,
          params: item.params
      }
    }
    console.log("提交订单数据", data) 
    post('/api/user/order/add', data, res => {
      console.log("提交订单结果", res)
      WToast.show({data:"已提交订单"})
      this.props.navigation.goBack()
    })
  }

  getParams() {
    let {product, color, openway, custom, item} = this.state
    if(custom === 0) {
        return (
            <View style={styles.params}>
                <Text style={{fontSize: 16, color: 'green'}}>{item && item.params && buildParamsString(item.params)}</Text>
            </View>
        )
    } else {
        return (
        <View style={styles.params}>
            <View style={styles.row}>
                <Text>颜色：</Text>
                <Selector items={this.state.colors} selected={color} onItemSelected={(color) => {this.onColorChoose(color)}}/>
            </View>
            <View style={styles.row}>
                <Text>开向：</Text>
                <Selector items={this.state.openways} selected={openway} onItemSelected={(openway) => {this.onOpenwayChoose(openway)}}/>
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
      <KeyboardAvoidingView style={{display: 'flex', flex: 1}}>
        <ScrollView>
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
          {
              this.getParams()
          }
          
          <View style={{...styles.row, padding: 10}}>
              <Text style={{fontSize: 16}}>数量：</Text>
              <TextInput style={styles.tinyInput} defaultValue={'' +count} onChangeText={(count) => this.setState({count})}></TextInput>
          </View>
          
          <View style={{...styles.row, padding: 10}}>
              <Text style={{fontSize: 16}}>备注：</Text>
              <TextInput style={styles.input} multiline={true} placeholder={'备注'}  onChangeText={(note) => this.setState({note})}/>
          </View>
        </ScrollView>
        <View style={styles.operation}>
          <View>
            <Button title="提交订单" onPress={() => this.addOrder()}/>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default PlaceOrder;
