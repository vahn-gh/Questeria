import { AxiosError, isAxiosError } from 'axios'

import { Toast } from 'shared/components/Toast'

import { ERROR_MESSAGES } from './constants'
import {
  SERVER_ERROR_STATUS,
  SERVER_ERRORS,
  ServerError,
  ServerErrorResponse,
} from './ServerError'

export type InputErrorType = Error | string | undefined | null | unknown

interface ParsedError {
  name?: ServerError
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

  static log(error: InputErrorType) {
    const parsedError = ErrorAPI.parseError(error)

    console.warn(parsedError.message)
  }

  private static parseError(
    error: InputErrorType,
    options?: ErrorParseOptions
  ): ParsedError {
    const fallbackMessage =
      options?.fallbackMessage || ERROR_MESSAGES.DEFAULT_MESSAGE

    if (isAxiosError(error)) {
      const body = error.response?.data

      if (ErrorAPI.isServerErrorValid(body)) {
        return {
          name: body.name,
          message: body.message || fallbackMessage,
        }
      }

      return {
        name: ErrorAPI.parseServerError(error),
        message: fallbackMessage,
      }
    } else if (typeof error === 'object' && error instanceof Error) {
      return {
        message: error.message || fallbackMessage,
      }
    } else if (typeof error === 'string') {
      return {
        message: error,
      }
    }

    return {
      message: fallbackMessage,
    }
  }

  private static isServerErrorValid(
    data: unknown
  ): data is ServerErrorResponse {
    return (
      typeof data === 'object' &&
      data !== null &&
      'name' in data &&
      SERVER_ERRORS.includes(data.name)
    )
  }

  private static parseServerError(error: AxiosError): ServerError {
    if (!error.response) {
      return error.code === AxiosError.ECONNABORTED ||
        error.code === AxiosError.ETIMEDOUT
        ? ServerError.Timeout
        : ServerError.Network
    }

    if (error.response.status >= SERVER_ERROR_STATUS) {
      return ServerError.Server
    }

    return ServerError.Unknown
  }
}
