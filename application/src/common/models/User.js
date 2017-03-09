import {observable} from 'mobx'

class User {
  @observable info = {
    full_name: '',
    email: '',
    image: '',
    deviceToken: '',
  }

  @observable badgeCount: 0;
  @observable candidateBadgeCount:0;

  setInfo(name='', email='', image=''){
    this.info = ({
      full_name: name,
      email: email,
      image: image
    })
  }

  getInfo(){
    return this.info;
  }

  setDeviceToken(token){
    this.deviceToken = token;
  }

  getDeviceToken(){
    return this.deviceToken;
  }
  setBadgeCount(count){
    this.badgeCount=count;

  }
  getBadgeCount(){
    return this.badgeCount;
  }
  setCandBadgeCount(count){
    this.candidateBadgeCount=count
  }
  getCandBadgeCount(){
    return this.candidateBadgeCount;
  }

}

const user = new User();

export default user
