import React, { Component } from 'react';
import { Platform, StyleSheet, Image, View, TouchableHighlight, ListView, Text, TouchableOpacity, Dimensions, ScrollView, Picker, PickerItem, DatePickerIOS, TextInput, Animated, AsyncStorage, Alert } from 'react-native';
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
    fontSize: 18,
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
  pickerText:{
   fontSize: 18,
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
  buttonTxt: {
    fontSize: 18,
    // color: 'white',
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
  button: {
    margin: 10,
    width: 100,
    height: 36,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center',
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
  dropdown_6: {
    flex: 1,
    left: 8,
    margin: 5,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    width: deviceWidth/2.2,

  },
  cell: {
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
  separator: {
    height: 1,
    backgroundColor: '#E8E8E8'
  },
  overlay:{
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  activity:{
    position: 'absolute',
    top: "35%",
    left: "45%",
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


var picker = {zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9};

export default class DayLogList extends Component {
  TIME_TRACK_BASE_URI = '';

  constructor(props) {
        super(props);
        this.TIME_TRACK_BASE_URI = this.props.config.TIME_TRACK_BASE_URI;
        this.state = {
          date: date,
          textInputValue: 'Select Project',
          toDate: new Date(),
          fromDate: new Date(),
          textHrsValue: '',
          textFieldValue: '',
          projName: [],
          /* ActivityIndicator */
          overlayState: "",
          animating: false,
          /* SideMenu */
          isOpen: false,
        };
        this.toggleSideMenu = this.toggleSideMenu.bind(this);
    }

    componentDidMount() {

      AsyncStorage.getItem('entryDetails').then((value) => {
        console.log("Results entryDetails = "+value);
        this.setState({timeTrackerData: value});
      }).done();
      // this.forceUpdate();

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

      AsyncStorage.getItem('UserLoginData').then((value) => {
        console.log("Results UserLoginData = "+value);
        this.setState({login_user_id: JSON.parse(value)[0].login_user_id});
        console.log("login_user_id = " + this.state.login_user_id);
      }).done();

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

    overlay(){
      if (this.state.overlayState == "true") {
        return (<View style={styles.overlay}>
        </View>);
      }
      return (<View/>);
    }

    getNotifications(){
      this.props.navigator.push({route: 'notifications'});
    }

    getDateFormat(date){
      console.log(date.toString().match(/IST/g));
      console.log("test"+"date".toString().match(/IST/g));
      if (date.toString().match(/IST/g) == null || date.toString().match(/IST/g) == undefined) {
        if (date.toString().match(/-/g)) {
          return date;
        }else {
          return null;
        }
      }else {
        return [ date.getFullYear(),(date.getMonth()+1),date.getDate()].join('-');
      }
    }
  //  Submit Button Press
  onSubmit() {
    console.log("data = "+this.state.fromDate + " "+ this.state.toDate+ " "+ this.state.textInputId + " "+ this.state.login_user_id);
    // console.log("Date ="+ [ this.state.fromDate.getFullYear(),(this.state.fromDate.getMonth()+1),this.state.fromDate.getDate()].join('-'));
    var url = {
         mode: "btwDates",
          entryObj: {
          startDate: this.getDateFormat(this.state.fromDate),
          endDate: this.getDateFormat(this.state.toDate),
          project_id: this.state.textInputId,
          user_id: this.state.login_user_id,
        }
    };
    if (this.state.textInputId == undefined || this.state.textInputId == "" || this.state.textInputId == null) {
      alert("Please select the Project details");
    }else if (this.getDateFormat(this.state.fromDate) == null) {
      alert("Please select From Date");
    }else if (this.getDateFormat(this.state.toDate) == null) {
      alert("Please select To Date");
    }else {
      this.setState({animating: true, overlayState: "true"});

      fetch(this.TIME_TRACK_BASE_URI+'manageEntry.php', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(url)
      })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(" Teesting");
        console.log(responseData);
        if (responseData.success != '0') {
          this.setState({timeTrackerData: JSON.stringify(responseData.entryDetails)});
          AsyncStorage.setItem('entryDetails', JSON.stringify(responseData.entryDetails));
          AsyncStorage.getItem('entryDetails').then((value) => {
            console.log("Results entryDetails = "+value);
            // this.setState({timeTrackerData: value});
          }).done();
          console.log("DATA = "+ this.state.timeTrackerData);
          this.setState({animating: false, overlayState: ""});

          this.props.navigator.push({
            route: 'day-list',
            title: 'Day List',
            passProps: {auth: this.props.auth, listData: JSON.parse(this.state.timeTrackerData)}
          });
        }else {
          alert("Enter all the fields" );
          this.setState({animating: false, overlayState: ""});
        }
      })
      .catch((error) => {
        console.warn(error);
        this.setState({animating: false, overlayState: ""});
      })
      .done();

      // console.log("DATA = "+ this.state.timeTrackerData);
      // this.props.navigator.push({
      //   route: 'day-list',
      //   title: 'Day List',
      //   passProps: {auth: this.props.auth, listData: JSON.parse(this.state.timeTrackerData)}
      // });
    }
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

  state = {
    selected1: 'key1',
    selected2: 'key1',
    selected3: 'key1',
    color: 'red',
    mode: Picker.MODE_DIALOG,
  };

  _dropdown_6_onSelect(idx, value) {
    console.log("Dropdown 6 = "+ idx + value);
    let selectedProject = this.state.projName[idx];
    console.log("Selected project: "+selectedProject.label);
    console.log("selected project id: "+selectedProject.project_id);

    this.setState({
      textInputValue: value,
      textInputId: selectedProject.project_id
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

/*PickerView*/
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
    const data = [
        { key: index++, section: true, label: 'Fruits' },
        { key: index++, label: 'Red Apples' },
        { key: index++, label: 'Cherries' },
        { key: index++, label: 'Cranberries' },
        { key: index++, label: 'Pink Grapefruit' },
        { key: index++, label: 'Raspberries' },
        { key: index++, section: true, label: 'Vegetables' },
        { key: index++, label: 'Beets' },
        { key: index++, label: 'Red Peppers' },
        { key: index++, label: 'Radishes' },
        { key: index++, label: 'Radicchio' },
        { key: index++, label: 'Red Onions' },
        { key: index++, label: 'Red Potatoes' },
        { key: index++, label: 'Rhubarb' },
        { key: index++, label: 'Tomatoes' }
    ];
    const hrs = [
      { key: index++, label: 0 },
      { key: index++, label: 1 },
      { key: index++, label: 2 },
      { key: index++, label: 3 },
      { key: index++, label: 4 },
      { key: index++, label: 5 },
      { key: index++, label: 6 },
      { key: index++, label: 7 },
      { key: index++, label: 8 },
      { key: index++, label: 9 },
    ];

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
        <View style={{flexDirection: 'column', height: (0.65 * deviceHeight), margin: 20}}>

          <View style={{paddingTop: 20, flexDirection: 'row'}}>
            <Text style={styles.text}>
              Project Name<Text style={{color: 'red'}}>*        </Text>
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

          <View style={{paddingTop:20, flexDirection: 'row'}}>
            <Text style={styles.text}>
              From Date<Text style={{color: 'red'}}>*     </Text>
            </Text>
            <DatePicker style={{width: 200, marginLeft: 13}}  date={this.state.fromDate}  mode="date" placeholder="select date" format="YYYY-MM-DD" confirmBtnText="Confirm"  cancelBtnText="Cancel"
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
              onDateChange={(date) => {this.setState({fromDate: date})}}
            />
          </View>

          <View style={{paddingTop:20, flexDirection: 'row'}}>
            <Text style={styles.text}>
              To Date<Text style={{color: 'red'}}>*          </Text>
            </Text>
            <DatePicker style={{width: 200, marginLeft: 15}}  date={this.state.toDate}  mode="date" placeholder="select date" format="YYYY-MM-DD" confirmBtnText="Confirm"  cancelBtnText="Cancel"
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
              onDateChange={(date) => {this.setState({toDate: date})}}
            />
          </View>
          <View style={styles.activity}>
            <ActivityIndicator
              animating = {this.state.animating}/>
          </View>
          <View style={{paddingTop:30, flexDirection: 'row', padding: deviceWidth/4}}>
            <TouchableHighlight style={styles.button} onPress={this.onSubmit.bind(this)} underlayColor='#99d9f4'>
              <Text style={{fontSize: 16, margin: 5}}> Go </Text>
            </TouchableHighlight>
          </View>
        </View>
        </ScrollView>

        {this.overlay()}
      </View>
      </SideMenu>
    );
  }
}
