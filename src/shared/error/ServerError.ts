export enum ServerError {
  Network = 'Network',
  Timeout = 'Timeout',
  Server = 'Server',
  Unknown = 'Unknown',
}

export interface ServerErrorResponse {
  name: ServerError
  message?: string
}

export const SERVER_ERRORS: unknown[] = Object.values(ServerError)
export const SERVER_ERROR_STATUS = 500
