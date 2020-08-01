import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const styles = StyleSheet.create({
  text: {
    color: 'yellow',
  },
});

class ShoppingCart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        <Text style={styles.text}>shoppingCart</Text>
      </View>
    );
  }
}

ShoppingCart.propTypes = {};

export default ShoppingCart;
