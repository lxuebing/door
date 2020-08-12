import React from 'react';
import {View, Text, DeviceEventEmitter} from 'react-native'
import CustomerScene from './CustomerScene';
import ManageScene from './ManageScene';

export default class MainScene extends React.Component {

  constructor(props){
      super(props);
      this.state = {
          mode: 0
      };
  }

  componentDidMount(){
    var self = this
    this.modeListener = DeviceEventEmitter.addListener('switchMode',function(url){
      console.log("切换用户模式")
      self.setState({
        mode: (self.state.mode + 1) % 2
      })
    })
  }
  
  componentWillUnmount() {
    this.modeListener.remove()
  }

  render() {
    return this.state.mode === 1 ? <CustomerScene></CustomerScene> : <ManageScene></ManageScene>
  }
  
};
