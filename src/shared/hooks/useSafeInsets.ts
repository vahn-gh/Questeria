import { useMemo } from 'react'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { IS_ANDROID } from 'shared/constants/device'

// TODO: Replace with Styles.p
const SPACING_16 = 16

export const useSafeInsets = () => {
  const insets = useSafeAreaInsets()

  return useMemo(() => {
    const insetTop = insets.top + (IS_ANDROID ? SPACING_16 : 0)

    return {
      topInset: insetTop,
      bottomInset: Math.max(insets.bottom + SPACING_16, 26),
    }
  }, [insets.top, insets.bottom])
}
