'use strict';

import React, { Component } from 'react';
import {Alert, Platform, StyleSheet, Image, View, TouchableHighlight, ListView, Text, TouchableOpacity, Dimensions, ScrollView, Picker, PickerItem, DatePickerIOS, TextInput, Animated, AsyncStorage } from 'react-native';
import DatePicker from 'react-native-datepicker';
import ModalDropdown from 'react-native-modal-dropdown';
import ActivityIndicator from '../../../common/components/ActivityIndicator';
import EStyleSheet from 'react-native-extended-stylesheet';
import Header from '../../../common/components/Header';
import { SideMenu, List, ListItem } from 'react-native-elements';

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    top: '3%',
    backgroundColor: '#f7f7f7'
  },
  menuComponent: {
    top: '6%'
  },
  menuContent: {
    fontSize: (deviceWidth <= 320 ? 16 : (deviceWidth >= 768 ? 26 : 20)),
    padding: (deviceWidth >= 768 ? 15 : 8),
    color: '#0099cc',
  },
  buttonTxt: {
    fontSize: (deviceWidth >= 768 ? 24 : 18),
    alignSelf: 'center'
  },
  button: {
    marginLeft: deviceWidth/4,
    marginTop: 20,
    width: (deviceWidth >= 768 ? 320 : 180),
    height: (deviceWidth >= 768 ? 42 : 36),
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center'
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
  }
  /* SideMenu */
});

export default class DayView extends Component {

  constructor(props) {
        super(props);
        this.state = {
          /* SideMenu */
          isOpen: false,
        }
        this.toggleSideMenu = this.toggleSideMenu.bind(this);
  }

  componentDidMount() {
    AsyncStorage.getItem('JiveUserDetails').then((value) => {
      console.log("Results JiveUserDetails = "+value);
      console.log("User Jive data = " +JSON.parse(value));
      var userData = JSON.parse(value);
      console.log("userName = "+ userData.displayName + "User Avatar = " + userData.thumbnailUrl);
      this.setState({
        usrName: userData.displayName,
        usrAvatar: userData.thumbnailUrl,
        designation: userData.jive.profile[0].value,
      })
    }).done();
  }

  toggleSideMenu () {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  onDayLog() {
    this.props.navigator.push({
      route: 'day-log',
      passProps: {auth: this.props.auth}
    });
  }

  //  Reset Button Press
  onDayLogList() {
    this.props.navigator.push({
      route: 'day-log-list',
      passProps: {auth: this.props.auth}
    });
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

  render(){
    var MenuComponent = (
        <View style={styles.menuComponent}>
          <View>
            <Image style={styles.photo}
              defaultSource={require('../../../assets/images/male-silhouette3.png')}
              source={{uri: this.state.usrAvatar}}>
            </Image>
            <Text style={{fontSize: (deviceWidth <= 320 ? 18 : (deviceWidth >= 768 ? 28 : 22)), padding: (deviceWidth >= 768 ? 15 : 8), color: '#0077D0'}}> {this.state.usrName} </Text>
            <Text style={{fontSize: (deviceWidth <= 320 ? 14 : (deviceWidth >= 768 ? 22 : 18)), padding: (deviceWidth >= 768 ? 15 : 8)}}> {this.state.designation} </Text>
          </View>
          <View style={styles.separator}/>
          <View>
            <TouchableHighlight style={{height: (deviceHeight <= 568 ? 36 : (deviceWidth >= 768 ? 60 : 40))}} onPress={this.home.bind(this)} underlayColor='transparent'>
              <Text style={styles.menuContent}> Home </Text>
            </TouchableHighlight>
            <View style={styles.separator}/>

            <TouchableHighlight style={{height: (deviceHeight <= 568 ? 36 : (deviceWidth >= 768 ? 60 : 40))}} onPress={this.hr.bind(this)} underlayColor='transparent'>
              <Text style={styles.menuContent}> HR </Text>
            </TouchableHighlight>
            <View style={styles.separator}/>

            <TouchableHighlight style={{height: (deviceHeight <= 568 ? 36 : (deviceWidth >= 768 ? 60 : 40))}} onPress={this.onTimetrackSelect.bind(this)} underlayColor='transparent'>
              <Text style={styles.menuContent}> Time Track </Text>
            </TouchableHighlight>
            <View style={styles.separator}/>

            <TouchableHighlight style={{height: (deviceHeight <= 568 ? 36 : (deviceWidth >= 768 ? 60 : 40))}} onPress={this.inbox.bind(this)} underlayColor='transparent'>
              <Text style={styles.menuContent}> Inbox </Text>
            </TouchableHighlight>
            <View style={styles.separator}/>

            <TouchableHighlight style={{height: (deviceHeight <= 568 ? 36 : (deviceWidth >= 768 ? 60 : 40))}} onPress={this.marketing.bind(this)} underlayColor='transparent'>
              <Text style={styles.menuContent}> Marketing </Text>
            </TouchableHighlight>
            <View style={styles.separator}/>

            <TouchableHighlight style={{height: (deviceHeight <= 568 ? 36 : (deviceWidth >= 768 ? 60 : 40))}} onPress={this.onKnowledgeSelect.bind(this)} underlayColor='transparent'>
              <Text style={styles.menuContent}> Knowledge Network </Text>
            </TouchableHighlight>
            <View style={styles.separator}/>

            <TouchableHighlight style={{height: (deviceHeight <= 568 ? 36 : (deviceWidth >= 768 ? 60 : 40))}} onPress={this.it.bind(this)} underlayColor='transparent'>
              <Text style={styles.menuContent}> IT </Text>
            </TouchableHighlight>

          </View>
          <View style={styles.separator}/>
          <TouchableHighlight style={{height: (deviceHeight <= 568 ? 36 : (deviceWidth >= 768 ? 60 : 40))}} onPress={this.logOut.bind(this)} underlayColor='transparent'>
            <Text style={styles.menuContent}> Logout </Text>
          </TouchableHighlight>
        </View>
      );

    return (
      <SideMenu
      isOpen={this.state.isOpen}
      menu={MenuComponent}>
      <View style={styles.container}>
        <Header
          navigator={this.props.navigator}
          title={"Time Tracker"}
          notification={{callback: this.getNotifications.bind(this)}}
        />
        <View style={styles.separator}/>
        <View style={{marginLeft: 10, marginTop: 50}}>

          <View>
            <TouchableHighlight style={styles.button} onPress={this.onDayLog.bind(this)} underlayColor='#99d9f4'>
              <Text style={styles.buttonTxt}> Daily Task Log </Text>
            </TouchableHighlight>
          </View>

          <View style={{height: (deviceWidth >= 768 ? 60 : 30)}}>
          </View>

          <View>
            <TouchableHighlight style={styles.button} onPress={this.onDayLogList.bind(this)} underlayColor='#99d9f4'>
              <Text style={styles.buttonTxt}> Daily Task List </Text>
            </TouchableHighlight>
          </View>
        </View>

      </View>
      </SideMenu>
    );
  }

}
