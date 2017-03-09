import React, { Component } from 'react';
import{
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  Alert,
  AsyncStorage
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import HeaderImg from '../../assets/images/header.png';
import BackbuttonImg from '../../assets/images/back-btn-new.png';
import Logo from '../../assets/images/it_logo.png';
import LogoHome from '../../assets/images/menu-responsive.png';
import NotificationImg from '../../assets/images/chatbubble.png';
import TitleImg from '../../assets/images/iconnect-logo.png';

/*
    Creates Header with 10% actual width
    @param title(string) which will be actual title of the page, if not passed
      then ataches iConnect image as default header home page.
    @param navigator(object) with callback as a property, if not passed it won't
      create backbutton on the header.
    @param notification(object) with callback as a property, if not passed it won't
      create notification button on the header.

*/
export default class Header extends Component{
  constructor(props){
    super(props);
  }
  componentDidMount(){
    AsyncStorage.getItem('auth').then((value) => {
      console.log("Auth = " +value);
      this.setState({
        auth: value
      });
    });
  }

  getBackbutton(navigator){
    routes = navigator.getCurrentRoutes();
    if(routes.length > 1){
      return(
        <TouchableHighlight style={styles.backwrapper} onPress={() => navigator.pop()}>
          <Image source={BackbuttonImg} style={styles.backbtn} />
        </TouchableHighlight>
      );
    }
  }
  getLogo(navigator){
    routes = navigator.getCurrentRoutes();
    if(routes.length > 1){
      return(
        <Image source={Logo} style={styles.logo} />
      );
    }else {
      return(
        <Image source={LogoHome} style={styles.logoHome} />
      );
    }
  }

  onNotification(){
    this.props.navigator.push({
      route: 'notifications',
      passProps: {auth: this.state.auth}
    });
  }

  getTitle(title){
    if(title)
    {
      return(
        <Text style={styles.title}>{title}</Text>
      );
    }
    else{
      return(
        <Image source={TitleImg} style={styles.titleImg} />
      );
    }
  }

  getRightContent(navigator){
    routes = navigator.getCurrentRoutes();
    if(routes[routes.length-1].route == ("request" || "notifications")){
      return(
        <View/>
      );
    }else {
      return(
        <TouchableHighlight style={styles.notificationWrapper} onPress={this.onNotification.bind(this)}>
          <Image source={NotificationImg} style={styles.notification} />
        </TouchableHighlight>
      );
    }
  }

  render(){
    return (
          <View style={styles.container}>
              <View style={styles.headerContent}>
                <View style={styles.leftContent}>
                  {this.getBackbutton(this.props.navigator)}
                  {this.getLogo(this.props.navigator)}
                </View>
                <View style={styles.titleContent}>
                  {this.getTitle(this.props.title)}
                </View>
                <View style={styles.rightContent}>
                  {this.getRightContent(this.props.navigator)}
                </View>

              </View>
          </View>
        );
  }
}

const styles=EStyleSheet.create({
  container:{
      height: '10%',
      width: '$width',
      backgroundColor: '#f7f7f7'
    },
    headerimg:{
      width: '$width',
      height: '9%'
    },
    headerContent:{
      flexDirection:'row',
      alignItems: 'center'
    },
    titleContent:{
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: 1
    },
    title:{
        color:'#0099cc',
        fontSize: 28,
        textAlign:'center',
        height: '8%',
        paddingTop: '2%'
    },
    titleImg:{
      height: '8%',
      width: '50%'
    },
    backbtn:{
      width: '7%',
      height:'3%'
    },
    backwrapper:{
      justifyContent: 'center',
      alignItems: 'center'
    },
    leftContent:{
      width: '10%',
      marginLeft: '1%',
      flexDirection:'row',
    },
    logo:{
      height: '4%',
      width: '8%',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logoHome:{
      height: '4%',
      width: '12%',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    rightContent:{
      width: '10%',
      marginRight: '1%',
      justifyContent:'flex-end',
      alignItems:'flex-end'
    },
    notificationWrapper:{
      justifyContent: 'space-around',
      alignItems: 'center'
    },
    notification:{
      width: '10%',
      height: '5%'
    }

});
