import React from 'react';
import {StyleSheet, View, ScrollView, Image, Button, Text, Modal, TouchableHighlight, Dimensions, Alert} from 'react-native';
import {get, post} from '../api/request'

const styles = StyleSheet.create({
  text: {
    color: '#000',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  productInfo: {
  },
  swiper: {
    width: 200,
    height: 200,
    borderWidth: 10,
    borderColor: 'red'
  },
  swiperImg: {
    height: 300,
  },
  baseInfo: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'silver'
  },
  price: {
    fontSize:30,
    color:'red'
  },
  name: {
    fontSize: 24
  },
  summary: {
    
  },
  detail: {
    padding: 10,
  },
  operation: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  shoppingCart: {
    width: 50,
    height: 50,
  },
  tinyInput: {
      width: 150,
  },
  params: {

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
    fontSize: 24
  },
  productPrice: {
    fontSize: 20,
    color: 'red',
  },
  productSummary: {

  },
  line: {
    borderColor: '#ddd',
    borderBottomWidth: 1,
    padding: 5,
    paddingLeft: 10
  },
  paramText: {
    fontSize: 16
  },
  paramName: {
    fontSize: 16,
    width: Dimensions.get('window').width / 3
  }
});

class AuditDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customer: {},
      verify: {},
      modalVisible: true,
      images: [],
      index: 0,
    };
  }

  getCustomerDetail() {
    let {customerId} = this.props.route.params
    get('/api/manage/customer', {customerId}, res => {
      console.log("客户信息", res)
      this.setState({
        customer: res.data
      })
    })
  }

  getVerifyDetail() {
    let {customerId} = this.props.route.params
    get('/api/manage/verify', {userId: customerId}, data => {
      console.log("获取实名信息", data)
      let verify = data.data
        let images = []
        if(verify.idcardA) images.push({url:verify.idcardA})
        if(verify.idcardB) images.push({url:verify.idcardB})
        if(verify.businessLicense) images.push({url:verify.businessLicense})
        if(verify.certPersonPic) images.push({url:verify.certPersonPic})
        this.setState({
            verify,
            images
        })
    })
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.getVerifyDetail()
      this.getCustomerDetail()
    })
  }

  componentWillUnmount() {
    this.setState = ()=>false;
  }

  showImage(index) {
    this.props.navigation.navigate('ImageShow', {images: this.state.images, imageIndex: index})
  }

  reject(item) {
    Alert.alert('审批驳回', '确定要驳回客户的申请？',
      [
        {text:'取消', onPress: () => {}},
        {text:'确定', onPress: () => {
          get('/api/manage/customer/audit/reject', {customerId: item.id}, res => {
            this.getCustomerDetail()
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
            this.getCustomerDetail()
          })
        }}
      ]
    )
    
  }

  render() {
    let {verify, customer} = this.state
    console.log("实名信息", verify)
    return (
      <View>

        {
          customer.status === 1 &&
          <View style={styles.operation}>
            <View style={{marginRight: 10}}><Button title={'驳回'} onPress={() => this.reject(customer)}/></View>
            <Button title={'通过'} onPress={() => this.pass(customer)}/>
          </View>
        }
        
        <ScrollView>
          <View style={{...styles.row, ...styles.line}}>
            <Text style={styles.paramName}>昵称：</Text>
            <Text style={styles.paramText}>{customer.nickname}</Text>
          </View>
          <View style={{...styles.row, ...styles.line}}>
            <Text style={styles.paramName}>真实姓名：</Text>
            <Text style={styles.paramText}>{customer.realname}</Text>
          </View>
          <View style={{...styles.row, ...styles.line}}>
            <Text style={styles.paramName}>手机号：</Text>
            <Text style={styles.paramText}>{customer.mobileNum}</Text>
          </View>
          <View style={{...styles.row, ...styles.line}}>
            <Text style={styles.paramName}>邮箱：</Text>
            <Text style={styles.paramText}>{customer.email}</Text>
          </View>
          
          <View style={{...styles.row, ...styles.line}}>
            <Text>身份证头像面</Text>
            <TouchableHighlight onPress={() => this.showImage(0)}>
              <Image
                style={styles.productImg}
                source={{uri: verify.idcardA}}
              />
            </TouchableHighlight>
          </View>

          <View style={{...styles.row, ...styles.line}}>
            <Text>身份证国徽面</Text>
            <TouchableHighlight onPress={() => this.showImage(1)}>
            <Image
              style={styles.productImg}
              source={{uri: verify.idcardB}}
            />
            </TouchableHighlight>
          </View>

          <View style={{...styles.row, ...styles.line}}>
            <Text>营业执照</Text>
            <TouchableHighlight onPress={() => this.showImage(2)}>
            <Image
              style={styles.productImg}
              source={{uri: verify.businessLicense}}
            />
            </TouchableHighlight>
          </View>

          <View style={{...styles.row, ...styles.line}}>
            <Text>手持身份证、营业执照</Text>
            <TouchableHighlight onPress={() => this.showImage(3)}>
            <Image
              style={styles.productImg}
              source={{uri: verify.certPersonPic}}
            />
            </TouchableHighlight>
          </View>
        </ScrollView>
      </View>
      
    );
  }
}

export default AuditDetail;
