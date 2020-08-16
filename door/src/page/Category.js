import React from 'react';
import {StyleSheet, View, ScrollView, Text, Image, TouchableHighlight, Dimensions} from 'react-native';
import {get} from '../api/request'

const styles = StyleSheet.create({
  cateName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  cateNameSelected: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16
  },
  container: {
    height: Dimensions.get('window').height,
    flexDirection: 'row'
  },
  sidebar: {
    height: Dimensions.get('window').height,
    backgroundColor: '#1296DB',
    width: 120
  },
  content: {
    flex:1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#F2F2F2'
  },
  img: {
    height: 60,
    width: 60
  },
  listItem: {
    padding: 10,
    justifyContent:"center",
    alignItems:"center",
    borderColor: '#0785C0',
    borderBottomWidth: 1
  },
  listItemSelected: {
    padding: 10,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor: '#F2F2F2'
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
    get('/api/category/list', {root: cate.id}, res => {
      console.log("加载二级品类", res)
      let cates = res.data
      this.setState({
        secondCates: cates
      })
      
    })
  }

  onFirstCateSelected(cate) {
    this.setState({
      selected: cate
    })
    this.loadSecondCateList(cate)
  }

  componentDidMount() {
    get('/api/category/list', {root: 0}, res => {
      console.log("一级品类", res)
      let cates = res.data
      this.setState({
        firstCates: cates
      })
      if(cates && cates.length > 0) {
        this.setState({selected: cates[0]})
        this.loadSecondCateList(cates[0])
      }
    })
  }
  
  componentWillUnmount() {
    this.setState = ()=>false;
  }

  render() {
    let {firstCates, secondCates, selected} = this.state
    return (
      <View style={styles.container}>
        <View style={styles.sidebar}>
          {  firstCates && firstCates.map((cate,index) => (
            <TouchableHighlight key={index} onPress = { (e) => this.onFirstCateSelected(cate) }>
              <View style={cate === selected ? styles.listItemSelected: styles.listItem}>
                <Text style={cate === selected ? styles.cateNameSelected:styles.cateName}>{cate.name}</Text>
              </View>
            </TouchableHighlight>
          ))}
        </View>
        
        <ScrollView>
          <View style={styles.content}>
            {  secondCates && secondCates.map((cate,index) => (
              <TouchableHighlight key={index} onPress = { (e) => this.onSecondCateClicked(cate) }>
                <View style={styles.categoryItem}>
                  <Image source={{uri:cate.shortcut}} style={styles.img} />
                  <Text>{cate.name}</Text>
                </View>
              </TouchableHighlight>
            ))}
            
          </View>
        </ScrollView>
      </View>
    );
  }
}

Category.propTypes = {};

export default Category;
