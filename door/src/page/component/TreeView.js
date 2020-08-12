import React, {Component} from 'react'
import {
    View,
    FlatList,
    Platform,
    LayoutAnimation,
    UIManager,
    Animated,
    Text,
    Image,
    TouchableOpacity
} from "react-native";

export default class NurTreeView extends Component {

    renderItem(item, index, style) {
        if(!item) return;
        return (<View
            style={[, style]}>
            <TouchableOpacity
                onPress={() => this.props.onItemClick && this.props.onItemClick(item)}
                style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >

                <View style={[{
                    flexDirection: 'row',
                    alignItems: 'center'
                }]}>
                    <Text style={{color: 'white'}}>{item[this.props.titleKey]}</Text>
                </View>


                <Image
                    style={[{width: 12, height: 12, tintColor: 'white'}]}
                    source={!item.isOpen ? require('../../images/icons/add.png') :
                        require('../../images/icons/minus.png')}/>

            </TouchableOpacity>

            {/**items*/}
            {item.isOpen ? this.renderFlatList(item.children,
                ({item, index}) => this.renderItem(item, index, {
                    paddingLeft: 20,
                })) : null}

        </View>);
    }


    /**
     * render FlatList
     */
    renderFlatList(data, renderItem) {
        return <FlatList
            data={data}
            renderItem={renderItem}
            extraData={this.props}
            keyExtractor={(item, index) => index.toString()}
        />
    }

    render() {
        return (<View >

            {this.renderFlatList(this.props.data,
                ({item, index}) => this.renderItem(item, index, {
                    marginTop: 8,
                    backgroundColor: index % 2 === 0 ? '#006c9b' : '#009a4e',
                    paddingRight: 16
                }))}

        </View>)
    }
}