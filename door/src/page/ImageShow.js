import React, {Component} from 'react';

import {
  StyleSheet,
    View,
    Dimensions
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import bk from '../images/images/bk.jpg'


const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
  },
});

class ImageShow extends Component {
    constructor(props) {
        super(props);
        let {images, imageIndex} = this.props.route.params;
        this.state = {
          images,
          imageIndex
        };
    }
  
    render() {
        return (
            <View style={styles.container}>
                <ImageViewer
                    imageUrls={this.state.images}
                    enableImageZoom={true}
                    index={this.state.imageIndex} 
                    failImageSource={bk}
                    onChange={(index) => {}} 
                    onClick={() => { 
                        this.props.navigation.goBack();
                    }}
                />
            </View>
        );
    }
}
export default ImageShow;