import React, { PureComponent } from 'react'
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  Navigator,
  PanResponder,
  BackAndroid,
  Platform,
  Alert,
  PushNotificationIOS,
  AppState,
  NetInfo
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet'

import Config from '../../dist/config.json'
import Signin from '../authentication/Signin'
import Header from '../common/views/Header'
import SideBarModel from '../common/sidenav/models/SideBar'
import PanResponderListener from '../common/views/PanResponderListener'
import OverlayManager from '../common/views/OverlayManager'
import PushNotifications from '../common/views/PushNotifications'
import UserModel from '../common/models/User'
import Notification from '../modules/notifications/views/Notification'
import Network from '../common/models/Network'

class AppView extends PureComponent{
  config = null;
  currentRoute = '';
  token='';
  navigator = null;

  constructor(props){
    super(props);
    this.config = Config;
    BackAndroid.addEventListener('hardwareBackPress', () => {
      // else case was handle inside mainActivity.java to hide the app,
      // when we have only one route in the stack.
      if(this.navigator && this.navigator.getCurrentRoutes().length > 1) {
        this.navigator.pop();
        return true;
      }
    });
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    NetInfo.addEventListener('change', this._handleConnectivityChange);
  }

  componentWillUnmount(){
    AppState.removeEventListener('change', this.handleAppStateChange);
    NetInfo.removeEventListener('change', this._handleConnectivityChange);
  }

  handleAppStateChange(appState){
    if(Platform.OS == 'ios'){
      PushNotificationIOS.setApplicationIconBadgeNumber(0);
    }
  }

   _handleConnectivityChange = (isConnected) => {
       Network.setNetworkState(isConnected);
   };

  updateMenuState(isOpen) {
    SideBarModel.setIsOpen(isOpen);
    OverlayManager.setOverlayState({
      overlay: isOpen,
      loading: false
    });
  }

  getCurrentRouteName(){
    return this.navigator.getCurrentRoutes()[this.navigator.getCurrentRoutes().length -1].title;
  }

  getRoutesLength(){
    return this.navigator ? this.navigator.getCurrentRoutes().length : 0 ;
  }

  onNotificationRecieved(notification){
    let data = null;
    let message = '';
    if(Platform.OS == 'ios'){
      data = notification.getData().data;
      message = notification.getMessage();

    }
    else if(Platform.OS == 'android'){
      // for android we are getting string from fcm, so need to parse it to json
      data = JSON.parse(notification.data);
      message = data.title
    }
    UserModel.setNotificationsCount(data.notification_cnt);
    UserModel.setCandidatesCount(data.candidate_cnt);

    if(this.getRoutesLength() >= 1 && this.getCurrentRouteName() != 'Signin'){
      Alert.alert(
        'Notification Received',
         message,
        [{
            text: 'Dismiss'
          },
          {
            text:'Open',
            onPress:()=>{this.navigateToNotification(data)}
          }]
      );
    }
  }


  navigateToNotification(data){
    /* Add NotificationView to this class */
    if (data) {
       this.navigator.push({
         component: Notification,
         title: 'Notification',
         passProps:{
           data: data,
         }
       });
    }
  }

  renderScene(route, navigator){
    this.currentRoute = route.title;
    return(
      <PanResponderListener overlayManager = {OverlayManager} navigator={navigator} sideBarModel = {SideBarModel} currentRoute = {this.currentRoute} userModel = {UserModel} config = {this.config}>
        <View style={styles.rightContent}>

          <View style={styles.header}>
            <Header navigator={navigator} title={route.title} user={UserModel} openMenu={() => {this.updateMenuState(true)}}/>
          </View>
          <View style={styles.body}>
            <route.component config = {this.config} navigator={navigator} user={UserModel} sideBarModel = {SideBarModel} {...route.passProps} overlayManager={OverlayManager}/>
          </View>
        </View>
      </PanResponderListener>
    )
  }

  getRenderConfigurations(route, routeStack){
    return {
      ...Navigator.SceneConfigs.FadeAndroid,
      gestures: {}
    };
  }

  render(){
    return(
      <View style={styles.mainView}>
        <Navigator
          initialRoute = {{
            component: Signin,
            title: 'Signin',
            passProps: {
              user: UserModel
            }
          }}
          ref={(nav) => this.navigator = nav }
          renderScene = {this.renderScene.bind(this)}
          configureScene = {this.getRenderConfigurations.bind(this)}
        />
        <PushNotifications
          onChangeToken={(token) => {
            if(token){
              UserModel.setDeviceToken(token)
            }
          }}
          onNotificationRecieved ={(notification) =>{this.onNotificationRecieved(notification)}} />
      </View>
    )
  }

}

const styles = EStyleSheet.create({
  mainView:{
    flex: 1
  },
  rightContent:{
    width: '$widthPix',
    height: '$heightPix'
  },
  header:{
    width: '$widthPix'
  },
  body:{
    flexGrow: 1,
    '@media android':{
      paddingBottom: 25
    }
  }
});

let heightPix = Dimensions.get('window').height;
let widthPix = Dimensions.get('window').width;
//let width='width';
//let height='height';

EStyleSheet.build({
  rem: widthPix > 340 ? 18 : 16,
  widthPix: widthPix,
  heightPix: heightPix,
  /*'@media (orientation:portrait)':{
    width: width,
    height: height
  },
  '@media (orientation:landscape)':{
    width: height,
    height: width
  }*/
});

export default AppView
