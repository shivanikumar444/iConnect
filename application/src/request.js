'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Platform
} from 'react-native';
import base64 from 'base-64';

import ActivityIndicator from './common/components/ActivityIndicator';
import EStyleSheet from 'react-native-extended-stylesheet';
import Header from './common/components/Header';

var widthScreen = Dimensions.get('window').width;
var heightScreen = Dimensions.get('window').height;

export default class RequestAccess extends Component{
  TIME_TRACK_BASE_URI = '';
  constructor(props){
    super(props);
    this.TIME_TRACK_BASE_URI = this.props.config.TIME_TRACK_BASE_URI;
    this.state = {
      email: '',
      name: '',
      animating: false,
      overlayState: "",

    }
  }

  componentWillMount(){

  }

  componentDidMount() {

  }

   overlay(){
     if (this.state.overlayState == "true") {
       return (<View style={styles.overlay}>
       </View>);
     }
     return (<View/>);
   }

  onSubmitPressed(){
    let data = {
      'email':this.state.email,
      'name':this.state.name
    };
    if (this.state.email == '' || this.state.name == '') {
      this.setState({animating: false, overlayState: ""});
      return alert("Please enter Valid email.");
    }
    this.setState({animating: true, overlayState: "true"});
    fetch(this.TIME_TRACK_BASE_URI+"sendEmail.php" , {
         method: 'POST',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json'
         },
         body: JSON.stringify(data),
     })
    .then((response) => response.json())
    .then((responseJson) => {
       if (responseJson == null || responseJson.success == 0) {
         alert("Request Failed");
         this.setState({animating: false, overlayState: ""});
       }else {
         alert(responseJson.message);
         this.setState({animating: false, overlayState: "", email: "", name: ""});
       }
    })
    .catch((error) => {
       console.error(error);
       this.setState({animating: false, overlayState: ""});
    })
    .done();

  }

  render(){
    return(
      <ScrollView keyboardShouldPersistTaps={false}>
      <View style={styles.header}>
      <Header
        navigator={this.props.navigator}
      />
        <View style={{ padding: 10, marginTop: 30, alignItems: 'center' }}>
          <Image source={require('./assets/images/logo_big.png')} style={styles.icon}/>
        </View>
        <View style={{ height: 35, backgroundColor: '#48BBEC', alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 20, fontWeight:'bold', color: 'white'}}>Request Access</Text>
        </View>
        <View style={styles.mainView}>
          <View style={styles.container}>
            <View style={styles.flowRight}>
              <Text style={{fontSize:16, fontWeight: 'bold'}}>Name  : </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.searchInput}
                  value={this.state.name}
                  autoCapitalize = 'none'
                  onChangeText={ (text) => this.setState({ name: text }) }
                  autoCorrect={false}
                  underlineColorAndroid='transparent'
                  placeholder='Enter Full Name'/>
              </View>
            </View>

            <View style={styles.flowRight}>
              <Text style={{fontSize:16, fontWeight: 'bold'}}>Email   : </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.searchInput}
                  value={this.state.email}
                  autoCapitalize = 'none'
                  onChangeText={ (text) => this.setState({ email: text }) }
                  autoCorrect={false}
                  underlineColorAndroid='transparent'
                  placeholder='Enter Valid Email Id'/>
              </View>
            </View>



            <View style={styles.loadingView}>
              <ActivityIndicator
                animating = {this.state.animating}/>
            </View>
            <View >
              <TouchableHighlight style={styles.button} onPress={this.onSubmitPressed.bind(this)}
                  underlayColor='#99d9f4'>
                <Text style={styles.requestText}> Submit </Text>
              </TouchableHighlight>
            </View>
          </View>
          <View style={styles.copyright}>
            <Text style={{alignSelf: 'center', fontSize: (widthScreen <= 320 ? 10 : (widthScreen >= 768 ? 16 : 12))}}>Copyright © 2017, iTalent Corporation. All Rights Reserved.</Text>
          </View>
        </View>
      {this.overlay()}
      </View>
      </ScrollView>
  );
}
}

const styles = EStyleSheet.create({
  header: {
    flex: 1,
    top: '3%'
  },
  container:{
    padding: 10,
    alignItems: 'center'
  },
  loadingView:{
    height: '0%',
    position: 'absolute',
    alignItems: 'center',
    alignSelf: 'stretch',
    left: '45%'
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%'
  },
  text: {
    fontSize: 18
  },
  searchInput: {
    flex: 1,
    fontSize: 20,
    '@media android': {
      height: '7%'
    },
    paddingHorizontal: 10,
  },
  requestText: {
    fontSize: (widthScreen >= 768 ? 22 : 18),
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    margin: (widthScreen >= 768 ? 30 : 10),
    width: (widthScreen >= 768 ? 200 : 100),
    height: (widthScreen >= 768 ? 40 : 36),
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center'
  },
  inputContainer: {
    flexDirection: 'row',
    height: 40,
    margin: 5,
    marginRight: 5,
    flex: 4,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  overlay:{
    height:'$height',
    width: '$width',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  iconContainer: {
   justifyContent: 'center',
   alignItems: 'center',
 },
 input: {
   flex: 1,
   fontSize: 20,
 },
 mainView: {
   flex: 2,
   marginTop: '4%'
 },
 logo: {
   marginTop: heightScreen/20,
   height: (heightScreen >= 1024 ? "12%" : "8%"),
   width: "70%"
 },
 icon: {
   height: (heightScreen >= 1024 ? "10%" : "11%"),
   width: (heightScreen >= 1024 ? "18%" : "20%")
 },
 copyright: {
   paddingTop: (heightScreen <= 568 ? '20%' : '30%'),
   '@media android':{
     paddingTop: (heightScreen <= 568 ? '15%' : '20%'),
   }
 },
});
