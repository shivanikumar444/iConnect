import React, { Component } from 'react';
import {
  View,
  Text,
  AsyncStorage,
  TouchableHighlight,
  Alert,
  Image,
  Dimensions
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import { SideMenu, List, ListItem } from 'react-native-elements';
import Header from '../../../common/components/Header';
import ActivityIndicator from '../../../common/components/ActivityIndicator';
import WeekLogContent from './WeekLogContent';

const WEEKS = [0,1,2,3,4];
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const TOT_DAYS = 7;
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

export default class WeekLogContainer extends Component {
  weeksList = [];
  upDatedLogs = [];
  TIME_TRACK_BASE_URI = '';
  constructor(props){
    super(props);
    this.TIME_TRACK_BASE_URI = this.props.config.TIME_TRACK_BASE_URI;
    this.state = {
      loading: true,
      currentUserId: '',
      logs: [],
      logData: '',
      overlay: false,
      isOpen: false
    };
    this.toggleSideMenu = this.toggleSideMenu.bind(this);
  }

  /*
    @Param date
    returns last 5 weeks starting from sunday to
  */
  getWeeks(date){
    let futureDate = pastDate = date;
    parsedFutureDate = futureDate.setDate(date.getDate() + (6 - date.getDay()));
    // sets current month to last month
    pastDate.setMonth(date.getMonth() - 1);
    // sets date to the first sunday of the day week.
    parsedPastDate = pastDate.setDate(date.getDate() - date.getDay());
    let resultantWeeks = [];
    while(parsedPastDate <= parsedFutureDate){
      // need to create new date object with this date
      // otherwise, it updates all the date reference even inside
      // resultantweeks after setDate
      let newDate = new Date(pastDate);
      date = ("0" + newDate.getDate()).slice(-2);
      month = ("0" + (newDate.getMonth() + 1)).slice(-2);
      year = newDate.getFullYear();
      formattedDate = year+'-'+month+'-'+date;
      resultantWeeks.push(formattedDate);
      parsedPastDate = pastDate.setDate(pastDate.getDate() + 1);
      newDate = null;
    }
    return resultantWeeks;
  }

  getLogData(logs, userId){
    let logObj = [];
    for(i=0;i<this.weeksList.length;i++){
      let dateMatched = false;
      let trackId='';
      let hours = ''
      for(j=0;j<logs.length;j++){
        parsedWeekDate = Date.parse(this.weeksList[i]);
        parsedLoggedDate = Date.parse(logs[j].date);
        if(parsedLoggedDate > parsedWeekDate){
          break;
        }
        if(parsedLoggedDate == parsedWeekDate){
          dateMatched = true;
          trackId = logs[j].track_id;
          hours = logs[j].hours;
        }
      }
      if(trackId != ''){
        logObj.push(
          {
            track_id: trackId,
            date: this.weeksList[i],
            hours: hours,
            user_id: userId
          }
        );
      }
      else{
        logObj.push(
          {
            date: this.weeksList[i],
            hours: hours,
            user_id: userId
          }
        );
      }
    }
    return logObj;
  }

  getTimeTrackDetails(startDate, endDate, userId){
    let data = {
      mode: "weekLog",
      entryObj: {
        user_id: userId,
        startDate: startDate,
        endDate: endDate
      }
    };
    fetch(this.TIME_TRACK_BASE_URI+'manageWeek.php',{
      method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(data)
     })
    .then((response) => response.json())
    .then((jsonResponse) => {
      this.setState({
        loading: false,
        currentUserId: userId,
        logs: jsonResponse.logs,
        logData: this.getLogData(jsonResponse.logs, userId)
      });
    })
    .catch((error) => {
      this.setState({
        error: error,
        loading: false
      });
      console.warn(error);
    })
  }

  updateTotalLogs(logObj, hours){
    let dateMatched = false;
    let parsedUpdatedLogDate = Date.parse(logObj.date);
    for(i=0;i<this.upDatedLogs.length;i++){
      let parsedDate = Date.parse(this.upDatedLogs[i].date);
      if(parsedUpdatedLogDate == parsedDate){
        dateMatched = true;
        this.upDatedLogs[i].hours = hours;
      }
    }
    if(!dateMatched){
      this.upDatedLogs.push(logObj);
    }
  }

  componentDidMount(){

    this.weeksList = this.getWeeks(new Date());

    AsyncStorage.getItem('UserLoginData')
    .then((userData) => {
      this.getTimeTrackDetails(this.weeksList[0], this.weeksList[this.weeksList.length - 1], JSON.parse(userData)[0].login_user_id);
    })
    .catch((error) => {
      console.warn("Something went wrong while fetch user data from storage: "+error);
    })

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

  trucateAndReplace(date){
     let truncDate = date.substring(date.indexOf('-') + 1, date.length);
     let monthAndDate = truncDate.split('-');
     let monthNum = parseInt(monthAndDate[0]);
     let month = MONTHS[monthNum - 1];
     return monthAndDate[1] + '-' + month;
  }

  getTabLabel(from, to){
    let fromDate = this.trucateAndReplace(this.weeksList[from]);
    let toDate = this.trucateAndReplace(this.weeksList[to - 1]);
    let label = fromDate + ' to ' + toDate;
    return label;
  }

  getLogForWeek(from, to){
    let data = [];
    for(i=from;i<to;i++){
      data.push(this.state.logData[i]);
    }
    return data;
  }

  onSubmit(){
    let changedLogs = [];
    this.setState({
      overlay: true
    });
    for(i=0;i<this.upDatedLogs.length;i++){
      if(!this.upDatedLogs[i].track_id && this.upDatedLogs[i].hours == ''){
        continue;
      }
      else{
        changedLogs.push(this.upDatedLogs[i]);
      }
    }
    if(!changedLogs.length){
      return Alert.alert(
        'Alert',
        'Nothing was updated to submit',
        [
          {text: 'OK'}
        ]
      )
    }
    let data = {
      mode: "insert",
      entryObj: changedLogs
    };
    fetch(this.TIME_TRACK_BASE_URI+'manageWeek.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((responseData) => {
      Alert.alert(
        'Sucess',
        'Details were submitted successfully',
        [
          {text: 'OK', onPress: () => this.reloadPage()}
        ]
      )
    })
    .catch((error) => {
      console.warn("Something went wrong while submitting the week log details: "+error);
    })
  }

  reloadPage(){
    this.props.navigator.replace({
      route: 'week-log',
      passProps: {auth: this.props.auth}
    })
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


      if(this.state.loading){
        return (
          <View style={styles.container}>
            <Header navigator={this.props.navigator} title={"Time Tracker"}/>
            <View style={styles.separator}/>
            <ActivityIndicator animating = {this.state.loading} />
          </View>
        )
      }
      if(this.state.error){
        return(
          <SideMenu
            isOpen={this.state.isOpen}
            menu={MenuComponent}>
            <View style={styles.container}>
              <Header navigator={this.props.navigator} title={"Time Tracker"}/>
              <View style={styles.separator}/>
              <View style={styles.errorContainer}>
                <Text style={styles.error}>Something went wrong please try after some time </Text>
              </View>
            </View>
          </SideMenu>
        )
      }
      else{
        return(
          <SideMenu
            isOpen={this.state.isOpen}
            menu={MenuComponent}>
            <View style={styles.container}>
              <Header navigator={this.props.navigator} title={"Time Tracker"}/>
              <View style={styles.separator}/>
              <View style={styles.tabView}>
                <ScrollableTabView
                  style={{marginTop: 10, height: 10}}
                  scrollOffset={2}
                  renderTabBar={() => <ScrollableTabBar />}
                >
                  {
                    WEEKS.map((item, index) => {
                      return(
                        <WeekLogContent key={item} tabLabel={this.getTabLabel(item*TOT_DAYS, (item+1)*TOT_DAYS)} weekLog = {this.getLogForWeek(item*TOT_DAYS, (item+1)*TOT_DAYS)} updateCallBack = {this.updateTotalLogs.bind(this)} navigator = {this.props.navigator}/>
                      )
                    })
                  }
                </ScrollableTabView>
              </View>

              <View style={styles.bottomContent}>
                <View style={styles.button}>
                  <TouchableHighlight onPress={this.onSubmit.bind(this)} underlayColor='#99d9f4'>
                    <Text style={styles.btnText}> Submit </Text>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </SideMenu>
        )
      }
  }
}

const styles = EStyleSheet.create({
  container:{
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
  tabView:{
    height: '70%'
  },
  separator: {
    height: 1,
    backgroundColor: '#E8E8E8'
  },
  bottomContent:{
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button:{
    justifyContent: 'center',
    alignItems: 'center',
    width: '70%',
    height: '7%',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: '1%'
  },
  btnText:{
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
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
});
