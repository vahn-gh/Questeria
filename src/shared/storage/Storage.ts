import { Configuration, createMMKV, MMKV } from 'react-native-mmkv'

import { ErrorAPI } from 'shared/error/ErrorAPI'

export abstract class AbstractMMKV {
  abstract getString<T extends string>(key: string): T | undefined
  abstract set(
    key: string,
    value: boolean | string | number | ArrayBuffer
  ): void
  abstract getBoolean(key: string): boolean | undefined
  abstract getNumber(key: string): number | undefined
  abstract getAllKeys(): string[]
  abstract delete(key: string): void
  abstract contains(key: string): boolean
  abstract clearAll(): void
  abstract addOnValueChangedListener(
    onValueChanged: (key: string) => void
  ): ReturnType<MMKV['addOnValueChangedListener']>
  abstract getObj<T extends object>(name: string): T | undefined
  abstract setObj<T extends object>(name: string, obj: T): void
}

class ExtendedMMKV extends AbstractMMKV {
  constructor(private mmkvInstance: MMKV) {
    super()
  }

  getString<T extends string>(key: string): T | undefined {
    return this.mmkvInstance.getString(key) as T | undefined
  }
  set(key: string, value: boolean | string | number | ArrayBuffer) {
    return this.mmkvInstance.set(key, value)
  }
  getBoolean(key: string): boolean | undefined {
    return this.mmkvInstance.getBoolean(key)
  }
  getNumber(key: string): number | undefined {
    return this.mmkvInstance.getNumber(key)
  }
  getAllKeys(): string[] {
    return this.mmkvInstance.getAllKeys()
  }
  delete(key: string) {
    return this.mmkvInstance.remove(key)
  }
  contains(key: string): boolean {
    return this.mmkvInstance.contains(key)
  }
  clearAll(): void {
    return this.mmkvInstance.clearAll()
  }
  addOnValueChangedListener(
    onValueChanged: (key: string) => void
  ): ReturnType<MMKV['addOnValueChangedListener']> {
    return this.mmkvInstance.addOnValueChangedListener(onValueChanged)
  }

  getObj<T extends object>(name: string): T | undefined {
    try {
      const response = this.getString(name)
      return response !== undefined ? JSON.parse(response) : undefined
    } catch (err) {
      ErrorAPI.show(err)
      throw err
    }
  }

  setObj<T extends object>(name: string, obj: T) {
    try {
      this.set(name, JSON.stringify(obj))
    } catch (err) {
      ErrorAPI.show(err)
      throw err
    }
  }
}

export const createMMKVStorage = (params: Configuration) =>
  new ExtendedMMKV(createMMKV(params))

export const AppStorage = createMMKVStorage({
  id: 'mmkv.app',
})
