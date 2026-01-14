import { Platform } from 'react-native'
import { axios, BASE_URL } from 'startupjs'
import alert from '@startupjs-ui/dialogs/alert'
import { getUploadFileUrl } from './constants.js'

const isWeb = Platform.OS === 'web'

export default async function uploadFile (asset: any, fileId?: string): Promise<string | undefined> {
  try {
    const formData = new FormData()
    const uri: string | undefined = asset?.uri
    if (!uri) throw Error('File upload failed. No asset.uri provided')
    let type = asset.mimeType
    const name = asset.name || asset.fileName || getFilenameFromUri(uri)
    if (!type) {
      if (asset.type === 'image') type = getImageMimeType(uri || asset.fileName || asset.name || '')
    }

    if (isWeb) {
      // on web we'll receive it as a uri blob
      const blob = await (await fetch(uri)).blob()
      formData.append('file', blob, name)
    } else {
      formData.append('file', {
        uri,
        name,
        type
      } as any)
    }
    const res = await axios.post(BASE_URL + getUploadFileUrl(fileId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    fileId = res.data?.fileId
    if (!fileId) throw Error('File upload failed. No fileId returned from server')
    console.log('Uploaded file:', fileId)
    return fileId
  } catch (err) {
    console.error(err)
    await alert('Error uploading file')
  }
}

function getFilenameFromUri (uri: string) {
  if (uri.length > 1000) return 'file' // if it's a base64 encoded uri
  return (uri.split(/[/\\]/).pop() ?? 'file').toLowerCase()
}

function getImageMimeType (filename: string) {
  // Extract the file extension from the filename
  const extension = (filename.split('.').pop() ?? '').toLowerCase()

  // Map of image extensions to MIME types
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    bmp: 'image/bmp',
    webp: 'image/webp',
    tiff: 'image/tiff',
    svg: 'image/svg+xml',
    ico: 'image/vnd.microsoft.icon',
    heic: 'image/heic',
    heif: 'image/heif',
    avif: 'image/avif'
  }

  // Return the corresponding MIME type or default to image/{extension}
  return mimeTypes[extension] || (extension ? `image/${extension}` : 'image')
}
