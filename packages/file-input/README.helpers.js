import { observer, pug, $, useSub } from 'startupjs'
import Avatar from '@startupjs-ui/avatar'

export const Photo = observer(({ fileId, name }) => {
  const $file = useSub($.files[fileId])
  let url
  try { url = $file.getUrl() } catch (err) {}
  return pug`
    Avatar(part='root' src=url)= name
  `
})
