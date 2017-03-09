import {Platform} from 'react-native';
import {observable} from 'mobx'

class Network {
  @observable networkState = "";

  setNetworkState(state=''){
    this.networkState = state
  }

  getNetworkState(){
    if (Platform.OS === 'ios') {
      if (this.networkState == "wifi" || this.networkState == "cell") {
        return true;
      }else {
        return false;
      }
    }else {
      if (this.networkState == "ETHERNET" || this.networkState == "MOBILE" || this.networkState == "WIFI" || this.networkState == "WIMAX") {
        return true;
      }else {
        return false;
      }
    }
  }
}

const networkState = new Network();

export default networkState
