import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const styles = StyleSheet.create({
  text: {
    color: 'red',
  },
});

class Category extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        <Text style={styles.text}>category</Text>
      </View>
    );
  }
}

Category.propTypes = {};

export default Category;
