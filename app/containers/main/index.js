import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, Modal, Dimensions, TextInput, Picker} from 'react-native';
import TextArea from '../../components/TextArea/TextArea';
import Button from '../../components/Button/Button';
import {
    generateMnemonicsAction, 
    getBalanceAction, 
    validateMnemonicsAction, 
    sendTransactionAction,
    sendTransactionActionEthereum,
    sendTransactionActionNEM
} from '../../redux/main/actions';

import {connect} from "react-redux";

const {width} = Dimensions.get('window')

class Main extends Component {

    state = {
        sendModalVisible: false,
        selectedCurrency: 'bitcoin',
        mnemonics: 'project nasty dose grunt ritual price gap prison degree agent satisfy across',        
        bitcoinBalance: 0,        
        txAmount: 0.000028,
        txMode: 'btc',
        toAddress: '1744EAvG25ARg6BWX3tUDkX7UyzjBJ5mtN'
    }

    constructor(props) {
        super(props)
        this.handleSendModal = this.handleSendModal.bind(this);
        this.sendTransactionModal = this.sendTransactionModal.bind(this);
        this.handleSendTransaction = this.handleSendTransaction.bind(this);
    }

    componentDidMount() {
        this.props.validateMnemonics(this.state.mnemonics);
        // const mnemonics = 'project nasty dose grunt ritual price gap prison degree agent satisfy across';
        // const seed = bip39.mnemonicToSeed(mnemonics);                
        // const master = bitcoin.HDNode.fromSeedBuffer(seed, bnet.current);
        // console.log('begin');
        // console.log(master.keyPair.toWIF());
        // const derived = master.derivePath("m/0'");                            
        // const address = derived.getAddress();                
        // console.log(derived.keyPair.toWIF());
        // console.log(address);
        // console.log(derived.toBase58());
        

        // const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/'));        
        
        // const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8081'));        

        // web3.eth.getBlock(48, function(error, block) {
        //     console.log('block')
        //     console.log(error)
        //     console.log(block);
        // })
        
        // web3.eth.getBlock(48, function(error, result) {
        //     if (error) {
        //         console.log(error)
        //     } else {
        //         console.log('res')
            
        //     }
            
        // })
    }


    handleSendTransaction() {
        const {sendTxNEM, sendTransaction, sendTxEth} = this.props;
        this.setState({ sendModalVisible: !this.state.sendModalVisible });
        switch(this.state.selectedCurrency) {
            case 'bitcoin':
                sendTransaction(this.props.btc_xpub, this.state.toAddress, this.state.txAmount, this.state.mnemonics);
                break;
            case 'nem':
                console.log('nem')
                sendTxNEM(this.state.toAddress, this.state.txAmount, 'NEM Transaction!');
                break;
            case 'ether':       
                sendTxEth(this.state.mnemonics, this.state.toAddress, this.state.txAmount)
                break;
        }        
    }

    handleSendModal() {
        this.setState({ sendModalVisible: !this.state.sendModalVisible });
    }

    sendTransactionModal() {
        return(
            <Modal
                animationType="slide"
                transparent={true}                
                visible={this.state.sendModalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                }}>
                <View 
                    style={styles.modal}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Send Transaction</Text>
                        <View>
                            <Picker 
                                selectedValue={this.state.selectedCurrency} 
                                style={styles.modalPicker}
                                onValueChange={(loc) => this.setState({selectedCurrency: loc})}
                                itemStyle={styles.modelPickerItem}>
                                <Picker.Item label = "Bitcoin" value = "bitcoin" />
                                <Picker.Item label = "NEM" value = "nem" />
                                <Picker.Item label = "Ethereum" value = "ether" />
                            </Picker>
                        </View>
                        <View style={styles.modalToContainer}>
                            <TextInput 
                            multiline={false} 
                            style={styles.modalToInputStyle}
                            placeholder='To: '
                            value={this.state.toAddress}
                            onChangeText={(text) => {
                                this.setState({
                                    toAddress: text
                                })
                            }}
                            />
                        </View>
                        <View style={styles.modalToContainer}>
                            <TextInput 
                                multiline={false} 
                                style={styles.modalToInputStyle}
                                placeholder='Amount: '
                                value={this.state.txAmount.toString()}
                                onChangeText={(text) => {
                                    this.setState({
                                        txAmount: parseFloat(text)
                                    })
                                }}
                                />
                        </View>
                        <View style={styles.modalToContainer}>
                            <Button 
                                    style={styles.modalSendButton}
                                    onPress={() => {this.handleSendTransaction()}}
                                    title='send'
                                />
                        </View>
                    </View>
                </View>                        
          </Modal>
        )
    }

    render() {        
        const {
            isMnemonicsValid, 
            validateMnemonics, 
            generateMnemonics, 
            getBalance, 
            btcBalance, 
            ethBalance, 
            nemBalance, 
            btc_xpub, 
            eth_xpub,
            nem_address                        
            } = this.props;
        return (
            <ScrollView style={styles.container}>
                <View>
                    <Text style={styles.mnemmonicsCenterText}>Mnemonics</Text>
                    <TextArea 
                    editable={true}
                    error={ isMnemonicsValid ? '' : 'Mnemonics is not valid!'}
                    value={this.state.mnemonics}
                    onChangeText={(text) => {
                        validateMnemonics(text)
                        this.setState({mnemonics: text})                        
                    }}
                    style={styles.textArea}/> 
                    <Text style={styles.mnemonicsValidation}>{isMnemonicsValid ? 'Mnemonics is valid!': 'Mnemonics is not valid!'}</Text>                   
                    <View style={styles.mnemonicsButtonsContainer}>
                        <Button style={styles.mnemonicsButton} title='Generate' onPress={() => generateMnemonics()}/>
                        <Button style={styles.mnemonicsButton} title='Verify' onPress={() => getBalance(this.state.mnemonics, eth_xpub, nem_address)}/>
                    </View>

                    <View style = {styles.lineStyle} />

                    <View style={styles.balance}>
                        <Text style={styles.balanceTitle}> Addresses </Text>
                        <View style={styles.balanceRowContainer}>
                            <Text style={styles.balanceRow}>Bitcoin: {btc_xpub || ''} </Text>
                        </View>
                        <View style={styles.balanceRowContainer}>
                            <Text style={styles.balanceRow}>Ethereum: {eth_xpub || ''} </Text>
                        </View>                        
                        <View style={styles.balanceRowContainer}>
                            <Text style={styles.balanceRow}>NEM: {nem_address || ''} </Text>
                        </View>                        
                    </View>
                    <View style = {styles.lineStyle} />
                    <View style={styles.balance}>
                        <View style={styles.balanceTitleContainer}>
                            <Text style={styles.balanceTitle}> Balance </Text>
                            <Button 
                                title='Update'
                                onPress={() => getBalance(this.state.mnemonics, eth_xpub, nem_address)} />    
                        </View>
                        
                        <View style={styles.balanceRowContainer}>
                            <Text style={styles.balanceRow}>Bitcoin: {btcBalance || 0} BTC </Text>
                        </View>
                        <View style={styles.balanceRowContainer}>
                            <Text style={styles.balanceRow}>Ethereum: {ethBalance || 0} gas </Text>
                        </View>
                        <View style={styles.balanceRowContainer}>
                            <Text style={styles.balanceRow}>NEM: {nemBalance || 0} XEM </Text>
                        </View>                        
                    </View>
                    <View style = {styles.lineStyle} />
                    <View>
                        <Button 
                            onPress={() => {this.handleSendModal()}}
                            style={styles.sendButton}
                            title='Send'
                        />
                    </View>
                    {this.sendTransactionModal()}
                </View>
            </ScrollView>            
        )
    }    
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#eeeeee',
        flex: 1,
        width: '100%',
        height: 'auto'
    },
    mnemmonicsCenterText: {
        margin: 15,
        fontWeight: 'bold',
        fontSize: 20
    },
    textArea: {
        backgroundColor: 'white',
        minHeight: 200,
        margin: 10
    },
    mnemonicsValidation: {
        padding: 10,
        fontSize: 16,
        color: 'gray'
    },
    mnemonicsButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    mnemonicsButton: {
        flex: 1,
        margin: 10        
    },
    balanceTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    balance: {
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
        
    }, 
    balanceRowContainer: {
        width: '100%',        
        flex: 1,
        alignItems: 'flex-start',
        padding: 10
    },
    balanceTitle: {
        fontWeight: 'bold',
        fontSize: 20
    },
    balanceRow: {
        fontWeight: 'normal',
        fontStyle: 'italic',
        fontSize: 15,
        color: 'gray'
    },
    addressesContainer: {
        width: '100%',
        height: 250,
        padding: 10
    },
    createAddressButtonContainer: {
        height: 60,
        width: '100%'
    },
    addressesList: {        
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor:'black',
        margin:10,
    },
    lineStyle:{
        borderWidth: 0.5,
        borderColor:'black',
        margin:10,
    },
    sendButton: {
        margin: 10
    },
    modal: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        backgroundColor: 'white',        
        width: width*0.7,
        height: 300,
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowRadius: 10,
        shadowOffset: {width: 1, height: 1},
        alignItems: 'center',
        padding: 15, 
    },
    modalTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    modalPicker: {
        height: 50,
        marginTop: 20,
        width: 120,
        marginBottom: 20
    },
    modelPickerItem: {
        height: 50
    },
    modalToContainer: {
        marginTop: 10,
        flexDirection: 'row'
    },
    modalToInputStyle: {
        borderWidth: 0.5,
        borderColor: 'gray',
        flex: 1,
        padding: 10        
    },
    modalSendButton: {
        width: '100%',
        flex: 1
    }

});


const mapStateToProps = (state) => {
    return {
        mnemonics: state.main.mnemonics,
        isMnemonicsValid: state.main.isMnemonicsValid,
        btcBalance: state.bitcoin.btcBalance,
        ethBalance: state.ethereum.ethBalance,
        nemBalance: state.nem.nemBalance,
        btc_xpub: state.main.btc_xpub,
        eth_xpub: state.main.eth_xpub,
        nem_address: state.main.nem_address,
        isMnemonicsValid: state.main.isMnemonicsValid
    }
}

const mapDispatchToProps = (dispatch) => {
    return({
        generateMnemonics: () => dispatch(generateMnemonicsAction()),
        getBalance: (mnemonics, eth_xpub, nem_address) => dispatch(getBalanceAction(mnemonics, eth_xpub, nem_address)),
        validateMnemonics: (mnemonics) => dispatch(validateMnemonicsAction(mnemonics)),
        sendTransaction: (xpub, amount, to, mnemonics) => { dispatch(sendTransactionAction(xpub, amount, to, mnemonics)) },
        sendTxEth: (from, to, amount) => { dispatch(sendTransactionActionEthereum(from ,to, amount))},
        sendTxNEM: (privKey, to, amount, message) => { dispatch(sendTransactionActionNEM(privKey, to, amount, message))}
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);