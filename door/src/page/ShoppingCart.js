import React from 'react'
import {StyleSheet, Button, View, Text} from 'react-native'
import ImagePicker from 'react-native-image-picker'

const styles = StyleSheet.create({
  text: {
    color: 'yellow',
  },
});

class ShoppingCart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  upload() {
    uploadImage('file://../images/images/bk.jpg')
  }

  pickImage() {
    const options = {
      title:'选择图片',
      cancelButtonTitle:'取消',
      takePhotoButtonTitle:'拍照',
      chooseFromLibraryButtonTitle:'相册',
      mediaType:'photo',
      allowsEditing:true,
    }
    let that = this
    ImagePicker.showImagePicker(options, (response)=>{
        if(response.didCancel){
            console.warn('cancel')
        }else if(response.error){
            console.warn(response.error)
        }else{
          uploadImage(response.uri)
        }
    })
  }

  render() {
    return (
      <View>
        <Text style={styles.text}>shoppingCart</Text>
      </View>
    );
  }
}

ShoppingCart.propTypes = {};

export default ShoppingCart;
