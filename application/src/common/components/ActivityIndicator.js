import React, { Component } from 'react';
import {
   ActivityIndicator,
   View,
   StyleSheet
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

export default ActivityIndicatorExample = (props) => {
   return (
      <View style = {styles.container}>
         <ActivityIndicator animating = {props.animating}
           style = {styles.activityIndicator} size = "large"
         />
      </View>
   );
}

const styles = EStyleSheet.create ({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   activityIndicator: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 80
   }
});
