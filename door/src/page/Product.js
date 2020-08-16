import React from 'react';
import {StyleSheet, View, ScrollView, Image, Button, Text, TouchableHighlight, Dimensions} from 'react-native';
import Swiper from 'react-native-swiper';
import {get} from '../api/request'
import Selector from './component/Selector'
import {buildParamsString} from '../utils/StringUtil'

import cartIcon from '../images/icons/cart.png';
const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  text: {
    color: '#000',
  },
  productInfo: {
  },
  swiperWrapper: {
    height: 200,
    width: width,
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'silver'
  },
  slideImg: {
    width: width,
    height: 200,
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
  footbar: {
    padding: 5,
    borderWidth: 1,
    borderColor: 'silver',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  operation: {
    flexDirection: 'row'
  },
  shoppingCart: {
    width: 40,
    height: 40,
    tintColor: '#888'
  }
});

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {
      },
      items: []
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
        this.getItems(productId)
    })
    get('/api/product/image/list', {productId}, res => {
      console.log("商品图片", res.data)
      this.setState({
        images: res.data
      })
    })
  }

  getItems(productId) {
    get('/api/product/item/list', {productId}, res => {
      console.log("商品item列表", res)
      let items = [] 
      res.data.map(o => {
        items.push({
          id: o.id,
          key: o.id,
          value: buildParamsString(o.params)
        })
      })
      if(items.length > 0) {
        this.setState({
          items,
          item: items[0]
        })
      }
  })
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.getProductDetail()
    })
    
  }

  componentWillUnmount() {
    this.setState = ()=>false;
  } 

  placeOrder(custom) {
    console.log('下单', this.state.product)
    let itemId = null 
    if(this.state.item) itemId = this.state.item.id
    if(custom === 1) {
      this.props.navigation.navigate('PlaceOrder', {productId: this.state.product.id, custom})
    } else {
      this.props.navigation.navigate('PlaceOrder', {productId: this.state.product.id, itemId, custom})
    }
  }

  onItemChoose(item) {
    this.setState({
      item
    })
  }

  render() {
    let {product, item, images} = this.state
    return (
      <>
      <ScrollView>
        {
          product.id && <View style={styles.productInfo}>
            <View style={styles.swiperWrapper}>
              {
                images && 
                <Swiper style={styles.wrapper} autoplay>
                  {
                    images.map((img, index) => (
                      <View key={index} style={styles.slide}>
                        <Image source={{uri: img}} style={styles.slideImg} />
                      </View>
                    )) 
                  }
                </Swiper>
              }
            </View>
            <View style={styles.baseInfo}>
              <Text style={styles.price}>{product.price && '￥' + product.price}</Text>
              <Text style={styles.name}>{product.name}</Text>
              <Text style={styles.summary}>{product.summary}</Text>
            </View>
            <View>
              <Selector items={this.state.items} selected={item} onItemSelected={(item) => {this.onItemChoose(item)}}/>
            </View>
            <View style={styles.detail}>
              <Text>详情</Text>
            </View>
        </View>
        }
      </ScrollView>
      <View style={styles.footbar}>
        <Image source={cartIcon} style={styles.shoppingCart}/>
        <View style={styles.operation}>
          <View  style={{paddingLeft: 10}}>
            <Button title="去定制" onPress={() => this.placeOrder(1)}/>
          </View>
          {
            item ? 
            <View  style={{paddingLeft: 10}}>
              <Button title="去下单" onPress={() => this.placeOrder(0)}/>
            </View>
            :
            <View  style={{paddingLeft: 10}}>
              <Button title="去下单" disabled/>
            </View>
          }
        </View>
      </View>
      </>
    );
  }
}

Product.propTypes = {};

export default Product;
