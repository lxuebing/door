import React from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';

const styles = StyleSheet.create({
  text: {
    color: 'red'
  }
});

class BottomTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        <Text style={styles.text}>bottomTab</Text>
      </View>
    );
  }
}

BottomTab.propTypes = {};

export default BottomTab;
