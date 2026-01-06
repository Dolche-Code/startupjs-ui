import { use } from 'react'

let momentPromise: any

const loadMoment = (): Promise<any> => { // eslint-disable-line @typescript-eslint/promise-function-async
  if (!momentPromise) momentPromise = import('moment-timezone').then(m => m.default)
  return momentPromise
}

export default function useMoment () {
  return use(loadMoment())
}
