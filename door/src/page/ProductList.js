import React from 'react';
import {StyleSheet, View, Text, Image, Button, TouchableHighlight, Dimensions} from 'react-native';
import {host} from '../constants/config'

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

class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productList: [
        
      ]
    };
  }

  onItemClicked(item) {
    console.log("选择产品: " + item.name)
    this.props.navigation.navigate('Product', {productId: item.id})
  }

  loadMore() {
    let {productList} = this.state
    let query = "?limit=10"
    if(this.props.route && this.props.route.params) {
      let {category} = this.props.route.params
      query = query + "&category=" + category
    }
    if(productList && productList.length > 0) {
      query = query + "&startId=" + productList[productList.length-1].id
    }
    fetch(host + '/api/product/list' + query)
      .then((response) => {
        return response.json()
      })
      .then((res) => {
        console.log("商品列表", res)
        if(res.code == 0) {
          this.setState({
            productList: productList.concat(res.data)
          })
        } else {
          // todo: 报错
          console.log("错误:", res.msg)
        }
      })
      .catch((error) => {
        console.log("error: ", error)
      }
    )
  }

  componentDidMount() {
    console.log("刷新页面")
    this.loadMore()
  }

  render() {
    let {productList} = this.state
    return (
      <View style={styles.container}>
        {/* <Button 
        title="返回"
        onPress={() => {
          navigation.canGoBack() && navigation.goBack()
        }}/> */}
        {
          productList && productList.map((item,index) => (
            <View key={index}>
              <TouchableHighlight key={index} onPress = { (e) => this.onItemClicked(item) }>
                <View style={styles.listItem}>
                  <Image
                    style={styles.productImg}
                    source={{uri: item.img}}
                  />
                  <View style={styles.productDetail}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productPrice}>￥{item.price}</Text>
                  </View>
                </View>
              </TouchableHighlight>
            </View>
          ))
        }
      </View>
    );
  }
}

ProductList.propTypes = {};

export default ProductList;
