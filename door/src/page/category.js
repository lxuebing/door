import React from 'react';
import {StyleSheet, View, Text, Image, TouchableHighlight, Dimensions} from 'react-native';
import homePicture from '../images/icons/home.png';

const styles = StyleSheet.create({
  text: {
    color: 'red',
  },
  container: {
    height: Dimensions.get('window').height,
    flexDirection: 'row'
  },
  sidebar: {
    height: Dimensions.get('window').height,
    backgroundColor: 'silver',
    width: 150
  },
  content: {
    flex:1,
    borderColor: 'blue',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  img: {
    height: 60,
    width: 60
  },
  listItem: {
    padding: 10,
    justifyContent:"center",
    alignItems:"center"
  },
  categoryItem: {
    padding: 20,
    alignItems: 'center'
  }
});

class Category extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstCates: [
      ],
      secondCates: [
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
    // todo: 点击二级品类跳转至商品列表页
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
    let {firstCates,secondCates} = this.state
    return (
      <View style={styles.container}>
        <View style={styles.sidebar}>
          {  firstCates && firstCates.map((cate,index) => (
            <TouchableHighlight onPress = { (e) => this.onFirstCateClicked(cate) }>
              <View style={styles.listItem}>
                <Text style={styles.text}>{cate.name}</Text>
              </View>
            </TouchableHighlight>
          ))}
        </View>
        
        <View style={styles.content}>
          {  secondCates && secondCates.map((cate,index) => (
            <TouchableHighlight onPress = { (e) => this.onSecondCateClicked(cate) }>
              <View style={styles.categoryItem}>
                <Image source={homePicture} style={styles.img} />
                <Text style={styles.text}>{cate.name}</Text>
              </View>
            </TouchableHighlight>
          ))}
          
        </View>
      </View>
    );
  }
}

Category.propTypes = {};

export default Category;
