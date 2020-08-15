import React from 'react';
import {StyleSheet, View, Image, Button, TextInput, Text, TouchableHighlight} from 'react-native';
import Selector from './component/Selector'
import {get, post} from '../api/request'
import {buildParamsString} from '../utils/StringUtil'
import { WToast } from 'react-native-smart-tip';

const styles = StyleSheet.create({
    row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
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
    }
});

export default class ItemMng extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        items:[],
        colors: [],
        openways: []
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

  add() {
    console.log("商品id", this.props.productId)
    let {color, openway, width, height} = this.state
    let data = {
        productId: this.props.productId,
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
        <View>
            <Button title={'添加标准门'} onPress={() => {this.add()}}/>
        </View>
        <View style={styles.parms}>
            <View style={styles.row}>
                <Text>颜色：</Text>
                <Selector items={colors} selected={color} onItemSelected={(color) => this.setState({color})}/>
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
        </View>
        <View>
            {
                items && items.map((item, index) => {
                    return (
                        <View style={styles.item}>
                            <Text style={styles.itemText} key={index}>{buildParamsString(item.params)}</Text>
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

