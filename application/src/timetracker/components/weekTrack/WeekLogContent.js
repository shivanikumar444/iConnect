import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  ScrollView
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default class WeekLogContent extends Component {

  constructor(props){
    super(props);
    let totalHours = 0;
    for(i=0;i<this.props.weekLog.length;i++){
      let hours = this.props.weekLog[i].hours != '' ? parseInt(this.props.weekLog[i].hours) : 0 ;
      totalHours += hours;
    }
    this.state = {
      weekLog : props.weekLog,
      totalLoggedHours: totalHours,
      warning: false
    }
  }

  rearrangeDate(date){
    let splitedDate = date.split('-');
    if(splitedDate.length>2){
      return splitedDate[2] + '-' + splitedDate[1] + '-' + splitedDate[0];
    }
    else{
      return date;
    }
  }

  updateLogData(index, text) {
    let logs = this.state.weekLog;
    let totalHours = 0;
    let num = text != '' ? parseInt(text) : 0;
    let status = num > 23 || num < 0
    logs[index].hours = text;
    for(i=0;i<logs.length;i++){
      let hours = logs[i].hours != '' ? parseInt(logs[i].hours) : 0 ;
      totalHours += hours;
    }

    this.props.updateCallBack(logs[index], text);

    this.setState({
      weekLog: logs,
      totalLoggedHours: totalHours,
      warning: status || totalHours > 40
    });
  }

  getTotalHours(){
    return(
      <View style={styles.hoursIndicator}>
        {
          <Text style={styles.loggedHours}>Your total Logged hours are: {this.state.totalLoggedHours} </Text>
        }
      </View>
    )
  }

  getWarnings(){
    if(this.state.warning){
      return(
        <View style={styles.warningIdicator}>
          <Text style={styles.warning}>Please check the logged hours, hours should in between 0 to 23</Text>
        </View>
      )
    }
  }

  render(){
      return(
        <ScrollView keyboardShouldPersistTaps={false}>
        <View style={styles.weekWrapper}>
            {
              this.state.weekLog.map((item, index) => {
                return(
                  <View style={styles.dayTimeWrapper} key = {index}>
                    <Text style={styles.dayName} key = {index+1}>{DAYS[index]}</Text>
                    <TextInput
                      style={styles.searchInput}
                      value={this.state.weekLog[index].hours}
                      autoCapitalize = 'none'
                      placeholder={this.rearrangeDate(this.state.weekLog[index].date)}
                      key = {index}
                      date = {this.state.weekLog[index].date}
                      onChangeText = {this.updateLogData.bind(this, index) }
                      underlineColorAndroid='transparent'
                      keyboardType = 'numeric'
                    />
                  </View>
                )
              })
            }
            <View style={styles.bottomContent}>
              <View style={styles.labels}>
                {this.getTotalHours()}
                {this.getWarnings()}
              </View>
            </View>
        </View>
        </ScrollView>
      );
  }

}

const styles = EStyleSheet.create({
  weekWrapper:{
    justifyContent: 'space-between',
    marginTop: '2%'
  },
  dayTimeWrapper:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: '2%'
  },
  dayName:{
    alignItems: 'flex-start',
    fontSize: 16,
    width: '25%',
    marginRight: '3%',
    fontWeight: 'bold',
    color: '#336EA3',
    marginLeft: '3%'
  },
  searchInput: {
    textAlign: "center",
    height: '5%',
    '@media android': {
      height: '7%'
    },
    width: '40%',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomContent:{
    marginTop: '2%',
    marginLeft: '20%',
  },
  labels: {
    marginBottom: '1%'
  },
  warning:{
    fontSize: 16,
    color: 'red'
  },
  loggedHours:{
    fontSize: 16,
    color: 'green'
  }
});
