import NetInfo from '@react-native-community/netinfo'
import { action, makeObservable, observable } from 'mobx'
import { container, singleton } from 'tsyringe'

@singleton()
export class NetworkStore {
  isOnline = true

  constructor() {
    makeObservable<this, 'setOnline'>(this, {
      isOnline: observable,
      setOnline: action,
    })
  }

  start() {
    NetInfo.addEventListener(netState => {
      this.setOnline(netState.isConnected !== false)
    })
  }

  private setOnline(isOnline: boolean) {
    this.isOnline = isOnline
  }
}

export const useNetworkStore = () => container.resolve(NetworkStore)
