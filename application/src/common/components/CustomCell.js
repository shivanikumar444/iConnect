import React, { Component ,PropTypes} from 'react';
import {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableHighlight
} from 'react-native';

export default class CustomCell extends Component{


  _renderText () {
    if (this.props.subtitle) {
      return (
        <View style={styles.smallContainer}>
        <Text style={styles.value,{paddingBottom:5, paddingTop: 2}}>
        {this.props.subtitle}
        </Text>
        </View>
      )
    }
  }
  _renderIcon () {
    if (this.props.image) {
      return (
        <View style={styles.smallContainer}>
          <Image
            style={styles.image}
            source={{uri: this.props.image}}
          />
        </View>
      )
    }
  }

  _imageRender(){
    if (this.props.icon == '') {
      return (
        <View />
      );
    }else {
      return (
        <Image
          style={styles.photo}
          defaultSource={require('../../assets/images/male-silhouette3.png')}
          source={{uri: this.props.icon}}/>
      );
    }
  }
  render() {
    return (
        <View style={styles.container}>
          <View style={styles.cellContainer}>
            <View style={styles.leftContainer}>
              <View style={styles.iconContainer}>
                {this._imageRender()}
              </View>
            </View>
            <View style={styles.rightContainer}>
              <View style={styles.textIconContainer}>
                <View style={styles.subtitleContainer}>
                  <Text style={styles.name,{paddingBottom: 0, paddingTop: 6,color:'dimgrey'}}>
                    {this.props.name}
                  </Text>
                  <Text style={styles.dateFont}>
                    {this.props.date}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.disclosureContainer}>
          <Text style={styles.title,{paddingBottom:5, paddingTop: 2,paddingLeft:4,paddingRight:5,}}>
          {this.props.header}
          </Text>
          {this._renderText ()}
          {this._renderIcon()}
        </View>
      </View>
    );
  }
}

{/*Hr.PropTypes = {
  name:PropTypes.string,
  date:PropTypes.string,
  title:PropTypes.string,
  subtitle: PropTypes.string,
  image: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      uri: PropTypes.string,
    }),
  ]),
  icon: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      uri: PropTypes.string,
    }),
  ]),
}*/}

const styles = {
  container:{
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f7f7'
  },
  cellContainer:{
      flexDirection: 'row',
      padding: 10
  },
  leftContainer: {
    minWidth: 15,
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  textIconContainer: {
   flexDirection: 'row',
 },
  name: {
   flex: 1,
   paddingTop: 12,
   paddingBottom: 12,
   fontSize: 16,
   flexWrap: 'wrap'
  },
  title:{
    flex: 1,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16,
    flexWrap: 'wrap'
  },

  photo: {
   height: 40,
   width: 40,
   borderRadius: 20,
 },
 separator: {
   height: 1,
   backgroundColor: '#dddddd'
 },
 iconContainer: {
    flex: 1,
    width: 59,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image:{
    height: 100,
    width: 100,
    paddingLeft:20,
  },
dateFont: {
  fontSize: 11,
  color: 'lightsteelblue',
  paddingBottom: 6,
},
subtitle:{
  fontSize: 11,
  color: 'lightsteelblue',
  paddingBottom: 6,
},
subtitleContainer: {
  flex: 1,
},
disclosureContainer: {
   minWidth: 30,
   flexDirection: 'column',
   justifyContent: 'center',
 },
 smallContainer:{
   minWidth: 30,
   flexDirection: 'column',
   justifyContent: 'center',
 },
 value: {
    fontSize: 14,
    color: '#808080',
    paddingLeft: 10,
    flexWrap: 'wrap'
  }
}
