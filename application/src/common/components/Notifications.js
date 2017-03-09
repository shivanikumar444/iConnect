import React, {Component} from 'react';
import {
  Text,
  View,ListView,AsyncStorage,TouchableOpacity, Dimensions, Image, TouchableHighlight, Alert
} from 'react-native';
import { SideMenu, List, ListItem } from 'react-native-elements';

import EStyleSheet from 'react-native-extended-stylesheet';
import Header from './Header';

var widthScreen = Dimensions.get('window').width;
var heightScreen = Dimensions.get('window').height;

export default class  Notifications extends Component{
  TIME_TRACK_BASE_URI = '';
  constructor(props) {
    super(props);
    this.TIME_TRACK_BASE_URI = this.props.config.TIME_TRACK_BASE_URI;

    var ds = new ListView.DataSource(
      {rowHasChanged: (r1, r2) => r1 != r2});

    this.state = {
      dataSource: ds.cloneWithRows(['r1', 'r2']),
      /* SideMenu */
      isOpen: false
    };
    this.toggleSideMenu = this.toggleSideMenu.bind(this);
  }
  componentDidMount() {
    var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

  AsyncStorage.getItem('JiveUserDetails')
  .then((JiveUserDetails) => {
    jiveUserDetails = JSON.parse(JiveUserDetails);
    console.log(JSON.stringify(JiveUserDetails));

    console.log("stae",this.state.user_id);
      var data = {
           mode: "all",
            userObj: {
              user_id:(Base64.encode(jiveUserDetails.id)).toString()
          }
      };
      fetch(this.TIME_TRACK_BASE_URI+'messages.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then((response) => response.json())
      .then((responseData) => {
        let data = [];
        if (responseData.messages.length < 15) {
          data = responseData.messages;
          for (var i = responseData.messages.length; i < 17; i++) {
            data.push({
              message: 'low length'
            });
          }
        }else {
          data = responseData.messages;
        }
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(data)
        });
      })
      .catch((error) => {
        console.warn(error);
      })
  })
  .catch((error) => {
    console.warn(error.message);
  });


  }

  toggleSideMenu () {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }
     logOut(){
       Alert.alert(
         'Warning',
         'Are you sure you want to Logout ?',
         [
           {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
           {text: 'OK', onPress: () => this.props.navigator.immediatelyResetRouteStack([
             {
               route: 'signin',
               title: 'Login',
             },
            ])
          },
         ]
       );
     }

      home(){
        this.props.navigator.immediatelyResetRouteStack([
          {
            route: 'home',
            title: 'Home',
            passProps: {auth: this.props.auth}
          },
         ]);
      }

      inbox(){
        this.props.navigator.replace({
          route: 'inbox',
          title: 'Inbox',
          passProps: {auth: this.props.auth}
        });
      }

      marketing(){
        this.props.navigator.replace({
          route: 'marketing/recent-posts',
          title: 'Marketing',
          passProps: {auth: this.props.auth}
        });
      }

      it(){
        this.props.navigator.replace({
          route: 'it/recent-posts',
          title: 'IT',
          passProps: {auth: this.props.auth}
        });
      }

      hr(){
        this.props.navigator.replace({
          route: 'hr/recent-posts',
          title: 'HR',
          passProps: {auth: this.props.auth}
        });
      }

      onKnowledgeSelect(){
        this.props.navigator.push({
          route: 'kn/recent-posts',
          title: 'Knowledge Network',
          passProps: {auth: this.props.auth}
        });
      }

      onTimetrackSelect(){
        AsyncStorage.getItem('userdetails')
        .then((userDetails) => {
          if(userDetails == null){
            return console.warn('Item was not present on storage');
          }
          userDetails = JSON.parse(userDetails);
          switch(userDetails.tab) {
            case 'B' :
              this.props.navigator.replace({route: 'weekday-log', passProps: {auth: this.props.auth}});
              break;
            case 'W' :
              this.props.navigator.replace({route: 'week-log', passProps: {auth: this.props.auth}});
              break;
            case 'D' :
              this.props.navigator.replace({route: 'day-view', passProps: {auth: this.props.auth}});
              break;
          }
        })
        .catch((error) => {
          console.warn(error.message);
        });
      }

  rowPressed() {
    AsyncStorage.getItem('userdetails')
    .then((userDetails) => {
      if(userDetails == null){
        return console.warn('Item was not present on storage');
      }
      userDetails = JSON.parse(userDetails);
      switch(userDetails.tab) {
        case 'B' :
          this.props.navigator.push({route: 'weekday-log'});
          break;
        case 'W' :
          this.props.navigator.push({route: 'week-log'});
          break;
        case 'D' :
          this.props.navigator.push({route: 'day-view'});
          break;
      }
    })
    .catch((error) => {
      console.warn(error.message);
    });
  }

  renderRow(Message, id){
    if(!Message.message){
      return (
        <View/>
      );
    }else if (Message.message == 'low length') {
      return (
        <View style={{backgroundColor: '#f7f7f7', height: 60}}>
          <TouchableOpacity style={styles.cellContainer} >
          </TouchableOpacity>
          <View style={styles.separator}/>
        </View>
      );
    }else{
      return(
        <View style={{backgroundColor: '#f7f7f7', height: 60}}>
          <TouchableOpacity style={styles.cellContainer} onPress={this.rowPressed.bind(this)}>
            <Text style={{fontSize:18}}>{Message.message}</Text>
          </TouchableOpacity>
          <View style={styles.separator}/>
        </View>
      );
    }
  }

  render(){
    var MenuComponent = (
        <View style={styles.menuComponent}>
          <View>
            <Image style={styles.photo}
              defaultSource={require('../../assets/images/male-silhouette3.png')}
              source={{uri: this.state.usrAvatar}}>
            </Image>
            <Text style={{fontSize: (widthScreen <= 320 ? 18 : (widthScreen >= 768 ? 28 : 22)), padding: (widthScreen >= 768 ? 15 : 8), color: '#0077D0'}}> {this.state.usrName} </Text>
            <Text style={{fontSize: (widthScreen <= 320 ? 14 : (widthScreen >= 768 ? 22 : 18)), padding: (widthScreen >= 768 ? 15 : 8)}}> {this.state.designation} </Text>
          </View>
          <View style={styles.separator}/>
          <View>
            <TouchableHighlight style={{height: (heightScreen <= 568 ? 36 : (widthScreen >= 768 ? 60 : 40))}} onPress={this.home.bind(this)} underlayColor='transparent'>
              <Text style={styles.menuContent}> Home </Text>
            </TouchableHighlight>
            <View style={styles.separator}/>

            <TouchableHighlight style={{height: (heightScreen <= 568 ? 36 : (widthScreen >= 768 ? 60 : 40))}} onPress={this.hr.bind(this)} underlayColor='transparent'>
              <Text style={styles.menuContent}> HR </Text>
            </TouchableHighlight>
            <View style={styles.separator}/>

            <TouchableHighlight style={{height: (heightScreen <= 568 ? 36 : (widthScreen >= 768 ? 60 : 40))}} onPress={this.onTimetrackSelect.bind(this)} underlayColor='transparent'>
              <Text style={styles.menuContent}> Time Track </Text>
            </TouchableHighlight>
            <View style={styles.separator}/>

            <TouchableHighlight style={{height: (heightScreen <= 568 ? 36 : (widthScreen >= 768 ? 60 : 40))}} onPress={this.inbox.bind(this)} underlayColor='transparent'>
              <Text style={styles.menuContent}> Inbox </Text>
            </TouchableHighlight>
            <View style={styles.separator}/>

            <TouchableHighlight style={{height: (heightScreen <= 568 ? 36 : (widthScreen >= 768 ? 60 : 40))}} onPress={this.marketing.bind(this)} underlayColor='transparent'>
              <Text style={styles.menuContent}> Marketing </Text>
            </TouchableHighlight>
            <View style={styles.separator}/>

            <TouchableHighlight style={{height: (heightScreen <= 568 ? 36 : (widthScreen >= 768 ? 60 : 40))}} onPress={this.onKnowledgeSelect.bind(this)} underlayColor='transparent'>
              <Text style={styles.menuContent}> Knowledge Network </Text>
            </TouchableHighlight>
            <View style={styles.separator}/>

            <TouchableHighlight style={{height: (heightScreen <= 568 ? 36 : (widthScreen >= 768 ? 60 : 40))}} onPress={this.it.bind(this)} underlayColor='transparent'>
              <Text style={styles.menuContent}> IT </Text>
            </TouchableHighlight>

          </View>
          <View style={styles.separator}/>
          <TouchableHighlight style={{height: (heightScreen <= 568 ? 36 : (widthScreen >= 768 ? 60 : 40))}} onPress={this.logOut.bind(this)} underlayColor='transparent'>
            <Text style={styles.menuContent}> Logout </Text>
          </TouchableHighlight>
        </View>
      );

    return(
      <SideMenu
      isOpen={this.state.isOpen}
      menu={MenuComponent}>
      <View style={styles.container}>
        <Header
          navigator = {this.props.navigator}
        />
        <View style={{height:40,backgroundColor:'#dddddd',justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontSize:18, fontWeight:'bold'}}>Pending Activity Log</Text>
        </View>
          <ListView
            dataSource={this.state.dataSource}
            renderRow = {this.renderRow.bind(this)}
            enableEmptySections={true}
            bounces={false}
          />

      </View>
      </SideMenu>
    );
  }
}

const styles = EStyleSheet.create({
  container:{
    flex: 1,
    top: '3%'
  },
  menuComponent: {
    top: '6%'
  },
  menuContent: {
    fontSize: (widthScreen <= 320 ? 16 : (widthScreen >= 768 ? 26 : 20)),
    padding: (widthScreen >= 768 ? 15 : 8),
    color: '#0099cc',
  },
  label:{
    fontSize: 16
  },
  separator: {
    height: 1,
    backgroundColor: '#E8E8E8'
  },
  cellContainer:{
      flexDirection: 'row',
      padding: 10
  },
  /* SideMenu */
  mainView: {
    backgroundColor: '#ededed',
    paddingTop: 50
  },
  photo: {
    marginTop: "8%",
    marginLeft: "4%",
    height: "10%",
    width: "18%",
  }
  /* SideMenu */

});
