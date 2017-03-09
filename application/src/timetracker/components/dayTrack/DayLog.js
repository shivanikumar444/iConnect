'use strict';

import React, { Component } from 'react';
import { Platform, StyleSheet, Image, View, TouchableHighlight, ListView, Text, Dimensions, ScrollView, Picker, PickerItem, DatePickerIOS, TextInput, Animated, AsyncStorage, Alert } from 'react-native';
import DatePicker from 'react-native-datepicker';
import ModalDropdown from 'react-native-modal-dropdown';
import ActivityIndicator from '../../../common/components/ActivityIndicator';
import EStyleSheet from 'react-native-extended-stylesheet';
import Header from '../../../common/components/Header';
import ModalPicker from 'react-native-modal-picker';
import { SideMenu, List, ListItem } from 'react-native-elements';

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var date = new Date();

const styles = EStyleSheet.create({
  text: {
    fontSize: (deviceWidth >= 768 ? 24 : 18),
    fontWeight: 'bold',
    margin: 10,
    color: '#336EA3'
  },
  title: {
    fontSize: 18,
    margin: 5,
    color: '#336EA3'
  },
  heading: {
    flex: 2,
    margin: 12,
  },
  buttonTxt: {
    fontSize: (deviceWidth >= 768 ? 22 : 18),
    alignSelf: 'center'
  },
  modelPicker: {
    marginLeft: 13,
    width: deviceWidth/2.2,
    height: 36,
    backgroundColor: '#fff',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    textAlign: 'center'
  },
  modelPicker2: {
    marginLeft: 15,
    width: deviceWidth/2.2,
    height: 36,
    backgroundColor: '#fff',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    textAlign: 'center'
  },
  button: {
    margin: (deviceWidth >= 768 ? 20 : 10),
    width: (deviceWidth >= 768 ? 200 : 100),
    height: (deviceWidth >= 768 ? 40 : 36),
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center',
  },
  pickerText:{
    fontSize: (deviceWidth >= 768 ? 24 : 18),
    fontWeight: 'normal',
    color: '#a9a9a9',
    borderWidth:1,
    textAlign:'center',
    height:34,
    borderRadius:8,
    borderColor:'#48BBEC',
    marginLeft: 9,
    padding:5
  },
  picker: {
    width: 100,
  },
  multiline: {
    borderWidth: 0.5,
    borderColor: '#0f0f0f',
    flex: 1,
    fontSize: 13,
    height: 50,
    padding: 4,
    marginBottom: 4,
  },
  /*  Picker View */
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
  showtimeContainer: {
   borderTopColor: '#ededed',
    borderTopWidth:1
  },
  showtime: {
   padding:20,
    textAlign: 'center'
  },
  closeButtonContainer: {
   flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopColor: '#e2e2e2',
    borderTopWidth: 1,
    borderBottomColor: '#e2e2e2',
    borderBottomWidth:1
  },
  closeButton: {
   paddingRight:10,
    paddingTop:10,
    paddingBottom:10
  },
  // buttonTxt: {
  //  textAlign: 'center',
  //
  // },
  closeButtonText: {
   color: '#027afe'
  },

  dropdown_1: {
    flex: 1,
    top: 32,
    left: 8
  },

  // Platform
  platform: {
    top: (Platform.OS === 'android') ? -30 : 0,
    marginTop: (Platform.OS === 'ios') ? -deviceHeight/6 : 0,
    height: (Platform.OS == 'android') ? deviceHeight/6 : 36
    // Platform.select({
    //   ios: {
    //     marginTop: -deviceHeight/6,
    //   },
    //   android: {
    //   },
    // }),
  },
  /*Modal dropdown*/
  row: {
    // flex: 1,
    flexDirection: 'row',
    width: deviceWidth/2.2,

  },
  cell: {
    margin: 10,
    marginLeft: 13,
    width: deviceWidth/2,
    height: 36,
    backgroundColor: '#fff',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignSelf:'center',
  },
  dropdown_6: {
    // flex: 1,
    margin: 5,
  },
  hourcell: {
    margin: 10,
    padding: 4,
    width: 50,
    height: 36,
    backgroundColor: '#fff',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignSelf:'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#E8E8E8'
  },
  /*Modal dropdown*/
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


var picker = {zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9};
export default class DayLog extends Component {
  TIME_TRACK_BASE_URI = '';
  constructor(props) {
        super(props);
        this.TIME_TRACK_BASE_URI = this.props.config.TIME_TRACK_BASE_URI;
        this.state = {
          date: date,
          /*PickerView*/
          textInputValue: 'Select Project',
          textInputId: '',
          taskInputValue: 'Select Task',
          taskInputId: '',
          todayDate: new Date(),
          textHrsValue: '0',
          textMinValue: '00',
          textFieldValue: '',
          projName: [],
          taskType: [],
          login_user_id: '',
          sessionid: '',
          track_id: '',
          /* SideMenu */
          isOpen: false,
        };
        this.toggleSideMenu = this.toggleSideMenu.bind(this);
    }

    componentWillMount() {
      var projectdetails = [];
      var projData = [{key: 0, label: 'Select'}];

      /* projectdetails data */
      AsyncStorage.getItem('projectdetails').then((value) => {
        console.log("Results projectdetails = "+value);
        let tr = JSON.parse(value);
        let ttl = [];
        console.log("Results projectdetails json = "+tr[1].pname + "Length =" + tr.length);

        for (var i = 0; i < tr.length; i++) {
          ttl.push({
              key:   i.toString(),
              label: tr[i].pname,
              project_id: tr[i].pid
          });
        }
        console.log("Total array = "+ JSON.stringify(ttl));
        this.setState({projName: ttl})
      }).done();

      /*  taskDetails data */
      AsyncStorage.getItem('taskDetails').then((value) => {
        console.log("Results taskDetails = "+value);
        let tdr = JSON.parse(value);
        let ttdl = [];
        console.log("Results projectdetails json = "+tdr[1].tname + "Length =" + tdr.length);

        for (var i = 0; i < tdr.length; i++) {
          ttdl.push({
              key:   i.toString(),
              label: tdr[i].tname,
              task_id: tdr[i].tid
          });
        }
        console.log("Total array = "+ JSON.stringify(ttdl));
        this.setState({taskType: ttdl});
      }).done();

      AsyncStorage.getItem('UserLoginData').then((value) => {
        console.log("Results UserLoginData = "+value);
        this.setState({login_user_id: JSON.parse(value)[0].login_user_id});
        console.log("login_user_id = " + this.state.login_user_id);
      }).done();
      AsyncStorage.getItem('sessionid').then((value) => {
        console.log("Results sessionid = "+value);
        this.setState({sessionid: value});
      }).done();
      // AsyncStorage.getItem('timetrackdetails').then((value) => {
      //   console.log("Results timetrackdetails = "+value);
      //   this.setState({track_id: JSON.parse(value)[0].id});
      // }).done();
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

    getNotifications(){
      this.props.navigator.push({route: 'notifications'});
    }

    inputVaidation(){
      if (this.state.textInputValue == "" ) {
        alert("Please Select the Project Name.");
        return false;
      }
    }
  //  Submit Button Press
  onSubmit(){
    // alert(this.state.textInputValue+" "+ this.state.taskInputValue +" "+this.state.todayDate +" "+this.state.textHrsValue +" "+this.state.textFieldValue)
    if (this.state.textInputValuethis == "Select Project" || this.state.taskInputValue == "Select Task" || this.state.todayDate == "" || this.state.textHrsValue == "0" || this.state.textFieldValue == "") {
      alert("Please fill all the mandatery fields.");
    }else {

    console.log("Project Name = " + this.state.textInputValue +
      ", Project Id = " + this.state.textInputId +
      ", Task Type = " + this.state.taskInputValue +
      ", Task Id = " + this.state.taskInputId +
      ", Date = " + this.state.todayDate +
      ", No of Hours = " + this.state.textHrsValue +
      ", No of Minutes = " + this.state.textMinValue +
      ", user_id(The user whose data is modified) = " + this.state.login_user_id +
      ", Track Id = " + this.state.track_id +
      ", sessionid = " + this.state.sessionid +
      ", login_user_id = " + this.state.login_user_id +
      ", Task Description = " + this.state.textFieldValue);

      console.log("Date = " + this.state.todayDate +
        ", Project Id = " + this.state.textInputId +
        ", Task Id = " + this.state.taskInputId +
        ", No of Hours = " + this.state.textHrsValue +
        ", No of Minutes = " + this.state.textMinValue +
        ", Task Description = " + this.state.textFieldValue +
        ", Track Id = " + this.state.track_id +
        ", sessionid = " + this.state.sessionid +
        ", user_id(The user whose data is modified) = " + this.state.login_user_id +
        ", login_user_id = " + this.state.login_user_id
        );

      var url = {
        date: this.state.todayDate.toString(),
        projectid: this.state.textInputId.toString(),
        task_id: this.state.taskInputId.toString(),
        hours: this.state.textHrsValue.toString(),
        minutes: this.state.textMinValue.toString(),
        description: this.state.textFieldValue.toString(),
        track_id: this.state.track_id.toString(),
        // sessionid: this.state.sessionid.toString(),
        user_id: this.state.login_user_id.toString(),
        login_user_id: this.state.login_user_id.toString(),
      };
      console.log("URl = " + url + " " + this.state.todayDate);
      console.log(" encodeURIComponent = " + encodeURIComponent(this.state.textFieldValue));
      var  str = [];
        for (var p in url){
            if (p == "user_id") {
                var user_id = encodeURIComponent(url[p]);
                str.push(encodeURIComponent(p) + "=" + user_id.replace('%00%00', ''));
            } else {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(url[p]));
            }
        }
        var totalStr = str.join("&");
        console.log("totalStr = "+ totalStr);

        var url2 = {
             mode: "insert",
              entryObj: {
              date: this.state.todayDate,
              project_id: this.state.textInputId,
              task_id: this.state.taskInputId,
              hours: this.state.textHrsValue,
              minutes: this.state.textMinValue,
              description: this.state.textFieldValue,
              track_id: this.state.track_id,
              user_id: this.state.login_user_id,
              login_uid: this.state.login_user_id,
              week_mode: '0',
            }
        };
        console.log("URl 2"+JSON.stringify(url2));
        var data = {
             mode:"insert",
             entryObj:{
           	 	 user_id: '1234',
  		         project_id: "23",
  		         task_id:"234",
	             date: "23-12-2016",
	             hours: "7",
	             minutes: "30",
	             description: "description of work",
	             login_uid: "22",
             }
        }

        fetch(this.TIME_TRACK_BASE_URI+'manageEntry.php', {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(url2)
        })
        .then((response) => response.json())
        .then((responseData) => {
          console.log(" Teesting");
          console.log(responseData);

          if (responseData.success != '0') {
            AsyncStorage.setItem('entryDetails', JSON.stringify(responseData.entryDetails));
            AsyncStorage.getItem('entryDetails').then((value) => {console.log("Results entryDetails = "+value);}).done();
            this.onReset();
            // alert("Update Sucessfully" );
          }else {
            alert("Enter all the fields" );
          }

          // this.onReset();
          // return alert('Updated Sucessfully...');

        })
        .catch((error) => {
          console.warn(error);
        })
        .done();

        setTimeout(() => {
          alert("Update Sucessfully");
        }, 1500);
      //   .then((response) => {console.log("shivani"+response);
      //   console.log(response);
      //   console.log(response.);
      //   console.log("Object"+ JSON.stringify(response));
      // })
      //   // .then((responseData) => {
      //   //   console.log("shivani"+responseData);
      //   //     })
      //       .catch((error) => {
      //         console.warn(error);
      //       })
      //       .done();
        /*
        fetch('http://iappease.com/timetrack/manageEntry.php', {
             method: 'POST',
             headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
             body: data
          })
          .then((response) => {console.log(response);} )
          // .then((responseJson) => {
          //   console.log("Data "   + JSON.parse(responseJson));
          //   // console.log("Daily Track manageTask  ="+ JSON.stringify(responseJson));
          //  //  AsyncStorage.setItem('taskDetails', JSON.stringify(responseJson.taskDetails));
          //
          //
          // })
          .catch((error) => {
             console.error(error);
          })
          .done();
          */
    /* Start: Updating user details to Server */
    /*
    fetch('http://iappease.com/timetrack/timetrackInsert.php?'+totalStr , {
         method: 'POST',
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          // body: JSON.stringify({
          //   date: this.state.todayDate,
          //   projectid: this.state.textInputId,
          //   task_id: this.state.taskInputId,
          //   hours: this.state.textHrsValue,
          //   minutes: this.state.textMinValue,
          //   description: this.state.textFieldValue,
          //   track_id: this.state.track_id,
          //   sessionid: this.state.sessionid,
          //   user_id: this.state.login_user_id,
          //   login_user_id: this.state.login_user_id,
          //   cntrl: this.state.cntrl
          // })
      })
      .then((response) => response.json())
      .then((responseJson) => {
         console.log("Daily Track Response 1 ="+responseJson);
         AsyncStorage.setItem('insert', JSON.stringify(responseJson));
         AsyncStorage.getItem('insert').then((value) => {
           console.log("Daily Track Response 2 = "+value);
         }).done();
        //  console.log("JSON response = " + JSON.parse(responseJson));
         // console.log("Time Track Response 2 ="+responseJson.id);
         //
         // console.log("user_id = "+ responseJson.id + ", uname = " + responseJson.emails[0].value + ", UserName = " + responseJson.displayName + ", givenName = " + responseJson.name.givenName + ", familyName = " + responseJson.name.familyName + ", EmpNumber = " + responseJson.id + ", Country = " + responseJson.addresses[0].value.country + ", cntrl = italent is the best");
         // Storing response data at application level


      })
      .catch((error) => {
         console.error(error);
      })
      .done();
      */
    /* End: Updating user details to Server */
  }
  }

  //  Reset Button Press
  onReset(){
    this.setState({
      textInputValue: 'Select Project',
      textInputId: '',
      taskInputValue: 'Select Task',
      taskInputId: '',
      todayDate: '',
      textHrsValue: '0',
      textMinValue: '00',
      textFieldValue: '',
      track_id: '',
    });
  }

  onDateChange = (date) => {
    this.setState({date: date});
    console.log('Date'+date);
  };

  textChange = (text) => {
    this.setState({text: text});
    console.log('Date'+text);
    this.setState({textFieldValue: text});
    console.log('textFieldValue ='+this.state.textFieldValue);
  };

  /* Start: Modal Dropdown methods*/
  _dropdown_6_onSelect(idx, value) {
    let selectedProject = this.state.projName[idx];
    console.log("Selected project: "+selectedProject.label);
    console.log("selected project id: "+selectedProject.project_id);
    this.setState({
      textInputValue: value,
      textInputId: selectedProject.project_id
    })
  }

  onTaskTypeSelect(idx,value){
    let selectedTask = this.state.taskType[idx];
    console.log("Selected project: "+selectedTask.label);
    console.log("selected project id: "+selectedTask.task_id);
    this.setState({
      taskInputValue: selectedTask.label,
      taskInputId: selectedTask.task_id
    })
  }

  onHourSelect(idx,value){
    // let selectedHour = hrs[idx];
    // console.log("Selected project: "+selectedHour.label);
    // console.log("selected project id: "+selectedHour.key);
    this.setState({
      textHrsValue: value,
    })
  }

  onMinSelect(idx,value){
    // let selectedMin = min[idx];
    // console.log("Selected project: "+selectedMin.label);
    // console.log("selected project id: "+selectedMin.key);
    this.setState({
      textMinValue: value,
    })
  }
  /* End: Modal Dropdown methods*/


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
          passProps: {auth: this.props.auth}
        },
       ]);
    }

    inbox(){
      this.props.navigator.replace({
        route: 'inbox',
        passProps: {auth: this.props.auth}
      });
    }

    marketing(){
      this.props.navigator.replace({
        route: 'marketing/recent-posts',
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

    var dateView = this.state.date.toString();

    console.log("This state = "+ JSON.stringify(this.state.projName));
    /*  Model Picker  */
    let index = 0;
    const hrs = [{ key: index++, label: 0 },{ key: index++, label: 1 },{ key: index++, label: 2 },{ key: index++, label: 3 },{ key: index++, label: 4 },{ key: index++, label: 5 },{ key: index++, label: 6 },
      { key: index++, label: 7 },{ key: index++, label: 8 },{ key: index++, label: 9 },{ key: index++, label: 10 },{ key: index++, label: 11 },{ key: index++, label: 12 },{ key: index++, label: 13 },
      { key: index++, label: 14 },{ key: index++, label: 15 },{ key: index++, label: 16 },{ key: index++, label: 17 },{ key: index++, label: 18 },{ key: index++, label: 19 },{ key: index++, label: 20 },
      { key: index++, label: 21 },{ key: index++, label: 22 },{ key: index++, label: 23 },{ key: index++, label: 24 }
    ];

    const min = [{ key: index++, label: 0 },{ key: index++, label: 15 },{ key: index++, label: 30 },{ key: index++, label: 45 }];

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
        <ScrollView keyboardShouldPersistTaps={false} horizontal={true}>
        <View style={{flexDirection: 'column', height: (0.65 * deviceHeight), margin: 10}}>
          <View style={{paddingTop: (deviceWidth >= 768 ? 20 : 5), flexDirection: 'row'}}>
            <Text style={styles.text}>
              Project Name<Text style={{color: 'red'}}>*       </Text>
            </Text>
            <ModalPicker
               data={this.state.projName}
               initValue={this.state.textInputValue}
               optionTextStyle= {styles.text}
               onChange={(option)=>{ this.setState({textInputValue:option.label, textInputId:option.project_id})}}>
               <Text
                   style={styles.pickerText}>
                   {this.state.textInputValue}
               </Text>
            </ModalPicker>
          </View>


          <View style={{paddingTop: 20, flexDirection: 'row'}}>
            <View style={{marginTop:10}}>
              <Text style={styles.text}>
                Task Type<Text style={{color: 'red'}}>*              </Text>
              </Text>
            </View>

            <ModalPicker
                data={this.state.taskType}
                initValue={this.state.taskInputValue}
                optionTextStyle= {styles.text}
                onChange={(option)=>{ this.setState({taskInputValue:option.label, taskInputId:option.task_id})}}>
                <Text
                    style={styles.pickerText}>
                    {this.state.taskInputValue}
                </Text>
            </ModalPicker>
          </View>
          <View style={{paddingTop:20, flexDirection: 'row'}}>
            <Text style={styles.text}>
              Date<Text style={{color: 'red'}}>*               </Text>
            </Text>
            <DatePicker style={{width: (deviceWidth >= 768 ? 250 : 200), marginLeft: (deviceWidth >= 768 ? 25 : 15)}}  date={this.state.todayDate}  mode="date" placeholder="select date"  confirmBtnText="Confirm"  cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                },
                dateInput: {
                  marginLeft: 36,
                  backgroundColor: '#fff',
                  borderColor: '#48BBEC',
                  borderWidth: 1,
                  borderRadius: 8,
                  justifyContent: 'center',
                }
              }}
              onDateChange={(date) => {this.setState({todayDate: date})}}
            />
          </View>
          <View style={{paddingTop:20, flexDirection: 'row'}}>
            <View style={{marginTop:10}}>
              <Text style={styles.text}>
                No.of Hours<Text style={{color: 'red'}}>*          </Text>
              </Text>
            </View>
            <ModalPicker
                data={hrs}
                initValue={this.state.textHrsValue.toString()}
                optionTextStyle= {styles.text}
                onChange={(option)=>{ this.setState({textHrsValue:option.label})}}>
                <Text
                    style={styles.pickerText}>
                    {this.state.textHrsValue}
                </Text>
            </ModalPicker>
            <ModalPicker
                data={min}
                initValue={this.state.textMinValue.toString()}
                optionTextStyle= {styles.text}
                onChange={(option)=>{ this.setState({textMinValue:option.label})}}>
                <Text
                    style={styles.pickerText}>
                    {this.state.textMinValue}
                </Text>
            </ModalPicker>
          </View>

          <View style={{paddingTop:20, flexDirection: 'row'}}>
            <Text style={styles.text}>
              Task Description<Text style={{color: 'red'}}>*</Text>
            </Text>
            <TextInput
                style={{ marginLeft: 14, width: deviceWidth/3, height:100, fontSize:14, backgroundColor: '#fff', borderColor: '#48BBEC', borderWidth: 1, borderRadius: 8, padding: 4}}
                editable={true}
                multiline={true}
                placeholder="Please enter your task details..."
                value={this.state.textFieldValue.toString()}
                onChangeText={ this.textChange.bind(this) }
                underlineColorAndroid='transparent'
                 />
          </View>
          <View style={{paddingTop:(deviceWidth >= 768 ? 35 : 20), flexDirection: 'row', padding: deviceWidth/5}}>
            <TouchableHighlight style={styles.button} onPress={this.onSubmit.bind(this)} underlayColor='#99d9f4'>
              <Text style={{fontSize: (deviceWidth >= 768 ? 20 : 16), margin: 5}}> Submit </Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button} onPress={this.onReset.bind(this)} underlayColor='#99d9f4'>
              <Text style={{fontSize: (deviceWidth >= 768 ? 20 : 16), margin: 5}}> Reset </Text>
            </TouchableHighlight>
          </View>
        </View>
        </ScrollView>

      </View>
      </SideMenu>

    );
  }
}
