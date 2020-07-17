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

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        <Text style={styles.text}>user</Text>
      </View>
    );
  }
}

User.propTypes = {};

export default User;
