import { axios, BASE_URL } from 'startupjs'
import alert from '@startupjs-ui/dialogs/alert'
import { getDeleteFileUrl } from './constants.js'

export default async function deleteFile (fileId?: string): Promise<boolean | undefined> {
  if (!fileId) return
  try {
    const res = await axios.post(BASE_URL + getDeleteFileUrl(fileId))
    fileId = res.data?.fileId
    if (!fileId) throw Error('File delete failed. No deleted fileId returned from server')
    return true
  } catch (err) {
    console.error(err)
    await alert('Error deleting file')
  }
}
