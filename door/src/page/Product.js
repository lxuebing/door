import React from 'react';
import {StyleSheet, View, Image, Button, Text, TouchableHighlight} from 'react-native';
import Swiper from 'react-native-swiper';
import {host} from '../constants/config'

import cartIcon from '../images/icons/cart.png';

const styles = StyleSheet.create({
  text: {
    color: '#000',
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
  }
});

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {
      },
    };
  }

  componentDidMount() {
    let {productId} = this.props.route.params
    console.log(productId)
    fetch(host + '/api/product/detail?id=' + productId)
      .then((response) => {
        return response.json()
      })
      .then((res) => {
        console.log("商品详情", res)
        if(res.code == 0) {
          this.setState({
            product: res.data
          })
        } else {
          // todo: 报错
          console.log("获取商品失败：", res.msg)
        }
      })
      .catch((error) => {
        console.log("error: ", error)
      }
    )
  }

  render() {
    let {product} = this.state
    console.log(product.images)
    return (
      <View>
        {
          product.id && <View style={styles.productInfo}>
            {
              // 这里应该放轮播，但没有好用的插件，react-native-swiper是个弟弟
            }
            <Image style={styles.swiperImg} source={{uri: "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=151472226,3497652000&fm=26&gp=0.jpg"}}/>
            <View style={styles.baseInfo}>
              <Text style={styles.price}>{product.price && '￥' + product.price}</Text>
              <Text style={styles.name}>{product.name}</Text>
              <Text style={styles.summary}>{product.summary}</Text>
            </View>
            <View style={styles.detail}>
              <Text>详情</Text>
            </View>
        </View>
        }
        <View style={styles.operation}>
          <Image source={cartIcon} style={styles.shoppingCart}/>
          <Button title="加购物车"/>
          <Button title="立即下单"/>
        </View>
      </View>
    );
  }
}

Product.propTypes = {};

export default Product;
