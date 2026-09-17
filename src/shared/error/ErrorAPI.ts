import { Toast } from 'shared/components/Toast'

import { ERROR_MESSAGES } from './constants'

export type InputErrorType = Error | string | undefined | null | unknown

interface ParsedError {
  message: string
}

interface ErrorParseOptions {
  fallbackMessage?: string
}

export class ErrorAPI {
  static show(error: InputErrorType) {
    const parsedError = ErrorAPI.parseError(error)

    Toast.showInfo(parsedError.message)

    console.error(parsedError.message)
  }

  private static parseError(
    error: InputErrorType,
    options?: ErrorParseOptions
  ): ParsedError {
    if (typeof error === 'object' && error instanceof Error) {
      return {
        message:
          error.message ||
          options?.fallbackMessage ||
          ERROR_MESSAGES.DEFAULT_MESSAGE,
      }
    } else if (typeof error === 'string') {
      return {
        message: error,
      }
    }

    return {
      message: options?.fallbackMessage || ERROR_MESSAGES.DEFAULT_MESSAGE,
    }
  }
}
