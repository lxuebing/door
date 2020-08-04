import React from 'react';
import {StyleSheet, View, Text, Image, TouchableHighlight, Dimensions} from 'react-native';
import homePicture from '../images/icons/home.png';

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
    height: 150,
    borderBottomWidth: 1,
    borderBottomColor: 'gray'
  },
  categoryTree: {
    
  },
});

class CategoryMng extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstCates: [
      ],
      categoryTree: [
        {
          id: 1,
          name: "品类1",
          shortcut: "",
        },
        {
          id: 2,
          name: "品类2",
          shortcut: "",
        },
        {
          id: 3,
          name: "品类3",
          shortcut: "",
        },
        {
          id: 4,
          name: "品类4",
          shortcut: "",
        },
        {
          id: 5,
          name: "品类5",
          shortcut: "",
        },
        {
          id: 6,
          name: "品类6",
          shortcut: "",
        }
      ]
    };
  }

  onFirstCateClicked(cate) {
    console.log("1级品类: " + cate.id + cate.name)
    // todo: 点击一级品类加载该品类下的二级品类
  }

  onSecondCateClicked(cate) {
    console.log("2级品类: " + cate.name)
    console.log("导航",this.props.navigation)
    this.props.navigation.navigate('ProductList')
  }

  loadSecondCateList(cateId) {
    // todo: 加载二级品类
  }

  componentDidMount() {
    fetch('http://mockjs.docway.net/mock/1WpkXqZLoSf/api/category/list?root=0')
      .then((response) => {
        return response.json()
      })
      .then((res) => {
        console.log("一级品类", res)
        if(res.code === 1) {
          let cates = res.data
          this.setState({
            firstCates: cates
          })
          if(cates && cates.length > 0) this.loadSecondCateList(cates[0].id)
        } else {
          // todo: token错误提示
        }
      })
      .catch((error) => {
        console.log(222, error)
      })
  }

  render() {
    let {categoryTree} = this.state
    return (
      <View style={styles.container}>
        <View style={styles.editPanel}>
          <Text>品类编辑/添加</Text>
        </View>
        
        <View style={styles.categoryTree}>
          <Text>TreeView</Text>
        </View>
      </View>
    );
  }
}

CategoryMng.propTypes = {};

export default CategoryMng;
