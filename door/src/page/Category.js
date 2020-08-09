import React from 'react';
import {StyleSheet, View, Text, Image, TouchableHighlight, Dimensions} from 'react-native';
import {get} from '../api/request'

const styles = StyleSheet.create({
  text: {
    color: 'black',
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
      ]
    };
  }

  onSecondCateClicked(cate) {
    console.log("2级品类: " + cate.name)
    console.log("导航",this.props.navigation)
    this.props.navigation.navigate('ProductList', {category: cate.id})
  }

  loadSecondCateList(cate) {
    console.log("1级品类: " + cate.id + cate.name)
    get('/api/category/list', {root: cate.id})
      .then((res) => {
        console.log("加载二级品类", res)
        if(res.code === 0) {
          let cates = res.data
          this.setState({
            secondCates: cates
          })
        } else {
          // todo: token错误提示
          console.log("错误")
        }
      })
      .catch((error) => {
        console.log("获取二级品类失败", error)
      })
  }

  componentDidMount() {
    get('/api/category/list', {root: 0})
      .then((res) => {
        console.log("一级品类", res)
        if(res.code === 0) {
          let cates = res.data
          this.setState({
            firstCates: cates
          })
          if(cates && cates.length > 0) this.loadSecondCateList(cates[0])
        } else {
          // todo: token错误提示
          console.log("错误")
        }
      })
      .catch((error) => {
        console.log("获取一级品类失败", error)
      })
  }

  render() {
    let {firstCates,secondCates} = this.state
    return (
      <View style={styles.container}>
        <View style={styles.sidebar}>
          {  firstCates && firstCates.map((cate,index) => (
            <TouchableHighlight key={index} onPress = { (e) => this.loadSecondCateList(cate) }>
              <View style={styles.listItem}>
                <Text style={styles.text}>{cate.name}</Text>
              </View>
            </TouchableHighlight>
          ))}
        </View>
        
        <View style={styles.content}>
          {  secondCates && secondCates.map((cate,index) => (
            <TouchableHighlight key={index} onPress = { (e) => this.onSecondCateClicked(cate) }>
              <View style={styles.categoryItem}>
                <Image source={{uri:cate.shortcut}} style={styles.img} />
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
