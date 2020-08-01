import React from 'react';
import {StyleSheet, View, Text, Image, Button, TouchableHighlight, Dimensions} from 'react-native';

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
    this.props.navigation.navigate('Product')
  }

  loadMore() {
    // todo: 滑动至底部时加载下一页
  }

  componentDidMount() {
    fetch('http://mockjs.docway.net/mock/1WpkXqZLoSf/api/product/list')
      .then((response) => {
        return response.json()
      })
      .then((res) => {
        console.log("商品列表", res)
        if(res.code == 1) {
          this.setState({
            productList: res.data
          })
        } else {
          // todo: 报错
        }
      })
      .catch((error) => {
        console.log("error: ", error)
      }
    )
    console.log("导航", this.props.navigation)
  }

  render() {
    let {productList} = this.state
    let navigation = this.props.navigation
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
