import React from 'react';
import {StyleSheet, View, ScrollView, Text, Image, Button, TouchableHighlight, Dimensions} from 'react-native';
import RefreshListView, { RefreshState } from "react-native-refresh-list-view"
import {get} from '../api/request'
import { WToast } from 'react-native-smart-tip';

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
    width: 120,
    height: 120
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
  },
  productSummary: {

  }
});

class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshState: RefreshState.Idle,
      productList: [
        
      ]
    };
  }

  onItemClicked(item) {
    console.log("选择产品: " + item.name)
    this.props.navigation.navigate('Product', {productId: item.id})
  }

  loadMore(startId) {
    let {productList} = this.state
    let query = {
      limit: 10,
      startId
    }
    if(this.props.route && this.props.route.params) {
      let {category} = this.props.route.params
      query.category = category
    }
    get('/api/product/list', query, res => {
        console.log("商品列表", res)
        let data = res.data
        if(data.length === 0) {
          WToast.show({data: '没有更多了'})
          return
        } 
        this.setState({
          productList: startId ? productList.concat(data): data
        })
    })
  }

  getLastId() {
    let productList = this.state.productList
    if(productList && productList.length > 0) {
      return productList[productList.length-1].id
    } else {
      return 0
    }
  }

  componentDidMount() {
    console.log("刷新页面")
    this.props.navigation.addListener('focus', () => {
      this.loadMore()
    })
  }

  componentWillUnmount() {
    this.setState = ()=>false;
  }

  onHeaderRefresh() {
    console.log("下拉刷新")
    this.loadMore()
  }

  onFooterRefresh() {
    console.log("加载更多")
    this.loadMore(this.getLastId())
  }

  renderCell(item) {
    return (
     <View>
        <TouchableHighlight onPress = { (e) => this.onItemClicked(item) }>
          <View style={styles.listItem}>
            <Image
              style={styles.productImg}
              source={{uri: item.img}}
            />
            <View style={styles.productDetail}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>￥{item.price}</Text>
              <Text style={styles.productSummary}>{item.summary}</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    )
  }

  render() {
    let {productList, refreshState} = this.state
    return (
      <RefreshListView data={productList} 
        refreshState={refreshState} 
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => this.renderCell(item)}
        onHeaderRefresh={() => this.onHeaderRefresh()}
        onFooterRefresh={() => this.onFooterRefresh()}
        />
    )
  }
}

ProductList.propTypes = {};

export default ProductList;
