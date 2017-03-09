import React, {Component} from 'react';
import{
  View,
  Text,
  StyleSheet,
  Dimensions,
  Navigator,PushNotificationIOS,AlertIOS,Alert
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';


import config from './dist/config.json';
import Signin from './src/signin';
import Home from './src/home';
import RequestAccess from './src/request';
import Notifications from './src/common/components/Notifications';
import CustomCell from './src/common/components/CustomCell';
import HRRecentPosts from './src/hr/components/RecentPosts';
import Inbox from './src/inbox/components/Inbox';
import PostView from './src/common/components/PostView';
import ITRecentPosts from './src/it/components/RecentPosts';
import DayLog from './src/timetracker/components/dayTrack/DayLog';
import DayLogList from './src/timetracker/components/dayTrack/DayLogList';
import DayList from './src/timetracker/components/dayTrack/DayList';
import DayLogUpdate from './src/timetracker/components/dayTrack/DayLogUpdate';
import DayView from './src/timetracker/components/dayTrack/DayView';
import WeekDayLog from './src/timetracker/components/weekTrack/WeekDayLog';
import WeekLogContainer from './src/timetracker/components/weekTrack/WeekLogContainer';
import MarketingRecentPosts from './src/marketing/components/RecentPosts';
import KNRecentPosts from './src/knowledge/components/RecentPosts';


var Platform = require('react-native').Platform;

ROUTES = {
  "signin": Signin,
  "home": Home,
  "request": RequestAccess,
  "notifications": Notifications,
  "hr/recent-posts": HRRecentPosts,
  "inbox": Inbox,
  "post-view": PostView,
  "it/recent-posts" : ITRecentPosts,
  'day-log': DayLog,  // For Only Day Input
  'day-log-list': DayLogList, // For Day List Select
  'day-list': DayList,  // For Day List
  'day-log-update': DayLogUpdate,  // For Day Update
  'day-view': DayView,  // For Day options View
  'week-log': WeekLogContainer,
  'weekday-log': WeekDayLog,
  "it/recent-posts" : ITRecentPosts,
  "marketing/recent-posts":MarketingRecentPosts,
  "kn/recent-posts": KNRecentPosts
}
const DEVICE_ID='';
export default class Router extends Component{
  constructor(props){
    super(props);
    this.config = config;
    this.navigator = null;
  this.state = {
    isReady: false
  };
  }

// componentWillMount(){
//   console.log("Will mount"+Platform.OS);
//
//   if(Platform.OS === 'ios'){
//     console.log("Will mount 2"+Platform.OS);
//
//      PushNotificationIOS.addEventListener('register', this.onPushRegistered.bind(this));
//     //  PushNotificationIOS.addEventListener('registrationError', this._onRegistrationError);
//       PushNotificationIOS.addEventListener('notification', this._onRemoteNotification);
//
//       PushNotificationIOS.requestPermissions();
//
//     }
//
// }

  componentWillMount(){
    console.log("willmount");

    console.log("Did mount"+Platform.OS);
    if(Platform.OS === 'ios'){
      console.log("Will mount 2"+Platform.OS);

       PushNotificationIOS.addEventListener('register', this.onPushRegistered.bind(this));
      //  PushNotificationIOS.addEventListener('registrationError', this._onRegistrationError);
        PushNotificationIOS.addEventListener('notification', this._onRemoteNotification);

        PushNotificationIOS.requestPermissions();

      }else{
        FCM.requestPermissions();

        FCM.getFCMToken().then((token) => this.onPushRegistered(token) )
            // fcm token may not be available on first load, catch it here

        FCM.getInitialNotification().then(notif => {
          console.log("INITIAL NOTIFICATION", notif)
        });

        this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
          this._onRemoteNotification(notif);
          this.showLocalNotification(notif);
          return;
        });
        this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, ((token) => this.onPushRegistered(token)));

      }


  }


 componentWillUnmount()
 {
   if(Platform.OS === 'ios'){
     PushNotificationIOS.removeEventListener('register', this.onPushRegistered);
     //  PushNotificationIOS.removeEventListener('registrationError', this._onRegistrationError);
     PushNotificationIOS.removeEventListener('notification', this._onRemoteNotification.bind(this));
   }
 }

 onPushRegistered(deviceToken) {
     console.log("Device Token Received: " + deviceToken);
     DEVICE_ID=deviceToken;
     this.setState({
      isReady: true
    });
   }

   showLocalNotification(notif) {
    FCM.presentLocalNotification({
      title: notif.message,
      body: notif.message,                    // as FCM payload (required)
      sound: "default",
      priority: "high",
      large_icon: "ic_launcher",
      vibrate: 300,
      lights: true,
      click_action: notif.click_action,
      show_in_foreground: true,
      local: true
    });
  }

   _onRemoteNotification(notification) {
      if(Platform.OS === 'ios'){
         Alert.alert(
           'Notification Received',
            notification.getMessage(),
           [{
             text: 'Dismiss',
             onPress: null,
           }]
        );
        return;
      } else{

        Alert.alert(
           notification.fcm.title,
           notification.fcm.body,
          [{
            text: 'Dismiss',
            onPress: null,
          }]
       );
       return;
      }

     console.log('hai:'+notification);
   }

  renderScene(route, navigator){
    this.navigator = navigator;
    console.log('device token 1',+DEVICE_ID);
      let Component = ROUTES[route.route];
      return <Component config = {this.config} navigator={navigator} {...route.passProps} deviceToken = {DEVICE_ID}/>;
  }
  render(){
    console.log("render");

    return(
      <Navigator
        style = {styles.container}
        initialRoute = {{route:'signin'}}
        renderScene = {this.renderScene.bind(this)}
        configureScene = {() => {return Navigator.SceneConfigs.FadeAndroid;}}
      />
    );
  }
}

let {height, width} = Dimensions.get('window');
EStyleSheet.build({
  rem: width > 340 ? 18 : 16,
  width: width,
  height: height
});

const styles = StyleSheet.create({
  container:{
    flex: 1
  }
});
