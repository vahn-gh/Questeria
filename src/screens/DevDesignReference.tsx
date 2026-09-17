import { Pressable, ScrollView, Text, View } from 'react-native'

import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native-unistyles'

import { ScreenProps } from 'shared/navigation/types/NavigationParams'
import { Screens } from 'shared/navigation/types/Screens'
import {
  CoffeeThemeColors,
  HackerThemeColors,
  CuteThemeColors,
} from 'shared/theme/colors'
import { CommonStyles } from 'shared/theme/commonStyles'

type Props = ScreenProps<Screens.DevDesignReference>

const themes = [
  { name: 'CuteTheme', colors: CuteThemeColors },
  { name: 'HackerTheme', colors: HackerThemeColors },
  { name: 'CoffeeTheme', colors: CoffeeThemeColors },
]

export const DevDesignReference: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={CommonStyles.flex1}>
      <Pressable style={ss.backButton} onPress={() => navigation.goBack()}>
        <Text style={ss.backButtonText}>← Back</Text>
      </Pressable>

      <ScrollView contentContainerStyle={ss.content}>
        {themes.map(theme => (
          <View key={theme.name} style={CommonStyles.gap12}>
            <Text style={ss.sectionTitle}>{theme.name}</Text>
            <View style={ss.grid}>
              {Object.entries(theme.colors).map(([name, hex]) => (
                <View key={name} style={ss.swatch}>
                  <View style={[ss.square, { backgroundColor: hex }]} />
                  <Text style={ss.label}>{name}</Text>
                  <Text style={ss.label}>{hex}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const ss = StyleSheet.create({
  backButton: CommonStyles.merge([CommonStyles.ph16, CommonStyles.pv12]),
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: CommonStyles.merge([CommonStyles.p16, CommonStyles.gap24]),
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  grid: CommonStyles.merge([
    CommonStyles.row,
    CommonStyles.gap12,
    {
      flexWrap: 'wrap',
    },
  ]),
  swatch: CommonStyles.merge([
    CommonStyles.center,
    CommonStyles.gap4,
    {
      width: 90,
    },
  ]),
  square: {
    width: 72,
    height: 72,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00000022',
  },
  label: {
    fontSize: 11,
    textAlign: 'center',
  },
})
