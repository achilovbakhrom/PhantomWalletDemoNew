import React, {Component} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {connect} from "react-redux";
import { getBTCtxs } from '../../../redux/transactions/actions';

class BitcoinTransaction extends Component {

    componentDidMount() {
        this.props.getBTCtxs()
    }

    render() {
        const {txList} = this.props;
        
        return (
            <View style={styles.container}>
                <FlatList 
                    style={styles.flatListItem}
                    data={txList}
                    renderItem={({item}) => {                        
                        const {hash, fee, balance, result, inputs, outputs} = item;                        
                        return (
                            <View>
                                <Text> -----------------BEGIN----------------</Text>
                                <Text> {result > 0 ? 'IN' : 'OUT'}</Text>
                                <Text> Hash: {hash}</Text>
                                <Text>Fee: {fee}</Text>
                                <Text>Balance: {balance}</Text>
                                <Text>Result: {result}</Text>
                                <Text> -----------------END--------------------</Text>
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
        txList: state.tx.btcTxList,        
    }
}

const mapDispatchToProps = (dispatch) => {
    return({
        getBTCtxs: () => dispatch(getBTCtxs())
    })
}



export default connect(mapStateToProps, mapDispatchToProps)(BitcoinTransaction);