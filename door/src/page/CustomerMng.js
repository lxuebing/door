import React from 'react';
import {StyleSheet, View, ScrollView, Text, Button, Image, TextInput, TouchableHighlight, Dimensions, Alert} from 'react-native';
import {get, post} from '../api/request'
import RefreshListView, { RefreshState } from "react-native-refresh-list-view"
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
  detail: {
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    flex: 1,
  },
  customerName: {
    fontSize: 24
  },
  operations: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});

class CustomerMng extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshState: RefreshState.Idle,
      customerList: [
        
      ],
    };
  }

  componentDidMount() {
    console.log("刷新页面")
    this.props.navigation.addListener('focus', () => {
      this.onHeaderRefresh()
    })
  }

  componentWillUnmount() {
    this.setState = ()=>false;
  }

  loadCustomerList(startId) {
    get('/api/manage/customer/list', {startId}, res => {
      console.log("用户列表", res)
      let customerList = res.data
      if(customerList.length < 1) return;
      this.setState({
        customerList: this.state.customerList.concat(customerList)
      })
    })
  }

  onHeaderRefresh() {
    console.log("下拉刷新")
    this.setState({customerList:[]})
    this.loadCustomerList()
  }

  onFooterRefresh() {
    console.log("加载更多", this.getLastId())
    this.loadCustomerList(this.getLastId())
  }

  getLastId() {
    let customerList = this.state.customerList
    if(customerList && customerList.length > 0) {
      return customerList[customerList.length-1].id
    } else {
      return null
    }
  }

  onItemClicked(item) {
    this.props.navigation.navigate('AuditDetail', {customerId: item.id})
  }

  reject(item) {
    Alert.alert('审批驳回', '确定要驳回客户的申请？',
      [
        {text:'取消', onPress: () => {}},
        {text:'确定', onPress: () => {
          get('/api/manage/customer/audit/reject', {customerId: item.id}, res => {
            this.onHeaderRefresh()
          })
        }}
      ]
    )
  }

  pass(item) {
    Alert.alert('审批通过', '确定要通过客户的申请？',
      [
        {text:'取消', onPress: () => {}},
        {text:'确定', onPress: () => {
          get('/api/manage/customer/audit/pass', {customerId: item.id}, res => {
            this.onHeaderRefresh()
          })
        }}
      ]
    )
  }

  renderCell(item) {
    return (
     <View>
        <TouchableHighlight onPress = { (e) => this.onItemClicked(item) }>
          <View style={styles.listItem}>
            <View style={styles.detail}>
              <Text style={styles.customerName}>{'真实姓名：' + (item.realname ? item.realname: '')}</Text>
              <Text>{'昵称：' + (item.nickname ? item.nickname: '')}</Text>
              <Text>{'申请时间：' + (item.updateTime ? formatTime(item.updateTime): '')}</Text>
              
              <View style={styles.operations}>
                <View style={{marginRight: 10}}><Button title={'驳回'} onPress={() => this.reject(item)}/></View>
                <Button title={'通过'} onPress={() => this.pass(item)}/>
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    )
  }

  render() {
    let {customerList, refreshState} = this.state
    return (
      <RefreshListView data={customerList} 
        refreshState={refreshState} 
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => this.renderCell(item)}
        onHeaderRefresh={() => this.onHeaderRefresh()}
        onFooterRefresh={() => this.onFooterRefresh()}
        />
    );
  }
}

CustomerMng.propTypes = {};

export default CustomerMng;
