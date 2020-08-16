import * as React from 'react';
import {StyleSheet, View, ScrollView, Text, Image, Dimensions, TouchableHighlight} from 'react-native';

import Swiper from 'react-native-swiper';
import moreCategory from '../images/icons/categorySelected.png';
import {get} from '../api/request'

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  swiperWrapper: {
    height: 200,
    width: width,
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'silver'
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  slideImg: {
    width: width,
    height: 200,
  },
  slideName: {
    fontSize: 30,
    width: width,
    paddingLeft: 10, 
    alignContent: 'center'
  },  
  typeWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeContainer: {
    width: width / 5,
    height: 100,
    flexDirection: 'column',
  },
  typeImg: {
    width: 60,
    height: 60,
    marginTop: 10,
    marginHorizontal: 7,
  },
  typeText: {
    textAlign: 'center',
  },
  plateWrapper: {
    width: width,
  },
  plateTitle: {
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  plateName: {
    fontSize: 20,
    color: '#5695D7',
    fontWeight: 'bold',
  },
  productContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  productItem: {
    backgroundColor: 'white',
    width: width / 2 - 20,
    margin: 5,
    borderRadius: 5
  },
  productImg: {
    width: width / 2 - 20,
    height: width / 2 - 20,
  },
  productName: {
    fontSize: 20,
  },
  productPrice: {
    color: 'red',
  }
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slide: [
        {
          productId: 2,
          name: 'aaaaa',
          img:'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1597474136&di=c741f78a8b58b1e76f463aaa45970a3e&src=http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg'
        },
        {
          productId: 3,
          name: 'bbbb',
          img:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3892521478,1695688217&fm=26&gp=0.jpg'
        }
      ],
      categoryList: [],
      plateList: []
    };
  }

  componentDidMount() {
    this.loadSlide()
    this.loadCategoryList()
    this.loadPlateList()
  }

  componentWillUnmount() {
    this.setState = ()=>false;
  }

  onSlideClicked(slide) {
    console.log("选中轮播", slide)
  }

  loadSlide() {
    get('/api/home/slide', {}, res => {
      console.log("首页轮播", res) 
      this.setState({slide: res.data})
    })
  }

  loadCategoryList() {
    get('/api/home/category/list', {}, res=> {
      console.log("首页品类列表", res)
      this.setState({categoryList: res.data})
    })
  }

  loadPlateList() {
    get('/api/home/plate', {}, res=> {
      console.log("首页板块列表", res)
      this.setState({plateList: res.data})
    })
  }

  renderPlate(plate) {
    return (
      <View key={plate.id} style={styles.plateWrapper}>
        <View style={styles.plateTitle}>
          <Text style={styles.plateName}>{plate.name}</Text>
        </View>
        <View style={styles.productContainer}>
          {
            plate.products.map((item, index) => (
              <TouchableHighlight key={index} onPress={() => this.props.navigation.navigate('Product', {productId: item.id})}>
                <View style={styles.productItem}>
                  <Image source={{uri: item.img}} style={styles.productImg}/>
                  <View style={styles.productDetail}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productPrice}>￥{item.price}</Text>
                  </View>
                </View>
              </TouchableHighlight>
            ))
          }
        </View>
      </View>
    )
  }

  render() {
    let {slide, categoryList, plateList} = this.state
    return (
      <ScrollView style={{backgroundColor: '#eee'}}>
        <View style={styles.swiperWrapper}>
          <Swiper style={styles.wrapper} autoplay>
            {
              slide && slide.map((item, index) => (
                <View key={index} style={styles.slide}>
                  <TouchableHighlight onPress={() => this.onSlideClicked(slide)}>
                    <Image source={{uri: item.img}} style={styles.slideImg} />
                  </TouchableHighlight>
                </View>
              )) 
            }
          </Swiper>
        </View>
        <View style={styles.typeWrapper}>
          {
            categoryList && categoryList.map((cate, index) => (
              <TouchableHighlight key={index} onPress={() => this.props.navigation.navigate('ProductList', {category: cate.id})}>
                <View style={styles.typeContainer}>
                  <Image source={{uri: cate.shortcut}} style={styles.typeImg} />
                  <Text style={styles.typeText}>{cate.name}</Text>
                </View>
              </TouchableHighlight>
            ))
          }
          <TouchableHighlight onPress={() => this.props.navigation.navigate('Category')}>
            <View style={styles.typeContainer}>
              <Image source={moreCategory} style={styles.typeImg} />
              <Text style={styles.typeText}>more</Text>
            </View>
          </TouchableHighlight>
        </View>
        {
          plateList && plateList.map(plate => this.renderPlate(plate))
        }
      </ScrollView>
    );
  }
}

Home.propTypes = {};

export default Home;