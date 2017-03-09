import React, { Component } from 'react';
import {AsyncStorage, StyleSheet, View, Text, ListView, TouchableHighlight, Image, Dimensions, WebView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import ActivityIndicator from '../../common/components/ActivityIndicator';
import { SideMenu, List, ListItem } from 'react-native-elements';

import Header from '../../common/components/Header';

var widthScreen = Dimensions.get('window').width;
var heightScreen = Dimensions.get('window').height;

export default class PostView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      overlayState: "",
      animating: false,
      isOpen: false
      /* SideMenu */
    }
    this.toggleSideMenu = this.toggleSideMenu.bind(this);
  }

  componentWillMount(){

   }

  componentDidMount() {

  }

  toggleSideMenu () {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  overlay(){
    if (this.state.overlayState == "true") {
      return (<View style={styles.overlay}>
      </View>);
    }
    return (<View/>);
  }

  /* WebView on Start */
  onLoadStart(){
    this.setState({animating: true, overlayState: "true"});
  }

  onLoadEnd(){
    this.setState({animating: false, overlayState: ""});
  }

  getNotifications(){
    this.props.navigator.push({route: 'notifications'});
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
     this.props.navigator.push({
       route: 'inbox',
       title: 'Inbox',
       passProps: {auth: this.props.auth}
     });
   }

   marketing(){
     this.props.navigator.push({
       route: 'marketing/recent-posts',
       title: 'Marketing',
       passProps: {auth: this.props.auth}
     });
   }

   it(){
     this.props.navigator.push({
       route: 'it/recent-posts',
       title: 'IT',
       passProps: {auth: this.props.auth}
     });
   }

   hr(){
     this.props.navigator.push({
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
           this.props.navigator.push({route: 'weekday-log', passProps: {auth: this.props.auth}});
           break;
         case 'W' :
           this.props.navigator.push({route: 'week-log', passProps: {auth: this.props.auth}});
           break;
         case 'D' :
           this.props.navigator.push({route: 'day-view', passProps: {auth: this.props.auth}});
           break;
       }
     })
     .catch((error) => {
       console.warn(error.message);
     });
   }

  render(){
    var MenuComponent = (
        <View style={styles.menuComponent}>
          <View>
            <Image style={styles.photo}
              defaultSource={require('../../assets/images/male-silhouette3.png')}
              source={{uri: this.props.usrAvatar}}>
            </Image>
            <Text style={{fontSize:(widthScreen <= 320 ? 18 : (widthScreen >= 768 ? 28 : 22)), padding: (widthScreen >= 768 ? 15 : 8), color: '#0077D0'}}> {this.props.usrName} </Text>
            <Text style={{fontSize:(widthScreen <= 320 ? 14 : (widthScreen >= 768 ? 22 : 18)), padding: (widthScreen >= 768 ? 15 : 8)}}> {this.props.designation} </Text>
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

    var source = this.props.uri;
    console.log("props ="+ this.state.isOpen);
    return (
      <SideMenu
      isOpen={this.state.isOpen}
      menu={MenuComponent}>

      <View style={styles.container}>
        <Header
          navigator={this.props.navigator}
          notification={{callback: this.getNotifications.bind(this)}}
          title={this.props.title}
        />
        <View style={styles.separator}/>
        <WebView
          source={{uri: source.toString()}}
        />
      </View>
      </SideMenu>
    );
  }
}

const styles=EStyleSheet.create({
  container: {
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
  overlay:{
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  separator: {
    height: 1,
    backgroundColor: '#E8E8E8'
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
  },
  smallContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  /* SideMenu */
});
