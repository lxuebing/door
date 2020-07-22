import * as React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import User from './user';

const styles = StyleSheet.create({
  text: {
    color: '#000',
  },
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
        <User />
      </View>
    );
  }
}

Home.propTypes = {};

export default Home;
