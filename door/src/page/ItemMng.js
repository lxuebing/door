import React from 'react';
import {StyleSheet, View, Image, Button, TextInput, Text, Alert} from 'react-native';
import Selector from './component/Selector'
import {get, post} from '../api/request'
import {buildParamsString} from '../utils/StringUtil'
import { WToast } from 'react-native-smart-tip';
import Modal from "react-native-modal"

const styles = StyleSheet.create({
    row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    item: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5,
        margin: 5,
        borderWidth: 1,
        borderColor: 'silver',
        backgroundColor: 'white',
        borderRadius: 5
    }, 
    itemText: {
        fontSize: 20
    },
    itemPrice: {
      fontSize: 20,
      color: 'red'
    }
});

export default class ItemMng extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        items:[],
        colors: [],
        openways: [],
        showModel: false
    };
  }

  loadDict() {
      get('/api/dict/color', {}, res => {
          this.setState({
              colors: res.data
          })
      })
      get('/api/dict/openway', {}, res => {
        this.setState({
            openways: res.data
        })
    })
  }

  componentDidMount() {
    this.loadItems()
    this.loadDict()
  }
  
  componentWillUnmount() {
    this.setState = ()=>false;
  }

  add() {
    console.log("商品id", this.props.productId)
    let {color, openway, width, height, price} = this.state
    let data = {
        productId: this.props.productId,
        price,
        params: {
            color: color && color.value,
            openway: openway && openway.value,
            width, height
        }
    }
    console.log("保存商品Item信息：", data)
    post('/api/manage/product/item/add', data, res => {
      console.log("保存商品Item信息结果：", res.data)
      WToast.show({data: '添加成功'})
      this.loadItems()
    })
  }

  delete(item) {
    console.log("删除item", item)
    get('/api/manage/product/item/delete', {itemId: item.id}, res => {
        WToast.show({data: '删除成功'})
        this.loadItems()
    })
  }

  addColor() {
    let value = this.state.addColorValue
    console.log("添加颜色", value)
    if(!value || value.length < 1) {
      WToast.show({data: '请输入颜色'})
      return 
    }
    get('/api/manage/dict/color/add', {value}, res => {
        this.setState({showModel: false})
        WToast.show({data: '添加成功'})
        this.loadDict()
    })
  }

  deleteColor(color) {
    console.log("删除颜色", color)
    Alert.alert('删除颜色', '确定要删除颜色“' + color.value + '”吗？',
      [
        {text:'取消', onPress: () => {}},
        {text:'删除', onPress: () => {
          get('/api/manage/dict/color/delete', {key: color.key}, res => {
            console.log("删除颜色结果", res.data)
            WToast.show({data: "已删除"})
            this.loadDict()
          })
        }}
      ]
    )
  }

  loadItems() {
    let productId = this.props.productId
    get('/api/product/item/list', {productId}, res => {
      console.log("商品item列表", res)
      this.setState({
        items: res.data
      })
    })
  }

  render() {
    let {items, colors, openways, color, openway} = this.state
    return (
      <View>
        <Modal isVisible={this.state.showModel} backdropOpacity={0.5} style={{margin: 0, alignItems:'center', justifyContent: 'center'}} onBackdropPress={() => this.setState({ ModalIntroToggle: false })}>
            <View style={{backgroundColor: 'white', justifyContent: 'center', width: 280, padding: 10}}>
              <View style={styles.row}>
                <TextInput onChangeText={text => this.setState({addColorValue: text})} style={{borderBottomColor: 'silver', borderBottomWidth: 1, width: 260, marginBottom: 10}} placeholder={'输入颜色'}/>
              </View>
              <View style={{...styles.row, justifyContent: 'space-between'}}>
                <Button onPress={() => this.setState({showModel: false})} title={'取消'}/>
                <Button onPress={() => this.addColor()} title={'添加'}/>
              </View>
            </View>
        </Modal>
        <View>
            <Button title={'添加标准门'} onPress={() => {this.add()}}/>
        </View>
        <View style={styles.parms}>
            <View style={styles.row}>
                <Text>颜色：</Text>
                <Selector items={colors} selected={color} onItemSelected={(color) => this.setState({color})}
                 onItemLongPress={(color) => this.deleteColor(color)}/>
                <Button onPress={() => this.setState({showModel: true})} title={'添加颜色'}/>
            </View>
            <View style={styles.row}>
                <Text>开向：</Text>
                <Selector items={openways} selected={openway} onItemSelected={(openway) => this.setState({openway})}/>
            </View>
            <View style={styles.row}>
                <Text>尺寸：</Text>
                <TextInput style={styles.tinyInput} placeholder={'输入宽度(mm)'} onChangeText={(text) => this.setState({width: text})}></TextInput>
                <Text> - </Text>
                <TextInput style={styles.tinyInput} placeholder={'输入高度(mm)'} onChangeText={(text) => this.setState({height: text})}></TextInput>
            </View>
            <View style={styles.row}>
                <Text>价格：</Text>
                <TextInput style={styles.tinyInput} placeholder={'价格必须是数字'} onChangeText={(text) => this.setState({price: text})}></TextInput>
            </View>
        </View>
        <View>
            {
                items && items.map((item, index) => {
                    return (
                        <View key={index} style={styles.item}>
                            <Text style={styles.itemText} >{buildParamsString(item.params)}</Text>
                            <Text style={styles.itemPrice} >￥{item.price}</Text>
                            <Button title={'删除'} onPress={() => this.delete(item)}/>
                        </View>
                    )
                })
            }
        </View>
      </View>
    );
  }
}

