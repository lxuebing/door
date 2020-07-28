import * as React from 'react';
import {StyleSheet, View, Text, Image, Dimensions} from 'react-native';

import homePicture from '../images/home.jpeg';
import moreCategory from '../images/icons/categorySelected.png';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  text: {
    color: '#000',
  },
  img: {
    width: width,
    height: 160,
    marginTop: 20,
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
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryList: [],
    };
  }

  componentDidMount() {
    fetch('http://mockjs.docway.net/mock/1WpkXqZLoSf/api/home/category/list')
      .then((response) => console.log(111, response.json()))
      .then((data) => console.log(222, data))
      .catch((error) => console.log(error));
  }

  render() {
    return (
      <View>
        <Image source={homePicture} style={styles.img} />
        <View style={styles.typeWrapper}>
          <View style={styles.typeContainer}>
            <Image source={homePicture} style={styles.typeImg} />
            <Text style={styles.typeText}>1111</Text>
          </View>
          <View style={styles.typeContainer}>
            <Image source={moreCategory} style={styles.typeImg} />
            <Text style={styles.typeText}>more</Text>
          </View>
        </View>
      </View>
    );
  }
}

Home.propTypes = {};

export default Home;
