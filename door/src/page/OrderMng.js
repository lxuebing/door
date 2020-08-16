import React from 'react';
import {StyleSheet, View, ScrollView, Text, Image, Button, TouchableHighlight, Dimensions} from 'react-native';
import {formatTime} from '../utils/DateUtil'
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
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
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
    flexDirection: 'row',
    height: 122
  },
  productImg: {
    width: 120,
    height: 120
  },
  productDetail: {
    flex: 1,
  },
  productName: {
    fontSize: 20
  },
  productPrice: {
    fontSize: 16,
    color: 'red',
  }
});

class OrderMng extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshState: RefreshState.Idle,
      orderList: [
        
      ]
    };
  }

  onItemClicked(item) {
    console.log("选择订单: ", item.id)
    this.props.navigation.navigate('OrderDetail', {orderId: item.id})
  }


  setOrder(item) {
    console.log("向供应商订货", item)
    get('/api/manage/order/set', {orderId: item.id}, res => {
      console.log("发起供应商订单", res)
      this.loadOrderList()
    })
  }

  componentDidMount() {
    this.loadMore()
  }

  componentWillUnmount() {
    this.setState = ()=>false;
  }

  loadMore(startId) {
    let {orderList} = this.state
    let query = {
      limit: 10,
      startId
    }
    get('/api/manage/order/list', query, res => {
      console.log("订单列表", res)
      let data = res.data
      if(data.length === 0) {
        WToast.show({data: '没有更多了'})
        return
      } 
      this.setState({
        orderList: startId ? orderList.concat(data): data
      })
    })
  }

  getLastId() {
    let orderList = this.state.orderList
    if(orderList && orderList.length > 0) {
      return orderList[orderList.length-1].id
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

  getStatus(item){
    if(item.status === 1) {
      return (<Text style={{}}>{'待处理'}</Text>)
    }
    if(item.status === 2) {
      return (<Text style={{}}>{'已向供应商订货'}</Text>)
    }
    if(item.status === 3) {
      return (<Text style={{color:'green'}}>{'已签收'}</Text>)
    }
  }

  getCustomType(order) {
    if(order.custom === 1) return <Text style={{fontWeight: 'bold', color: 'green'}}>定制门</Text>
    else if(order.custom === 0) return <Text style={{fontWeight: 'bold'}}>标准门</Text>
    else return <Text style={{fontWeight: 'bold'}}>未知</Text>
  }

  renderCell(item) {
    return (
      <TouchableHighlight onPress = { (e) => this.onItemClicked(item) }>
        <View style={styles.listItem}>
          <Image
            style={styles.productImg}
            source={{uri: item.productImg}}
          />
          <View style={styles.productDetail}>
            <Text style={styles.productName}>{item.productName}</Text>
            <View style={{...styles.row, flex: 1}}>
              <Text style={styles.productPrice}>￥{item.price}</Text>
              <Text>数量：{item.count}</Text>
              <Text>{formatTime(item.createTime)}</Text>
            </View>
            {/* <View style={styles.row}>
              <Text>经销商：{item.customer}</Text>
            </View>
            <View style={styles.row}>
              <Text>地址：{item.address}</Text>
            </View> */}
            <View style={styles.row}>
              {this.getCustomType(item)}
              {this.getStatus(item)}
              { item.status === 1 &&
                <Button title="订货" onPress={() => this.setOrder(item)}/>
              }
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  render() {
    let {orderList, refreshState} = this.state
    return (
      <RefreshListView data={orderList} 
        refreshState={refreshState} 
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => this.renderCell(item)}
        onHeaderRefresh={() => this.onHeaderRefresh()}
        onFooterRefresh={() => this.onFooterRefresh()}
        />
    )
    
  }
}

OrderMng.propTypes = {};

export default OrderMng;
