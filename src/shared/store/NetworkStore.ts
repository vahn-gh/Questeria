import NetInfo from '@react-native-community/netinfo'
import { makeObservable, observable, runInAction } from 'mobx'
import { container, singleton } from 'tsyringe'

@singleton()
export class NetworkStore {
  isOnline = true

  constructor() {
    makeObservable(this, {
      isOnline: observable,
    })
  }

  start() {
    NetInfo.addEventListener(netState => {
      runInAction(() => {
        this.isOnline = netState.isConnected !== false
      })
    })
  }
}

export const useNetworkStore = () => container.resolve(NetworkStore)
