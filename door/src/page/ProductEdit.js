import React from 'react';
import {StyleSheet, View, Image, Button, TextInput, Text, TouchableHighlight} from 'react-native';
import Swiper from 'react-native-swiper';

import addImg from '../images/icons/addImg.png';
import {get, request} from '../api/request'

const styles = StyleSheet.create({
  text: {
    color: '#000',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'silver',
    flex: 1,
    margin: 10,
  },
  productInfo: {
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  img: {
    width: 80,
    height: 80,
    borderWidth: 5,
    borderColor: 'silver',
    margin: 10
  }
});

class ProductEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {
      },
      imgs: [
        "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596739146472&di=f57362d2b442f94ee30fe199dca87190&imgtype=0&src=http%3A%2F%2Fa0.att.hudong.com%2F56%2F12%2F01300000164151121576126282411.jpg"
      ]
    };
  }

  componentDidMount() {
    if(!this.props.route || !this.props.route.params || !this.props.route.params.productId) {
      return
    }
    get('/api/product/detail', {id: this.props.route.params.productId})
      .then((res) => {
        let data = res.data
        console.log("商品详情", data)
        if(data.code == 0) {
          this.setState({
            product: data.data,
            imgs: data.images
          })
        } else {
          console.log("获取商品详情失败: ", data)
        }
      })
      .catch((error) => {
        console.log("error: ", error)
      }
    )
  }

  save() {
    request({
      method: 'POST',
      url: '/api/manage/product/add',
      data: {
        'name': '名称',
        'images': ["aaa"],
        'price': 1000,
        'categoryId': 6
      }
    }).then(res => {
      console.log("成功", res.data)
    }).catch(err => {
      console.log("失败", err)
    })
  }

  render() {
    let {product, imgs} = this.state
    return (
      <View>
        <View style={styles.row}>
          <Text>名称：</Text>
          <TextInput style={styles.input} value={product.name}/>
        </View>
        <View style={styles.row}>
          <Text>单价：</Text>
          <TextInput style={styles.input} value={product.price}/>
        </View>
        <View style={styles.row}>
          <Text>品类：</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.row}>
          <Text>简介：</Text>
          <TextInput style={styles.input} value={product.summary}/>
        </View>
        <View style={styles.row}>
          <Text>图片：</Text>
          {
            imgs && imgs.map((item, index) => (
              <Image key={index} style={styles.img} source={{uri: item}}/>
              ))
          }
          <Image style={styles.img} source={addImg}/>
        </View>
        <View style={styles.row}>
          <Text>详情：</Text>
          <TextInput placeholder={'输入产品详情'} vaule={product.detail}/>
        </View>
        <View style={styles.row}>
          <Button title={'保存'} onPress={this.save} />
          <Button title={'立即发布'} />
        </View>
      </View>
    );
  }
}

ProductEdit.propTypes = {};

export default ProductEdit;
