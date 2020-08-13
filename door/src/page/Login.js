import React from 'react';
import {StyleSheet, View, Image, Button, Text, TextInput, TouchableHighlight, Dimensions} from 'react-native';
import uuid from '../utils/UUID'
import axios from 'axios'
import { WToast } from 'react-native-smart-tip';
import {saveToken} from '../api/storage'

const styles = StyleSheet.create({
    loginForm: {
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        margin: 50
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    kaptchaImg: {
        width: 100,
        height: 32
    },
    input: {
        flex: 1,
        borderBottomColor: 'silver',
        borderBottomWidth: 1
    }
});

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          
        }
    }

    refreshKaptcha() {
        this.setState({
            kaptchaImg: 'https://www.lemonlog.wang/user/auth/kaptcha?kaptchaKey=' + this.kaptchaKey + '&r=' + Date.now()
        })
    }

    componentDidMount() {
        this.kaptchaKey = uuid()
        this.refreshKaptcha()
    }

    login() {
        let {username, password, kaptcha} = this.state 
        axios.post('https://www.lemonlog.wang/user/auth/login', 
            {
                identifier: username,
                password,
                type: "username",
                kaptcha,
                kaptchaKey: this.kaptchaKey
            }
        ).then(res => {
            let data = res.data
            console.log("登录结果", data)
            if(data.code === 0) {
                saveToken(data.data)
                let nav = this.props.navigation
                if(nav.canGoBack()) {
                    nav.goBack()
                } else {
                    nav.navigate('User')
                }
            } else {
                WToast.show({data:data.data})
            }
            this.refreshKaptcha()
        }).catch(err => {
            console.log("登录失败", err)
            WToast.show({data:"登录失败！"})
            this.refreshKaptcha()
        })
    }

    render() {
        return (
            <View style={styles.loginForm}>
                <View style={styles.row}>
                    <Image></Image>
                    <TextInput style={styles.input} placeholder={'账号'} onChangeText={username => this.setState({username})}/>
                </View>
                <View style={styles.row}>
                    <Image></Image>
                    <TextInput style={styles.input} placeholder={'密码'} onChangeText={password => this.setState({password})}/>
                </View>
                <View style={styles.row}>
                    <TextInput style={styles.input} placeholder={'验证码'} onChangeText={kaptcha => this.setState({kaptcha})}/>
                    <TouchableHighlight onPress={() => this.refreshKaptcha()}>
                        <Image style={styles.kaptchaImg} source={{uri: this.state.kaptchaImg}} />
                    </TouchableHighlight>
                </View>
                <View style={{...styles.row, marginTop: 20}}>
                    <Button title={'登录'} onPress={() => this.login()}/>
                </View>
            </View>
        )
    }
}