import { useEffect, useState } from 'react'

import {
  Button,
  ScrollView,
  StatusBar,
  Text,
  useColorScheme,
  View,
} from 'react-native'

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native-unistyles'

import { NeedsAdapter } from 'shared/adapters/NeedsAdapter'
import { seedProgressStorage } from 'shared/storage/seedNeeds'
import { ProgressStorage } from 'shared/storage/Storage'
import { CommonStyles } from 'shared/theme/commonStyles'
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
      <ScrollView contentContainerStyle={[CommonStyles.p16, CommonStyles.gap8]}>
        {needs.map(need => (
          <View key={need.id} style={ss.row}>
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

const ss = StyleSheet.create({
  row: CommonStyles.merge([
    CommonStyles.row,
    {
      justifyContent: 'space-between',
    },
  ]),
})

export default App
