import React from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';
import User from './user';
import BottomTab from '../component/bottomTab';

const styles = StyleSheet.create({
  text: {
    color: 'red'
  }
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        <Text style={styles.text}>home</Text>
        <User/>
        <BottomTab/>
      </View>
    );
  }
}

Home.propTypes = {};

export default Home;
