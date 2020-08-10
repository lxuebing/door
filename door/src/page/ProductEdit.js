import React from 'react';
import {StyleSheet, View, Image, Button, TextInput, Text, TouchableHighlight} from 'react-native';
import Swiper from 'react-native-swiper';
import ImagePicker from 'react-native-image-picker'
import DropDownPicker from 'react-native-dropdown-picker'

import addImg from '../images/icons/addImg.png';
import {get, request, uploadImg} from '../api/request'

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
    if(!this.props.route || !this.props.route.params || !this.props.route.params.productId) {
      return
    }
    this.loadCategorys()
    this.loadProductDetail()
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
    request({ method: 'POST', url, data }).then(res => {
      console.log("成功", res.data)
    }).catch(err => {
      console.log("失败", err)
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
        uploadImg(source).then(res => {
          let data = res.data
          console.log("上传成功：", data)
          let imgs = this.state.imgs || []
          imgs.push(data.data)
          this.setState({imgs})
        }).catch(err => {
          console.log("上传失败：", err)
        })
      }
      
    });
  }

  removeImg() {
    console.log("删除图片")
    
  }

  loadCategorys() {
    get('/api/category/all')
    .then((res) => {
      let data = res.data
      console.log("品类树", data)
      if(data.code === 0) {
        let cates = data.data
        let cateList = []
        this.toDropListItems(cateList, {children:cates})
        console.log(cateList)
        this.setState({
          cateList
        })
      } else {
        // todo: token错误提示
      }
    })
    .catch((error) => {
      console.log("获取品类树失败", error)
    })
  }

  loadProductDetail() {
    get('/api/product/detail', {id: this.props.route.params.productId})
      .then((res) => {
        let data = res.data
        console.log("商品详情", data)
        if(data.code == 0) {
          this.setState({
            product: data.data,
            imgs: data.images
          })
        } else {
          console.log("获取商品详情失败: ", data)
        }
      })
      .catch((error) => {
        console.log("error: ", error)
      }
    )
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
      <View>
        <View style={styles.row}>
          <Text>名称：</Text>
          <TextInput style={styles.input} defaultValue={product.name} onChangeText={name => this.changeState({name})}/>
        </View>
        <View style={styles.row}>
          <Text>单价：</Text>
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
          <TextInput style={styles.input} defaultValue={product.summary}/>
        </View>
        <View style={styles.row}>
          <Text>图片：</Text>
          {
            imgs && imgs.map((item, index) => (
              <Image key={index} style={styles.img} source={{uri: item}}/>
              ))
          }
          <TouchableHighlight onPress={() => this.addImg()}>
            <Image style={styles.img} source={addImg} />
          </TouchableHighlight>
        </View>
        <View style={styles.row}>
          <Text>详情：</Text>
          <TextInput placeholder={'输入产品详情'} defaultValue={product.detail}/>
        </View>
        <View style={styles.row}>
          <Button title={'保存'} onPress={() => this.save()} />
          <Button title={'立即发布'} />
        </View>
      </View>
    );
  }
}

ProductEdit.propTypes = {};

export default ProductEdit;
