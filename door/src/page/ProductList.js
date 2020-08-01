import React from 'react';
import {StyleSheet, View, Text, Image, TouchableHighlight, Dimensions} from 'react-native';

const styles = StyleSheet.create({
  text: {
    color: 'red',
  },
  container: {
    height: Dimensions.get('window').height,
    flexDirection: 'row'
  },
  sidebar: {
    height: Dimensions.get('window').height,
    backgroundColor: 'silver',
    width: 150
  },
  content: {
    flex:1,
    borderColor: 'blue',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  img: {
    height: 60,
    width: 60
  },
  listItem: {
    padding: 10,
    justifyContent:"center",
    alignItems:"center"
  },
  categoryItem: {
    padding: 20,
    alignItems: 'center'
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

  onItemClicked(product) {
    console.log("选择产品: " + product.name)
    // todo: 点击二级品类跳转至商品列表页
  }

  loadMore() {
    // todo: 滑动至底部时加载下一页
  }

  componentDidMount() {
    fetch('http://mockjs.docway.net/mock/1WpkXqZLoSf/api/category/list?root=0')
      .then((response) => {
        return response.json()
      })
      .then((res) => {
        console.log("一级品类", res)
        
      })
      .catch((error) => {
        console.log("error: ", error)
      })
  }

  render() {
    let {list} = this.state
    return (
      <View style={styles.container}>
        {
          list && list.map((item,index) => (
            <View key={index}>
              <Text>{item.name}</Text>
            </View>
          ))
        }
      </View>
    );
  }
}

ProductList.propTypes = {};

export default ProductList;
