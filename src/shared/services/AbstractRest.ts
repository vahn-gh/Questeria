import axios from 'axios'

import { API_TIMEOUT } from 'shared/error/constants'

export const API_URL = 'https://questeria.vercel.com/api/'
export const Api = axios.create({ baseURL: API_URL, timeout: API_TIMEOUT })

export abstract class AbstractRest {
  readonly api = Api
}
