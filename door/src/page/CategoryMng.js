import React from 'react';
import {StyleSheet, View, ScrollView, Text, Button, Image, TextInput, TouchableHighlight, Dimensions, DeviceEventEmitter} from 'react-native';
import TreeView from './component/TreeView'
import {get, request, uploadImg} from '../api/request'
import addImg from '../images/icons/addImg.png';
import ImagePicker from 'react-native-image-picker'
import DropDownPicker from 'react-native-dropdown-picker'
import { Loading, EasyLoading } from 'react-native-easy-loading'
import {WToast} from 'react-native-smart-tip'

const styles = StyleSheet.create({
  text: {
    color: 'red',
  },
  container: {
    height: Dimensions.get('window').height
  },
  editPanel: {
    width: Dimensions.get('window').width,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'gray'
  },
  formRow: {
    height: 'auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  categoryTree: {
    
  },
  img: {
    width: 80,
    height: 80,
    borderWidth: 5,
    borderColor: 'silver',
    margin: 10
  }
});

class CategoryMng extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryTree: [
        
      ],
      cateList: []
    };
  }

  componentDidMount() {
    this.loadCategoryTree()
  }

  loadCategoryTree() {
    get('/api/category/all')
    .then((res) => {
      let data = res.data
      console.log("品类树", data)
      if(data.code === 0) {
        let cates = data.data
        this.setState({
          categoryTree: cates,
          cateList: this.toCateList(cates)
        })
      } else {
        // todo: token错误提示
        console.log("获取品类树失败", error)
      }
    })
    .catch((error) => {
      console.log("获取品类树失败", error)
    })
  }

  toCateList(cates) {
    let cateList = []
    if(cates) {
      cates.map(cate => {
        cateList.push({label: cate.name, value: cate.id})
      })
    }
    return cateList
  }

  onItemClick(item) {
    console.log("选中品类：", item)
    item.isOpen = !item.isOpen
    this.setState({
        test: 0,
    })
  }

  onSave() {
    let data = {
      name: this.state.name, 
      parentId: this.state.parentId, 
      shortcut: "xxx"
    }
    console.log("快速添加品类：", data)
    request({url:'/api/manage/category/add', method:'POST', data})
    .then(res => {
      if(res.data.code === 0) {
        console.log("添加品类成功", res.data)
        this.loadCategoryTree()
      } else {
        console.log("添加品类失败", res.data)
        WToast.show({data: res.data.data})
      }
    }).catch(err => {
      console.log("添加品类失败", err)
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
        EasyLoading.show('图片上传中...')
        uploadImg(source).then(res => {
          let data = res.data
          console.log("上传成功：", data)
          this.setState({img: data.data})
          EasyLoading.dismis()
        }).catch(err => {
          console.log("上传失败：", err)
          EasyLoading.dismis()
        })
      }
      
    });
  }

  render() {
    let {categoryTree, cateList, img} = this.state
    return (
      <View style={styles.container}>
        <View style={styles.editPanel}>
          <View style={styles.formRow}>
            <Text>品类名称：</Text>
            <TextInput placeholder={"请输入品类名称"} onChangeText={name => this.setState({name})}/>
          </View>
          <View style={styles.formRow}>
            <Text>上级品类：</Text>
            <DropDownPicker
              items={cateList}
              containerStyle={{height: 40, flex: 1}}
              style={{backgroundColor: '#fafafa'}}
              itemStyle={{
                  justifyContent: 'flex-start'
              }}
              placeholder={'选择上级品类'}
              dropDownStyle={{backgroundColor: '#fafafa'}}
              onChangeItem={item => this.setState({parentId: item.value})}
            />
          </View>
          <View style={styles.formRow}>
            <Text>品类图标：</Text>
            <TouchableHighlight onPress={() => this.addImg()}>
              <Image style={styles.img} source={img ? {uri: img} : addImg} />
            </TouchableHighlight>
          </View>
          <View style={styles.formRow}>
            <Button title={'快速添加'} onPress={() => this.onSave()}/>
          </View>
        </View>
        
        <View style={styles.categoryTree}>
          <TreeView
            data={categoryTree}
            onItemClick={(item) => this.onItemClick(item)}
            titleKey={'name'}
          />
        </View>
        <Loading />
      </View>
    );
  }
}

CategoryMng.propTypes = {};

export default CategoryMng;
