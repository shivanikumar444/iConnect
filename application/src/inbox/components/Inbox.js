import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  Image,
  ListView,
  AsyncStorage,
  Alert,
  Dimensions
} from 'react-native';
import { SideMenu, List, ListItem } from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import CustomCell from '../../common/components/CustomCell';
import ActivityIndicator from '../../common/components/ActivityIndicator';
import Header from '../../common/components/Header';

// import CookieManager from 'react-native-cookies';

/*
    displays a list view inbox contents

*/

var widthScreen = Dimensions.get('window').width;
var heightScreen = Dimensions.get('window').height;

export default class  Test extends Component {
  JIVE_API_URI = '';
  constructor(props) {
    super(props);
    this.JIVE_API_URI = this.props.config.JIVE_API_URI;
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(['row 1', 'row 2']),
      loading: true,
      error: null,
      /* SideMenu */
      isOpen: false,
    };
    this.toggleSideMenu = this.toggleSideMenu.bind(this);
  }

  componentDidMount(){
    fetch(this.JIVE_API_URI+'inbox',{
      method: 'GET',
      headers: {
         'Authorization': this.props.auth.toString()
      },
    })
    .then((response) => response.json())
    .then((jsonResponse) => {
      console.log(JSON.stringify(jsonResponse));
      let data = [];
      if (jsonResponse.list.length < 12) {
        data = jsonResponse.list;
        for (var i = jsonResponse.list.length; i < 12; i++) {
          data.push({
              name: '',
              date: '',
              title: '',
              icon: '',
              actor: 'actor'
          });
        }
      }else {
        data = jsonResponse.list;
      }
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(data),
        loading: false
      });
    })
    .catch((error) => {
      this.setState({
        loadin: false,
        error: error
      })
      console.warn(error);
    });

    AsyncStorage.getItem('JiveUserDetails').then((value) => {
      var userData = JSON.parse(value);
      this.setState({
        usrName: userData.displayName,
        usrAvatar: userData.thumbnailUrl,
        designation: userData.jive.profile[0].value
      });
    }).done();
  }
  componentWillUnmount(){
    this.setState({
      dataSource: null,
      loading: null,
      error: null
    });
  }

  toggleSideMenu () {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  rowPressed(rowData) {
    console.log("Row Data ----"+ JSON.stringify(rowData));
    if (rowData.icon != '') {
      this.props.navigator.push({
        route: 'post-view',
        passProps: {auth: this.props.auth, uri: rowData.object.url, usrName: this.state.usrName, usrAvatar: this.state.usrAvatar, designation: this.state.designation, title: 'Inbox'}
      });
    }
  }

  getNotifications(){
    this.props.navigator.push({route: 'notifications'});
  }

  renderCells(rowData){
    if(!this.state.error){
      if(!rowData.actor){
        return <View />;
      }else if (rowData.actor == 'actor') {
        return (
          <TouchableHighlight onPress={() => this.rowPressed(rowData)}
                underlayColor='#dddddd'>
            <View>
              <CustomCell icon={''} name={''} date={''} header={''} />
              <View style={styles.separator}/>
            </View>
          </TouchableHighlight>
        );
      }
      var name = rowData.actor.displayName;
      var date = rowData.actor.updated.split('T')
      var title = rowData.title;
      var icon = rowData.actor.image.url;
      return(
        <TouchableHighlight onPress={() => this.rowPressed(rowData)}
              underlayColor='#dddddd'>
          <View>
            <CustomCell icon={icon} name={name} date={date[0]} header={title} />
            <View style={styles.separator}/>
          </View>
        </TouchableHighlight>
      );
    }
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

    if(this.state.loading){
      return(
        <View style={styles.container}>
          <Header navigator={this.props.navigator} title={'Inbox'} />
          <View style={styles.separator}/>
          <ActivityIndicator animating = {this.state.loading} />
        </View>
      );
    }
    if(this.state.error){
      return(
        <SideMenu
        isOpen={this.state.isOpen}
        menu={MenuComponent}>
        <View style={styles.errorContainer}>
          <Header navigator={this.props.navigator} title={'Inbox'} />
          <View style={styles.separator}/>
          <Text style={styles.error}>Something went wrong please try after some time </Text>
        </View>
        </SideMenu>
      );
    }
    return (
      <SideMenu
      isOpen={this.state.isOpen}
      menu={MenuComponent}>
      <View style={styles.container}>
        <Header navigator={this.props.navigator} title={'Inbox'} />
        <View style={styles.separator}/>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderCells.bind(this)}
          pageSize={10}
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
  errorContainer:{
    flex: 1,
    top: '3%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  error:{
    fontSize: 16
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
