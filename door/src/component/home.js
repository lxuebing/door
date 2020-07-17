import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

const styles = StyleSheet.create({
  text: {
    color: 'blue',
    marginTop: 50
  },
});

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text style={styles.text}>111</Text>
      </View>
    )
  }
}

export default Home;
