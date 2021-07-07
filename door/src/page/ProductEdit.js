import React from 'react';
import {StyleSheet, View, ScrollView, KeyboardAvoidingView, Image, Button, TextInput, Text, TouchableHighlight, Alert} from 'react-native';
import ImagePicker from 'react-native-image-picker'
import DropDownPicker from 'react-native-dropdown-picker'

import addImg from '../images/icons/addImg.png';
import {get, post, uploadImg} from '../api/request'
import { WToast } from 'react-native-smart-tip';
import ItemMng from './ItemMng'

const styles = StyleSheet.create({
  text: {
    color: '#000',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'silver',
    flex: 1,
    margin: 10,
  },
  productInfo: {
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  imgList: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  img: {
    width: 80,
    height: 80,
    borderWidth: 5,
    borderColor: 'silver',
    margin: 10
  }
});

class ProductEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {
      },
      imgs: [
      ],
      cateList:[]
    };
  }

  componentDidMount() {
    this.loadCategorys()
    if(!this.props.route || !this.props.route.params || !this.props.route.params.productId) {
      return
    }
    this.loadProductDetail()
  }

  componentWillUnmount() {
    this.setState = ()=>false;
  }

  save() {
    console.log("state", this.state)
    let {product, imgs} = this.state
    let url = product.id ? '/api/manage/product/update':'/api/manage/product/add'
    let data = {
      ...product,
      img: imgs && imgs.length > 0 && imgs[0],
      images: imgs
    }
    console.log("保存商品信息：", data)
    post(url, data, res => {
      WToast.show({data: '保存成功'})
      console.log("商品信息",product)
      if(!product.id) {
        this.props.navigation.goBack()
      }
    })
  }

  changeState(state) {
    this.setState({
      product: {...this.state.product, ...state}
    })
  }

  addImg() {
    console.log("添加图片")
    const options = {
      title: '请选择',
      cancelButtonTitle:'取消',
      takePhotoButtonTitle:'拍照',
      chooseFromLibraryButtonTitle:'从相册选择',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('customButton')
      } else {
        const source = { uri: response.uri , type: response.type, name: response.fileName};
        console.log("source:" + source)
        uploadImg(source, res => {
          let imgs = this.state.imgs || []
          imgs.push(res.data)
          this.setState({imgs})
        })
      }
      
    });
  }

  removeImg(index) {
    let imgs = this.state.imgs
    Alert.alert('移除图片', '确定要移除该图片吗？',
      [
        {text:'取消', onPress: () => {}},
        {text:'移除', onPress: () => {
          imgs.splice(index, 1)
          this.setState({imgs})
        }}
      ]
    )
  }

  loadCategorys() {
    get('/api/category/all', {}, res => {
      console.log("品类树", res)
      let cates = res.data
      let cateList = []
      this.toDropListItems(cateList, {children:cates})
      console.log(cateList)
      this.setState({
        cateList
      })
    })
  
  }

  loadProductDetail() {
    get('/api/product/detail', {id: this.props.route.params.productId}, res => {
      console.log("商品详情", res)
      this.setState({
        product: res.data
      })
    })
    get('/api/product/image/list', {productId: this.props.route.params.productId}, res => {
      console.log("商品图片", res)
      this.setState({
        imgs: res.data
      })
    })
  }

  toDropListItems(list, node) {
    if(node.children && node.children.length > 0) {
      node.children.map(o => this.toDropListItems(list, o))
    } else {
      list.push({label: node.name, value: node.id})
    }
  }

  contain(cateList, cate) {
    if(!cateList) return false
    for(let idx in cateList) {
      if(cateList[idx].value === cate) return true
    }
    return false
  }

  render() {
    let {product, imgs, cateList} = this.state
    let cate = product.categoryId
    if(!this.contain(cateList, cate)) cate = undefined
    
    return (
      <KeyboardAvoidingView>
      <ScrollView>
        <View style={styles.row}>
          <Text>名称：</Text>
          <TextInput style={styles.input} defaultValue={product.name} onChangeText={name => this.changeState({name})}/>
          <Button title={'保存'} onPress={() => this.save()} />
        </View>
        <View style={styles.row}>
          <Text>参考价：</Text>
          <TextInput style={styles.input} defaultValue={product.price} onChangeText={price => this.changeState({price})}/>
        </View>
        <View style={styles.row}>
          <Text>品类：</Text>
          <DropDownPicker
            items={cateList}
            defaultValue={cate}
            containerStyle={{height: 40, flex: 1}}
            style={{backgroundColor: '#fafafa'}}
            itemStyle={{
                justifyContent: 'flex-start'
            }}
            dropDownStyle={{backgroundColor: '#fafafa'}}
            onChangeItem={item => this.changeState({categoryId: item.value})}
          />
        </View>
        <View style={styles.row}>
          <Text>简介：</Text>
          <TextInput style={styles.input} multiline={true} defaultValue={product.summary}  onChangeText={summary => this.changeState({summary})}/>
        </View>
        <View style={styles.row}>
          <Text>图片：</Text>
          <View style={styles.imgList}>
            {
              imgs && imgs.map((item, index) => (
                <TouchableHighlight key={index} onPress={() => this.removeImg(index)}>
                  <Image style={styles.img} source={{uri: item}}/>
                </TouchableHighlight>
                ))
            }
            <TouchableHighlight onPress={() => this.addImg()}>
              <Image style={styles.img} source={addImg} />
            </TouchableHighlight>
          </View>
        </View>
        {
          product && product.id && <ItemMng productId={product.id}/>
        }
      </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

ProductEdit.propTypes = {};

export default ProductEdit;
