import React, {Component} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {connect} from "react-redux";
import { getNEMtxs } from '../../../redux/transactions/actions';

class NEMTransaction extends Component {

    componentDidMount() {
        this.props.getNEMtxs()
    }

    render() {
        const {txList} = this.props;
        console.log('In list')        
        console.log(this.props)
        console.log(txList)
        return (
            <View style={styles.container}>
                <FlatList 
                    style={styles.flatListItem}
                    data={txList}
                    renderItem={({item, index}) => {                                                
                        const {hash, height, id} = item.meta;
                        const {amount, deadline, fee, recipient, type} = item.transaction;
                        console.log(item.meta);
                        console.log(item.transaction);
                        return (
                            <View key={index}>
                                <Text> -----------------BEGIN----------------</Text>                                
                                <Text> HASH: {hash.data.toString()}</Text>                                
                                <Text> Height: {height}</Text>
                                <Text> Id: {id}</Text>
                                <Text> Amount: {amount}</Text>
                                <Text> Deadline: {deadline}</Text>
                                <Text> Fee: {fee}</Text>
                                <Text> Recipient: {recipient}</Text>
                                <Text> Type: {type}</Text>                                
                                <Text> -----------------END----------------</Text>                                
                            </View>
                        )                        
                    }}
                />                
            </View>
        )
    }    
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#eeeeee',
        width: '100%',
        height: '100%'
    },
    flatList: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white'
    },
    flatListItem: {

    }
});

const mapStateToProps = (state) => {
    return {
        txList: state.tx.nemTxList,        
    }
}

const mapDispatchToProps = (dispatch) => {
    return({
        getNEMtxs: () => dispatch(getNEMtxs())
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(NEMTransaction);
