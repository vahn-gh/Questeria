import React, { Component } from 'react'

import { OPEN_DURATION } from './constants'
import { ToastCardData, ToastCard, ToastType } from './ToastCard'

interface State {
  message?: ToastCardData
}

export class Toast extends Component<unknown, State> {
  constructor(props: unknown) {
    super(props)
    this.state = {}
  }

  static instance: Toast
  private timeout: ReturnType<typeof setTimeout> | undefined = undefined

  static showInfo(text: ToastCardData['text']) {
    this.instance.handleShowMessage({
      type: ToastType.Info,
      text,
    })
  }

  private handleShowMessage(message: ToastCardData) {
    this.setState(prevState => {
      if (prevState.message !== message) {
        return {
          message,
        }
      }

      return prevState
    }, this.setTimer)
  }

  private closeMessage() {
    clearTimeout(this.timeout)

    this.setState({
      message: undefined,
    })
  }

  private closeCurrentMessage = () => {
    if (this.state.message) {
      this.closeMessage()
    }
  }

  private setTimer() {
    clearTimeout(this.timeout)

    this.timeout = setTimeout(() => {
      this.closeMessage()
    }, OPEN_DURATION)
  }

  render() {
    if (this.state.message) {
      return (
        <ToastCard
          data={this.state.message}
          onClose={this.closeCurrentMessage}
        />
      )
    }

    return null
  }
}
