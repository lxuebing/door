import React from 'react';
import {StyleSheet, View, Text, Image, Button, TouchableHighlight, Dimensions} from 'react-native';
import {formatTime} from '../utils/DateUtil'

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
    flexDirection: 'row'
  },
  productImg: {
    width: 150,
    height: 150
  },
  productDetail: {
    flex: 1,
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

class OrderMng extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderList: [
        
      ]
    };
  }

  onItemClicked(item) {
    console.log("选择订单: " + item.name)
    // todo: 将订单标记为已下单（人工）
  }

  loadMore() {
    // todo: 滑动至底部时加载下一页
  }

  setOrder(item) {
    console.log("下单", item)
  }

  componentDidMount() {
    fetch('http://mockjs.docway.net/mock/1WpkXqZLoSf/api/manage/order/list')
      .then((response) => {
        return response.json()
      })
      .then((res) => {
        console.log("商品列表", res)
        if(res.code == 1) {
          this.setState({
            orderList: res.data
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
    let {orderList} = this.state
    return (
      <View style={styles.container}>
        <Text>订单管理</Text>
        {
          orderList && orderList.map((item,index) => (
            <View key={index}>
              <TouchableHighlight key={index} onPress = { (e) => this.onItemClicked(item) }>
                <View style={styles.listItem}>
                  <Image
                    style={styles.productImg}
                    source={{uri: item.img}}
                  />
                  <View style={styles.productDetail}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <View style={styles.row}>
                      <Text style={styles.productPrice}>￥{item.price}</Text>
                      <Text>数量：{item.count}</Text>
                      <Text>{formatTime(item.time)}</Text>
                    </View>
                    <View style={styles.row}>
                      <Text>经销商：{item.customer}</Text>
                    </View>
                    <View style={styles.row}>
                      <Text>地址：{item.address}</Text>
                    </View>
                    <View style={styles.row}>
                      <Text>状态：{item.statusDesc}</Text>
                      <Button title="下单" onPress={() => this.setOrder(item)}/>
                    </View>
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

OrderMng.propTypes = {};

export default OrderMng;
