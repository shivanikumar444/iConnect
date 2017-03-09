import React, { Component } from 'react'
import {observer} from 'mobx-react/native'
import {observable} from 'mobx'

class OverlayManager {

  @observable overlayState = {
    overlay: false,
    loading: false
  }

  setOverlayState(state){
    this.overlayState = state;
  }

  getOverlayState(){
    return this.overlayState;
  }
}

const overlayManager = new OverlayManager()

export default overlayManager
