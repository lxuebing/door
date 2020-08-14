import React from 'react';
import {StyleSheet, View, ScrollView, Text, Image, Button, TouchableHighlight, Dimensions} from 'react-native';
import {get} from '../api/request'

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
    flex: 1
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
    this.props.navigation.navigate('ProductEdit', {productId: item.id})
  }

  onAdd() {
    console.log("新增商品")
    this.props.navigation.navigate('ProductEdit')
  }

  onDelete(item) {
    console.log("删除商品：", item.name)
  }

  loadMore(start) {
    get('/api/product/list', {}, res => {
      console.log("商品列表", res)
      this.setState({
        productList: res.data
      })
    })
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.loadMore()
    })
  }

  componentWillUnmount() {
    this.setState = ()=>false;
}

  puton(item) {
    get('/api/manage/product/puton', {productId: item.id}, res => {
      console.log("商品上架", res)
      item.status = 1
      this.setState({})
    })
  }

  putoff(item) {
    get('/api/manage/product/putoff', {productId: item.id}, res => {
      console.log("商品下架", res)
      item.status = 2
      this.setState({})
    })
  }

  getStatus(product) {
    if(product.status === 1) return '上架'
    else if(product.status === 2) return '下架'
    else return '未知'
  }

  render() {
    let {productList} = this.state
    return (
      <View style={styles.container}>
        <View style={{marginBottom: 5}}>
          <Button onPress={() => this.onAdd()} title="新增商品"/>
        </View>
        <ScrollView>
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
                    <Text>{item.summary}</Text>
                    <Text>{this.getStatus(item)}</Text>
                  </View>
                  <View style={styles.options}>
                    {
                      item.status === 1 ? 
                      <Button onPress={() => this.putoff(item)} title="下架"/>
                      :
                      <Button onPress={() => this.puton(item)} title="上架"/>
                    }
                  </View>
                </View>
              </TouchableHighlight>
            </View>
          ))
        }
        </ScrollView>
      </View>
    );
  }
}

ProductMng.propTypes = {};

export default ProductMng;
