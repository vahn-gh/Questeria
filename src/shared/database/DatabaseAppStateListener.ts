import { AppState } from 'react-native'

export class DatabaseAppStateListener {
  private appState = 'active'

  constructor(closeDatabaseConnection: () => void) {
    AppState.addEventListener('change', nextAppState => {
      if (
        this.appState === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        console.info(
          '[DB] App has gone to the background - closing connection.'
        )

        closeDatabaseConnection()
      }
      this.appState = nextAppState
    })
    console.info('[DB] Adding listener to handle app state changes')
  }
}
