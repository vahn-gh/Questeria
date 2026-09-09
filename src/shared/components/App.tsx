import { useEffect, useState } from 'react'

import {
  Button,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native'

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

import { NeedsAdapter } from 'shared/adapters/NeedsAdapter'
import { seedProgressStorage } from 'shared/storage/seedNeeds'
import { ProgressStorage } from 'shared/storage/Storage'
import { Need } from 'shared/types/Need'

import { Toast } from './Toast'

function App() {
  const isDarkMode = useColorScheme() === 'dark'

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
      <Toast
        ref={c => {
          if (c) {
            Toast.instance = c
          }
        }}
      />
    </SafeAreaProvider>
  )
}

function AppContent() {
  const [needs, setNeeds] = useState<Need[]>([])

  useEffect(() => {
    seedProgressStorage()

    const data = NeedsAdapter.transformData(
      ProgressStorage.getAllKeys(),
      ProgressStorage
    )
    setNeeds(data)
  }, [])

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        {needs.map(need => (
          <View key={need.id} style={styles.row}>
            <Text>{need.label}</Text>
            <Text>{need.percentage}%</Text>
          </View>
        ))}
      </ScrollView>
      <Button
        title="Toast"
        onPress={() =>
          Toast.showInfo('Something broke (＃＞＜)\nPlease try again ( ; ω ; )')
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

export default App
