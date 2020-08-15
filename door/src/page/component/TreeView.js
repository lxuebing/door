import React from 'react'
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity
} from "react-native";
import trashIcon from '../../images/icons/trash.png'
import addIcon from '../../images/icons/add.png'
import minusIcon from '../../images/icons/minus.png'

const styles = StyleSheet.create({
    node: {
        borderColor: 'silver',
        borderBottomWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    name: {
        fontSize: 20,
    },
    operations: {
        display: 'flex',
        backgroundColor: 'white',
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        marginLeft: 'auto'
    },
    trashIcon: {
        width: 15,
        height: 15
    },
    openIcon: {
        tintColor: '#555',
        width: 15,
        height: 15,
        marginRight: 10
    },
    shortcut: {
        width: 20,
        height: 20,
    }
  });

  
export default function TreeView({tree, onItemClicked, onDelete}) {

    const hasChildren = (node) => {
        return node.children && node.children.length > 0
    }

    const getOpenIcon = (node) => {
        if(hasChildren(node)) {
            return node.isOpen ? minusIcon: addIcon
        } 
    }

    const renderTreeNode = (node, level) => {
        return (
            <>
            <TouchableOpacity key={node.id} onPress={() => onItemClicked && onItemClicked(node)}>
                <View style={{...styles.node, paddingLeft: 20 * level + 8, backgroundColor: level === 0 && 'white'}}>
                    <Image style={styles.openIcon} source={getOpenIcon(node)} />
                    <Image style={styles.shortcut} source={{uri: node.shortcut}} />
                    <Text style={styles.name}>{node.name}</Text>
                    <TouchableOpacity style={styles.operations} onPress={() => onDelete && onDelete(node)}>
                        <Image style={styles.trashIcon} source={trashIcon} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
            {
                hasChildren(node) && node.isOpen && node.children.map(item => {
                    return renderTreeNode(item, level + 1)
                })
            }
            </>
        )
    }
    let nodes = tree 

    return (
        <View style={{flex: 1}}>
            {
                nodes && nodes.map(node => {
                    return renderTreeNode(node, 0)
                })
            }
        </View>
    )
}