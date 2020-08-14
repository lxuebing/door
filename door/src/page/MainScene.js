import React from 'react';
import {View, Text, DeviceEventEmitter} from 'react-native'
import CustomerScene from './CustomerScene';
import ManageScene from './ManageScene';
import { Loading, EasyLoading } from 'react-native-easy-loading'

export default class MainScene extends React.Component {

  constructor(props){
      super(props);
      this.state = {
          mode: 1
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
    this.loadingListener = DeviceEventEmitter.addListener('loading',function({msg}){
      console.log("显示加载中", msg)
      EasyLoading.show(msg)
    })
    this.dismisListener = DeviceEventEmitter.addListener('dismis',function(){
      EasyLoading.dismis()
    })
  }
  
  componentWillUnmount() {
    this.modeListener.remove()
    this.loadingListener.remove()
    this.dismisListener.remove()
  }

  render() {
    return (
      <>
      <Loading/>
      {
        this.state.mode === 1 ? <CustomerScene></CustomerScene> : <ManageScene></ManageScene>
      }
      </>
    )
  }
  
};
