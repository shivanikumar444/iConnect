import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  ListView,
  Text,
  Dimensions,
  AsyncStorage,
  Alert,
  BackAndroid
} from 'react-native';
import { SideMenu, List, ListItem } from 'react-native-elements';
import ActivityIndicator from './common/components/ActivityIndicator';

import EStyleSheet from 'react-native-extended-stylesheet';
import Header from './common/components/Header';

var widthScreen = Dimensions.get('window').width;
var heightScreen = Dimensions.get('window').height;

export default class Home extends Component{
  constructor(props){
    super(props);
    /*  ActivityIndicator  */
    this.state = {
      overlayState: "",
      animating: false,
      /* SideMenu */
      isOpen: false
    }
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
    BackAndroid.addEventListener("hardwareBackPress", () => {
        if (this.props.navigator.getCurrentRoutes().length > 1) {
          this.props.navigator.pop();
          return true;
        }else {
          return false;
        }
    });
    AsyncStorage.getItem('auth').then((value) => {console.log("Auth = " +value);})
  }

  toggleSideMenu () {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  getNotifications(){
    this.props.navigator.push({route: 'notifications'});
  }

  overlay(){
    if (this.state.overlayState == "true") {
      return (<View style={styles.overlay}>
      </View>);
    }
    return (<View/>);
  }

  /* Inbox */
  onInbox(){
    this.props.navigator.push({
      route: 'inbox',
      title: 'Inbox',
      passProps: {auth: this.props.auth}
    });
  }
  /* HR */
  onHR(){
    this.props.navigator.push({
      route: 'hr/recent-posts',
      title: 'HR',
      passProps: {auth: this.props.auth}
    });
  }

  onItSelect(){
    this.props.navigator.push({
      route: 'it/recent-posts',
      title: 'IT',
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

  onMarketingSelect(){
    this.props.navigator.push({
      route: 'marketing/recent-posts',
      title: 'Marketing',
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

  render(){
    console.log("props = "+this.props.email+ "Authorization = " + this.props.auth);
    console.log("userName = "+ this.state.usrName + "User Avatar = " + this.state.usrAvatar);

    var MenuComponent = (
        <View style={styles.menuComponent}>
          <View>
            <Image style={styles.photo}
              defaultSource={require('./assets/images/male-silhouette3.png')}
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

            <TouchableHighlight style={{height: (heightScreen <= 568 ? 36 : (widthScreen >= 768 ? 60 : 40))}} onPress={this.onHR.bind(this)} underlayColor='transparent'>
              <Text style={styles.menuContent}> HR </Text>
            </TouchableHighlight>
            <View style={styles.separator}/>

            <TouchableHighlight style={{height: (heightScreen <= 568 ? 36 : (widthScreen >= 768 ? 60 : 40))}} onPress={this.onTimetrackSelect.bind(this)} underlayColor='transparent'>
              <Text style={styles.menuContent}> Time Tracker </Text>
            </TouchableHighlight>
            <View style={styles.separator}/>

            <TouchableHighlight style={{height: (heightScreen <= 568 ? 36 : (widthScreen >= 768 ? 60 : 40))}} onPress={this.onInbox.bind(this)} underlayColor='transparent'>
              <Text style={styles.menuContent}> Inbox </Text>
            </TouchableHighlight>
            <View style={styles.separator}/>

            <TouchableHighlight style={{height: (heightScreen <= 568 ? 36 : (widthScreen >= 768 ? 60 : 40))}} onPress={this.onMarketingSelect.bind(this)} underlayColor='transparent'>
              <Text style={styles.menuContent}> Marketing </Text>
            </TouchableHighlight>
            <View style={styles.separator}/>

            <TouchableHighlight style={{height: (heightScreen <= 568 ? 36 : (widthScreen >= 768 ? 60 : 40))}} onPress={this.onKnowledgeSelect.bind(this)} underlayColor='transparent'>
              <Text style={styles.menuContent}> Knowledge Network </Text>
            </TouchableHighlight>
            <View style={styles.separator}/>

            <TouchableHighlight style={{height: (heightScreen <= 568 ? 36 : (widthScreen >= 768 ? 60 : 40))}} onPress={this.onItSelect.bind(this)} underlayColor='transparent'>
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
          navigator={this.props.navigator}
          title= {this.props.title}
          notification={{callback: this.getNotifications.bind(this)}}
        />
        <View style={styles.separator}/>
        <View style={styles.mainBody}>

          <Image source={require('./assets/images/main.png')} style={styles.image}>
            <View style={styles.welcomeView}>
              <Text style={styles.welcomeText}> Welcome to iTalent iConnect </Text>
            </View>
          </Image>

          {/* Image views */}
          <TouchableHighlight style={styles.box1} onPress={this.onInbox.bind(this)} underlayColor='transparent'>
            <View/>
          </TouchableHighlight>

          <TouchableHighlight style={styles.box2} onPress={this.onKnowledgeSelect.bind(this)} underlayColor='transparent'>
            <View/>
          </TouchableHighlight>

          <TouchableHighlight style={styles.box3} onPress={this.onHR.bind(this)} underlayColor='transparent'>
            <View/>
          </TouchableHighlight>

          <TouchableHighlight style={styles.box4} onPress={this.onTimetrackSelect.bind(this)} underlayColor='transparent'>
            <View/>
          </TouchableHighlight>

          <TouchableHighlight style={styles.box5} onPress={this.onItSelect.bind(this)} underlayColor='transparent'>
            <View/>
          </TouchableHighlight>

          <TouchableHighlight style={styles.box6} onPress={this.onMarketingSelect.bind(this)} underlayColor='transparent'>
            <View/>
          </TouchableHighlight>

        </View>
        <View style={{top: heightScreen/3, left: widthScreen/2}}>
          <ActivityIndicator
            animating = {this.state.animating}/>
        </View>
        {this.overlay()}
      </View>
      </SideMenu>
  );
}
}

const styles = EStyleSheet.create({
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
  header: {
    position: 'absolute',
    top: 50,
  },
  body:{
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    fontSize: 16
  },
  flowRight: {
    // flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    // marginLeft: 20,
    marginTop: 10
  },
  image: {
    width: widthScreen,
    height: "70%",
    marginTop: '5%'
  },
  text: {
    fontSize: 18,
  },
  mainBody: {
    width: widthScreen,
    height: '100%',
    backgroundColor: '#f7f7f7'
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
  welcomeView: {
    paddingTop: (widthScreen <= 320 ? '0%' : (widthScreen >= 768 ? "0%" : "3%"))
  },
  welcomeText: {
    fontSize: (widthScreen >= 768 ? 32 : 24),
    fontWeight: 'bold',
    color: '#0099cc',
    textAlign: 'center'
  },
  box1: {
    position: 'absolute',
    top: (widthScreen >= 768 ? "27%" : "31%"),
    left: "8%",
    width: (widthScreen >= 768 ? "15%" : "14%"),
    height: (widthScreen >= 768 ? 120 : 60),
    borderRadius: (widthScreen >= 768 ? 45 : 50),
  },
  box2: {
    position: 'absolute',
    top: (widthScreen >= 768 ? "47%" : "45%"),
    left: "22%",
    width: (widthScreen >= 768 ? "15%" : "14%"),
    height: (widthScreen >= 768 ? 120 : 60),
    borderRadius: (widthScreen >= 768 ? 45 : 50),
  },
  box3: {
    position: 'absolute',
    top: (widthScreen >= 768 ? "13%" : "20%"),
    left: "30%",
    width: (widthScreen >= 768 ? "15%" : "14%"),
    height: (widthScreen >= 768 ? 120 : 60),
    borderRadius: (widthScreen >= 768 ? 45 : 50),
  },
  box4: {
    position: 'absolute',
    top: (widthScreen >= 768 ? "16%" : "22%"),
    left: "61%",
    width: (widthScreen >= 768 ? "15%" : "14%"),
    height: (widthScreen >= 768 ? 120 : 60),
    borderRadius: (widthScreen >= 768 ? 45 : 50),
  },
  box5: {
    position: 'absolute',
    top: (widthScreen >= 768 ? "50%" : "48%"),
    left: "50%",
    width: (widthScreen >= 768 ? "15%" : "14%"),
    height: (widthScreen >= 768 ? 120 : 60),
    borderRadius: (widthScreen >= 768 ? 45 : 50),
  },
  box6: {
    position: 'absolute',
    top: "39%",
    left: "74%",
    width: (widthScreen >= 768 ? "15%" : "14%"),
    height: (widthScreen >= 768 ? 120 : 60),
    borderRadius: (widthScreen >= 768 ? 45 : 50),
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
  /* SideMenu */
});
