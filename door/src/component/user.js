import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  text: {
    color: 'red',
    fontSize: 28,
  }
});

function User() {
  return (
    <View >
      <Text style={styles.text}>user</Text>
    </View>
  );
}

export default User;
