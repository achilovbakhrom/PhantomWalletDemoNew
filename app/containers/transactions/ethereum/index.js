import React, {Component} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {connect} from "react-redux";
import { getEthTxs } from '../../../redux/transactions/actions';

class EthereumTransaction extends Component {

    componentDidMount() {
        this.props.getEthTxs()
    }

    render() {
        const {txList} = this.props;
        console.log('Component')
        console.log(txList)
        console.log('end')
        return (
            <View style={styles.container}>
                <FlatList 
                    style={styles.flatListItem}
                    data={txList}
                    renderItem={({item}) => {                        
                        const {blockHash, blockNumber, confirmations, cumulativeGasUsed, from, gas, gasPrice, gasUsed, hash, to, transactionIndex, value} = item;                        
                        return (
                            <View>
                                <Text> -----------------BEGIN----------------</Text>                                
                                <Text> BlockHash: {blockHash}</Text>
                                <Text> BlockNumber: {blockNumber}</Text>
                                <Text> Confirmations: {confirmations}</Text>
                                <Text> CumlativeGasUsed: {cumulativeGasUsed}</Text>
                                <Text> From: {from}</Text>
                                <Text> GasPrice: {gasPrice}</Text>
                                <Text> GasUsed: {gasUsed}</Text>
                                <Text> Hash: {hash}</Text>
                                <Text> To: {to}</Text>
                                <Text> TransactionIndex: {transactionIndex}</Text>
                                <Text> Value: {value}</Text>                                
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
        txList: state.tx.ethTxList,        
    }
}

const mapDispatchToProps = (dispatch) => {
    return({
        getEthTxs: () => dispatch(getEthTxs())
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(EthereumTransaction);
