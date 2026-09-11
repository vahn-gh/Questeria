import React from 'react'

import { Modal, Text } from 'react-native'

import { RootNavigator } from '../navigation/RootNavigator'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props {}
interface State {
  open: boolean
}

export class ApplicationErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { open: false }
  }

  componentDidUpdate() {
    return true
  }

  componentDidCatch(error: Error) {
    console.error(error)

    this.setState({
      open: true,
    })
  }

  render() {
    return (
      <>
        <RootNavigator />

        <Modal visible={this.state.open}>
          <Text>Error</Text>
        </Modal>
      </>
    )
  }
}
