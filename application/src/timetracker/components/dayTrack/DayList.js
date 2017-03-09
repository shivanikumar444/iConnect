import React, { Component } from 'react';
import {AsyncStorage, Alert, StyleSheet, View, Text, ListView, TouchableHighlight, Image, Dimensions } from 'react-native';
import { SideMenu, List, ListItem } from 'react-native-elements';

import ActivityIndicator from '../../../common/components/ActivityIndicator';
import EStyleSheet from 'react-native-extended-stylesheet';
import Header from '../../../common/components/Header';

// import PropertyView from './PropertyView';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

const styles = EStyleSheet.create({
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10
  },
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
  navBar: {
    backgroundColor:'white',
    width: deviceWidth,
  },
  textContainer: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#E8E8E8'
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#48BBEC'
  },
  title: {
    fontSize: 20,
    color: '#656565'
  },
  rowContainer: {
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

export default class DayList extends Component {
  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource(
      {rowHasChanged: (r1, r2) => r1.guid !== r2.guid});
    this.state = {
      dataSource: dataSource.cloneWithRows(this.props.listData),
      /* SideMenu */
      isOpen: false,
    };
    this.toggleSideMenu = this.toggleSideMenu.bind(this);
  }

  componentDidMount(){
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

  rowPressed(rowData) {
    console.log("Row Data ----"+ JSON.stringify(rowData));
    this.props.navigator.push({
      route: 'day-log-update',
      title: 'Day List Update',
      passProps: {auth: this.props.auth, reqData: rowData}
    });
    // this.props.navigator.push({
    //   id: 'dayUpdate2',
    //   title: 'Enter Day Task Updates',
    //   component: DayLog2,
    //   passProps: {reqData: rowData}
    // });
  }

  renderRow(rowData, sectionID, rowID) {
    return (
      <TouchableHighlight onPress={() => this.rowPressed(rowData)}
          underlayColor='#dddddd'>
        <View>
        <View style={{margin: 5}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontWeight: 'bold'}}>Date                   :</Text><Text style={{marginLeft: 15}}>{rowData.date.toString()}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontWeight: 'bold'}}>Project              :</Text><Text style={{marginLeft: 15}}>{rowData.project_name.toString()}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontWeight: 'bold'}}>Hours                :</Text><Text style={{marginLeft: 15}}>{rowData.hours.toString()}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontWeight: 'bold'}}>User Name      :</Text><Text style={{marginLeft: 15}}>{rowData.u_name.toString()}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontWeight: 'bold'}}>Description     :</Text><Text style={{marginLeft: 15, marginRight: 100}}>{rowData.description.toString()}</Text>
          </View>
        </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
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

  render() {

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
        <ListView
          dataSource={this.state.dataSource}
          enableEmptySections={true}
          renderRow={this.renderRow.bind(this)}/>
      </View>
      </SideMenu>
    );
  }
}
