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
  AsyncStorage,
  Dimensions,
  ScrollView,
  Platform
} from 'react-native';
import base64 from 'base-64';

import ActivityIndicator from './common/components/ActivityIndicator';
import EStyleSheet from 'react-native-extended-stylesheet';

var widthScreen = Dimensions.get('window').width;
var heightScreen = Dimensions.get('window').height;

export default class Signin extends Component{
  storageKeys = ['UserLoginData', 'taskDetails', 'JiveUserDetails', 'userdetails', 'projectdetails', 'entryDetails'];
  TIME_TRACK_BASE_URI = '';
  JIVE_API_URI = '';
  constructor(props){
    super(props);
    this.TIME_TRACK_BASE_URI = this.props.config.TIME_TRACK_BASE_URI;
    this.JIVE_API_URI = this.props.config.JIVE_API_URI;
    this.state = {
      userName: '',
      pws:'',
      animating: false,

      /* Signin Details */
      user_id: "",
      uname: "",
      UserName: "",
      givenName: "",
      familyName: "",
      EmpNumber: "",
      Country: "",
      UserLoginData: [],

      /*  ActivityIndicator  */
      overlayState: "",
      checkboxSelected: false
    };
  }

  componentWillMount(){
    /*  Remember me */
console.log(widthScreen + " " + heightScreen);
    AsyncStorage.getItem('userData')
    .then((data) => {
      if (data != null) {
        var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

        let userInfo = JSON.parse(data);
        let email= (userInfo.email != '') ? base64.decode(userInfo.email) : '';
        let password= (userInfo.password != '') ? base64.decode(userInfo.password) : '';

        if(email != '' && password != ''){
          this.setState({
            checkboxSelected: true,
            userName: email,
            pws: password
          });
        }else {
          this.setState({
            userName: '',
            pws:'',
          })
        }
      }
    })
    .catch((error) => {
      throw new Error(error);
    })
    /*  Clear All AsyncStorage  */
    AsyncStorage.getAllKeys()
    .then((keys) =>{
      keys.forEach((key) => {
        if(this.storageKeys.indexOf(key) > -1){
          if (key == 'userData') {

          }else {
            AsyncStorage.removeItem(key);
          }
        }
      })
    })
    .catch((error) => {console.log('No Async Keys were avaiable to Remove:'+error)});
  }

  componentDidMount() {
    //  console.log("Dimentions : Height - " + heightScreen + " Width - " + widthScreen);
    //  this.setState({
    //    userName: '',
    //    pws:'',
    //  })
  }

   overlay(){
     if (this.state.overlayState == "true") {
       return (<View style={styles.overlay}>
       </View>);
     }
     return (<View/>);
   }

  onLoginPressed(){
    if (this.state.userName == "" && this.state.pws == "") {
      alert("Please enter valid username and password.");
    }else if (this.state.pws == "") {
      alert("Please enter correct password.");
    }else {

    this.setState({animating: true, overlayState: "true"});
    console.log("User name ="+this.state.userName);
    console.log("User name ="+this.state.pws);

    var headerData = this.state.userName.toString() + ":" + this.state.pws.toString();
    //  var headerData = "shivani@italentcorp.com" + ":" + "@Jive0444";

    console.log("HeaderData = "+headerData );

    var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

    var encodedUserId = Base64.encode(headerData);
    console.log("Encode ="+encodedUserId);
    console.log("Encode total =   "+ 'Basic '+encodedUserId);
    var basicAuth = 'Basic '+encodedUserId.toString();

    fetch(this.JIVE_API_URI+'/people/@me', {
         method: 'GET',
         headers: {
           'Authorization': 'Basic '+encodedUserId.toString()
         },
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("Res ="+JSON.stringify(responseJson));
          if (responseJson.code == "401") {
            setTimeout(() => {
              alert("Not a Valid user.");
              this.setState({animating: false, overlayState: ""});
            }, 1500);
          }else {


            /* TODO a hack made for unavaible user data
              need to remove it with proper error handling */

            if(!responseJson.addresses){
              responseJson.addresses= [];
              responseJson.addresses.push({
                value:{
                  country: 'USA'
                }
              });
            }
            if(!responseJson.jive.profile){
              responseJson.jive.profile = [];
              responseJson.jive.profile.push({
                value: ''
              });
            }

            if(this.state.checkboxSelected){
              let userInfo = JSON.stringify({
                email: Base64.encode(this.state.userName),
                password:Base64.encode(this.state.pws)
              });
              AsyncStorage.setItem('userData', userInfo);
            }else {
              let userInfo = JSON.stringify({
                email: base64.encode(''),
                password: base64.encode('')
              })
              AsyncStorage.setItem('userData', userInfo)
              // AsyncStorage.removeItem('userData');
            }

            AsyncStorage.setItem('JiveUserDetails', JSON.stringify(responseJson));

            console.log("Response 1 ="+responseJson);
            console.log("Response 2 ="+responseJson.id);

            console.log("user_id = "+ responseJson.id + ", uname = " + responseJson.emails[0].value + ", UserName = " + responseJson.displayName + ", givenName = " + responseJson.name.givenName + ", familyName = " + responseJson.name.familyName + ", EmpNumber = " + responseJson.id + ", Country = " + responseJson.addresses[0].value.country);

            this.setState({
              user_id: (Base64.encode(responseJson.id)).toString(),
              uname: (Base64.encode(responseJson.emails[0].value)).toString(),
              UserName:  (Base64.encode(responseJson.displayName)).toString(),
              givenName: (Base64.encode(responseJson.name.givenName)).toString(),
              familyName:  (Base64.encode(responseJson.name.familyName)).toString(),
              EmpNumber: (Base64.encode(responseJson.id)).toString()
             });

             /*  Setting The User login details Locally */
             var UserLoginData = [{login_user_id: responseJson.id.toString()},
               {uname: responseJson.emails[0].value.toString()},
               {UserName: responseJson.displayName.toString()},
               {givenName: responseJson.name.givenName.toString()},
               {familyName: responseJson.name.familyName.toString()},
               {EmpNumber: responseJson.id.toString()}
             ];
             AsyncStorage.setItem('UserLoginData', JSON.stringify(UserLoginData));
              var data_Block = {
                  mode: "all",
                  userObj: {
                    user_id: this.state.user_id.toString(),
                    uname: this.state.uname.toString(),
                    UserName: this.state.UserName.toString(),
                    givenName: this.state.givenName,
                    familyName: this.state.familyName,
                    deviceToken:(Base64.encode(this.props.deviceToken)).toString(),
                    platform:(Base64.encode(Platform.OS)).toString()
                  }
              };
              console.log("Datablock = "+JSON.stringify(data_Block));
               fetch(this.TIME_TRACK_BASE_URI+"timetrack.php" , {
                    method: 'POST',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data_Block),
                })
               .then((response) => response.json())
               .then((responseJson) => {
                  console.log("Time Track Response 1 ="+responseJson);
                  // console.log("Time Track Response 2 ="+responseJson.id);
                  //
                  // console.log("user_id = "+ responseJson.id + ", uname = " + responseJson.emails[0].value + ", UserName = " + responseJson.displayName + ", givenName = " + responseJson.name.givenName + ", familyName = " + responseJson.name.familyName + ", EmpNumber = " + responseJson.id + ", Country = " + responseJson.addresses[0].value.country + ", cntrl = italent is the best");
                  // Storing response data at application level

                  if (responseJson == null || responseJson.length == 0) {
                    alert("Not a valid user. Please contact admin.");
                    this.setState({animating: false, overlayState: ""});
                  }else {

                      try {
                        AsyncStorage.setItem('projectdetails', JSON.stringify(responseJson.projectdetails));
                        AsyncStorage.setItem('entryDetails', JSON.stringify(responseJson.entryDetails));
                        AsyncStorage.setItem('userdetails', JSON.stringify(responseJson.userDetails[0]));
                        //AsyncStorage.setItem('sessionid', responseJson.sessionid);
                        AsyncStorage.setItem('taskDetails', JSON.stringify(responseJson.taskdetails));
                        AsyncStorage.setItem('auth', basicAuth);
                       } catch (error) {
                         // Error saving data
                         console.error(error);
                         this.setState({animating: false, overlayState: ""});
                       }

                       this.setState({animating: false, overlayState: ""});

                         this.props.navigator.immediatelyResetRouteStack([
                           {
                             route: 'home',
                             title: 'Home',
                             passProps: {email: "test",auth: basicAuth}
                           },
                          ]);
                    }

                      // this.props.navigator.replace(
                      //   {
                      //     route: 'home',
                      //     title: 'Home',
                      //     passProps: {email: "test",auth: basicAuth}
                      //   },
                      //  );

               })
               .catch((error) => {
                  console.error(error);
                  this.setState({animating: false, overlayState: ""});
               })
               .done();

             /* End: Getting user details from database */
            }
      })
      .catch((error) => {
         this.setState({animating: false, overlayState: ""});
         if (error.message == "Network request failed") {
           return alert(error.message);

         }else {
           return alert("Something went wrong, Please try again after sometime");
         }
      })
      .done();
    }
  }

  onReqAccPressed(){
    this.props.navigator.push(
      {
        route: 'request',
        title: 'Request Access',
      },
     );
     this.setState({animating: false, overlayState: ""});
  }

  onCheckbox(){
      // this.checkboxSelected = !this.checkboxSelected;
      this.setState({
        checkboxSelected: !this.state.checkboxSelected
      });
      this.getCheckboxStatus();
  }
  getCheckboxStatus(){
    return(
      this.checkboxSelected ?
         <Image style={styles.checkboxImage} source={require('./assets/images/checkbox.png')} /> :  <View />
    )
  }
  render(){
    return(
      <ScrollView keyboardShouldPersistTaps={false}>
        <View style={{ padding: 10, marginTop: 30, alignItems: 'center' }}>
            <Image source={require('./assets/images/logo_big.png')} style={styles.icon}/>
          <View style={styles.request}>
            <TouchableHighlight style={styles.button2} onPress={this.onReqAccPressed.bind(this)}
                underlayColor='#99d9f4'>
              <Text style={styles.loginText}>
                Request
                Access
              </Text>
            </TouchableHighlight>
          </View>
          <Image source={require('./assets/images/iconnect-logo.png')} style={styles.logo}/>
        </View>
        <View style={styles.mainView}>
          <View style={styles.container}>
            <View style={styles.flowRight}>
              <View style={{width: widthScreen/8}}></View>
              <View style={styles.inputContainer}>
              <View style={styles.iconContainer}>
              <Image source={require('./assets/images/main_user.png')} style={{height: 38, width: 45, borderRadius: 6 }}/>
              </View>
              <TextInput
                style={styles.searchInput}
                value={this.state.userName}
                autoCapitalize = 'none'
                onChangeText={ (text) => this.setState({ userName: text }) }
                autoCorrect={false}
                underlineColorAndroid='transparent'
                placeholder='Enter User Name'/>
              </View>
                <View style={{width: widthScreen/7}}></View>
            </View>

            <View style={styles.flowRight}>
              <View style={{width: widthScreen/8}}></View>
              <View style={styles.inputContainer}>
              <View style={styles.iconContainer}>
              <Image source={require('./assets/images/new_password.png')} style={{height: 38, width: 45, borderRadius: 8 }}/>
              </View>
              <TextInput
                style={styles.searchInput}
                value={this.state.pws}
                autoCapitalize = 'none'
                secureTextEntry={true}
                placeholder='Enter Password'
                onChangeText={ (text) => this.setState({ pws: text }) }
                autoCorrect={false}
                underlineColorAndroid='transparent'
                password={true} />
                </View>
              <View style={{width: widthScreen/7}}></View>
            </View>
            <View style={styles.loadingView}>
              <ActivityIndicator
                animating = {this.state.animating}/>
            </View>
            <View style={styles.rememberMe}>
                <TouchableOpacity onPress={this.onCheckbox.bind(this)}>
                  <View style={styles.checkbox}>
                    {this.state.checkboxSelected ? <Image style={styles.checkboxImage} source={require('./assets/images/checkbox.png')} /> :  <View />}
                  </View>
                </TouchableOpacity>
                <View style={styles.rememberMeTextWrapper}>
                  <Text>Remember User ID</Text>
                </View>
            </View>
            <View >
              <TouchableHighlight style={styles.button} onPress={this.onLoginPressed.bind(this)}
                  underlayColor='#99d9f4'>
                <Text style={styles.loginText}>Login</Text>
              </TouchableHighlight>

            </View>
          </View>
          <View style={styles.copyright}>
            <Text style={{alignSelf: 'center', fontSize: (widthScreen <= 320 ? 10 : (widthScreen >= 768 ? 16 : 12))}}>Copyright © 2017, iTalent Corporation. All Rights Reserved.</Text>
          </View>
        </View>
      {this.overlay()}
      </ScrollView>
  );
}
}

const styles = EStyleSheet.create({
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
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
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
    paddingHorizontal: 10
  },
  label: {
    fontSize: 16
  },
  loginText: {
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
  button2: {
    margin: (widthScreen >= 768 ? 30 : 10),
    width: (widthScreen >= 768 ? '15%' : ((widthScreen <= 320) ? '23%' :'25%')),
    height: (widthScreen >= 768 ? '10%' : '12%'),
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 50,
    marginBottom: 10,
    justifyContent: 'center'
  },
  request: {
    position: 'absolute',
    left: "72%",
    width: (widthScreen >= 768 ? "15%" : "14%"),
    height: (widthScreen >= 768 ? 120 : 60),
    '@media android':{
      width: (widthScreen >= 768 ? "17%" : "23%"),
      height: (widthScreen >= 768 ? 145 : 85),
    },
    borderRadius: (widthScreen >= 768 ? 45 : 50),
  },
  inputContainer: {
    flexDirection: 'row',
    height: 40,
    // padding: 5,
    margin: 5,
    marginRight: 5,
    flex: 4,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    // color: '#48BBEC',
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
   marginTop: heightScreen/15,
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
 rememberMe:{
    flexDirection: 'row',
    alignSelf: 'center'
  },
  checkbox:{
    height: 15,
    width: 15,
    borderWidth: 1,
    borderColor: '#000'
  },
  rememberMeTextWrapper:{
    marginLeft: '4%'
  },
  checkboxImage:{
    width: 15
  }
});
