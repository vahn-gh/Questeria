import { SafeAreaView } from 'react-native-safe-area-context'

import { Typography } from 'shared/components/Typography'
import { ScreenProps } from 'shared/navigation/types/NavigationParams'
import { Screens } from 'shared/navigation/types/Screens'
import { CommonStyles } from 'shared/theme/commonStyles'

type Props = ScreenProps<Screens.QuestsScreen>

export const QuestsScreen: React.FC<Props> = () => {
  return (
    <SafeAreaView style={[CommonStyles.flex1, CommonStyles.ph12]}>
      <Typography type="p1_light">Progress</Typography>
    </SafeAreaView>
  )
}
