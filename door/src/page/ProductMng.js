import React from 'react';
import {StyleSheet, View, ScrollView, Text, Image, Button, TouchableHighlight, Dimensions} from 'react-native';
import {get} from '../api/request'
import RefreshListView, { RefreshState } from "react-native-refresh-list-view"
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
  listItem: {
    borderColor: 'silver',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
    marginBottom: 5,
    flexDirection: 'row',
    height: 100
  },
  productImg: {
    width: 100,
    height: 100
  },
  productDetail: {
    flex: 1
  },
  productName: {
    fontSize: 20
  },
  productPrice: {
    fontSize: 16,
    color: 'red',
  },
  productSummary: {
    flex: 1,
    overflow: 'hidden'
  }
});

class ProductMng extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshState: RefreshState.Idle,
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

  loadMore(startId) {
    let {productList} = this.state
    let query = {
      limit: 10,
      startId
    }
    get('/api/manage/product/list', query, res => {
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

  onHeaderRefresh() {
    console.log("下拉刷新")
    this.loadMore()
  }

  onFooterRefresh() {
    console.log("加载更多")
    this.loadMore(this.getLastId())
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
      WToast.show({data:"商品已上架"})
    })
  }

  putoff(item) {
    get('/api/manage/product/putoff', {productId: item.id}, res => {
      console.log("商品下架", res)
      item.status = 2
      this.setState({})
      WToast.show({data:"商品已下架"})
    })
  }

  getStatus(product) {
    if(product.status === 1) return '上架'
    else if(product.status === 2) return '下架'
    else return '未知'
  }

  renderCell(item) {
    return (
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
    )
  }

  render() {
    let {productList, refreshState} = this.state
    return (
      <View style={styles.container}>
        <View style={{marginBottom: 5}}>
          <Button onPress={() => this.onAdd()} title="新增商品"/>
        </View>
        <RefreshListView data={productList} 
          refreshState={refreshState} 
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => this.renderCell(item)}
          onHeaderRefresh={() => this.onHeaderRefresh()}
          onFooterRefresh={() => this.onFooterRefresh()}
          />
      </View>
    )
  }
}

export default ProductMng;
