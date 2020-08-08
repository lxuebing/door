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
    fontSize: 24
  },
  productPrice: {
    fontSize: 20,
    color: 'red',
  }
});

class ProductMng extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productList: [
        
      ]
    };
  }

  onItemClicked(item) {
    this.props.navigation.navigate('ProductEdit')
  }

  onAdd() {
    console.log("新增商品")
    this.props.navigation.navigate('ProductEdit')
  }

  onDelete(item) {
    console.log("删除商品：", item.name)
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
  }

  render() {
    let {productList} = this.state
    return (
      <View style={styles.container}>
        <View>
          <Text>商品管理</Text>
          <Button onPress={() => this.onAdd()} title="新增商品"/>
        </View>
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
                    <Text>商品简介</Text>
                    <Text style={styles.productPrice}>￥{item.price}</Text>
                    <Button onPress={() => this.onDelete(item)} title="删除"/>
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

ProductMng.propTypes = {};

export default ProductMng;
