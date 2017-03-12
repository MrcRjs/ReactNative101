/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  NetInfo,
  StyleSheet,
  Text,
  TouchableHighlight,
  NativeAppEventEmitter,
  Platform,
  View
} from 'react-native';
import BleManager from 'react-native-ble-manager';

export default class ReactNative101 extends Component {
  render() {
    NetInfo.fetch().done((reach) => {
      console.log('Initial: ' + reach)
    });
    function handleFirstConnectivityChange(reach) {
      console.log('First change: ' + reach)
      NetInfo.removeEventListener(
        'change',
        handleFirstConnectivityChange
      );
    }
    NetInfo.addEventListener(
      'change',
      handleFirstConnectivityChange
    );
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.android.js
        </Text>
        <Text style={styles.instructions}>
          Double tap R on your keyboard to reload,{'\n'}
          Shake or press menu button for dev menu
        </Text>
        <BleExample/>
      </View>
    );
  }
}
class BleExample extends Component {

  constructor() {
    super()

    this.state = {
      ble: null,
      scanning: false,
    }
  }

  componentDidMount() {
    BleManager.start({ showAlert: false });
    this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);

    NativeAppEventEmitter
      .addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.checkPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
        if (result) {
          console.log("Permission is OK");
        } else {
          PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
            if (result) {
              console.log("User accept");
            } else {
              console.log("User refuse");
            }
          });
        }
      });
    }
  }

  handleScan() {
    BleManager.scan([], 30, true)
      .then((results) => { console.log('Scanning...'); });
  }

  toggleScanning(bool) {
    if (bool) {
      this.setState({ scanning: true })
      this.scanning = setInterval(() => this.handleScan(), 3000);
    } else {
      this.setState({ scanning: false, ble: null })
      clearInterval(this.scanning);
    }
  }

  handleDiscoverPeripheral(data) {
    console.log('Got ble data', data);
    this.setState({ ble: data })
  }

  render() {

    const bleList = this.state.ble
      ? <Text> Device found: {this.state.ble.name} </Text>
      : <Text>no devices nearby</Text>

    return (
      <View style={styles.container}>
        <TouchableHighlight style={{ padding: 20, backgroundColor: '#ccc' }} onPress={() => this.toggleScanning(!this.state.scanning)}>
          <Text>Scan Bluetooth ({this.state.scanning ? 'on' : 'off'})</Text>
        </TouchableHighlight>

        {bleList}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('ReactNative101', () => ReactNative101);
