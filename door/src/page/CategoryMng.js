import React from 'react';
import {StyleSheet, View, Text, Button, Image, TextInput, TouchableHighlight, Dimensions} from 'react-native';
import homePicture from '../images/icons/home.png';
import TreeView from './component/TreeView'

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
});

class CategoryMng extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryTree: [
        
      ]
    };
  }

  componentDidMount() {
    fetch('http://mockjs.docway.net/mock/1WpkXqZLoSf/api/category/all')
      .then((response) => {
        return response.json()
      })
      .then((res) => {
        console.log("品类树", res)
        if(res.code === 1) {
          let cates = res.data
          this.setState({
            categoryTree: cates
          })
        } else {
          // todo: token错误提示
        }
      })
      .catch((error) => {
        console.log(222, error)
      })
  }

  onItemClick(item) {
    console.log("选中品类：", item)
    item.isOpen = !item.isOpen
    this.setState({
        test: 0,
    })
  }

  onSave() {
    console.log("快速添加")
  }

  render() {
    let {categoryTree} = this.state
    return (
      <View style={styles.container}>
        <View style={styles.editPanel}>
          <View style={styles.formRow}>
            <Text>品类名称：</Text>
            <TextInput placeholder={"请输入品类名称"}/>
          </View>
          <View style={styles.formRow}>
            <Text>上级品类：</Text>
            <TextInput placeholder={"请选择上级品类"}/>
          </View>
          <View style={styles.formRow}>
            <Text>品类图标：</Text>
          </View>
          <View style={styles.formRow}>
            <Button title={'快速添加'} onPress={this.onSave}/>
          </View>
        </View>
        
        <View style={styles.categoryTree}>
          <TreeView
            data={categoryTree}
            onItemClick={(item) => this.onItemClick(item)}
            titleKey={'name'}
          />
        </View>
      </View>
    );
  }
}

CategoryMng.propTypes = {};

export default CategoryMng;
