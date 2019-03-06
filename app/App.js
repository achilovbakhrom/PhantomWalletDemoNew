import React, {Component} from 'react';
import {createStackNavigator, createMaterialTopTabNavigator, createAppContainer, createBottomTabNavigator} from 'react-navigation';
import Main from './containers/main';
import Transaction from './containers/transactions';
import BitcoinTransaction from './containers/transactions/bitcoin';
import NEMTransaction from './containers/transactions/nem';
import EthereumTransaction from './containers/transactions/ethereum';

const Transactions = createBottomTabNavigator({
    BITCOIN:{
        screen: BitcoinTransaction,
        navigationOptions:{
          tabBarIcon: ({ focused, tintcolor }) => {}
        }
      },
    ETHEREUM: {
        screen: EthereumTransaction,
        navigationOptions:{
          tabBarIcon: ({ focused, tintcolor }) => {}
        }
      },
    NEM: {        
        screen: NEMTransaction,
        navigationOptions:{
          tabBarIcon: ({ focused, tintcolor }) => {}
        }
      }
}, {
    
		tabBarPosition: "top",
		swipeEnabled: true,
		animationEnabled: true,
		lazy: true,
		tabBarOptions: {
			showLabel: true,
			showIcon: false,
			upperCaseLabel: false,
			scrollEnabled: false
			
		}
})

const TabNavigator = createMaterialTopTabNavigator({
    Main: Main, 
    Transaction: Transactions
}, {
    lazy: true,
    tabBarOptions: {
        labelStyle: {
          fontSize: 12,
          color: 'black'
        },        
        style: {
          backgroundColor: 'white',
        },
        indicatorStyle: {
            backgroundColor: 'gray'
        }
      }
});

TabNavigator.navigationOptions = {
    title: 'Phantom Wallet'
}
const App = createStackNavigator({
    MainApp: {
        screen: TabNavigator
    }
});

export default createAppContainer(App);