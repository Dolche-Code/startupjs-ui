import { useRef, useMemo } from 'react'
import { $ } from 'startupjs'
import useFormFields from './useFormFields'

export default function useFormFields$ (schema: any, options?: Record<string, any>): any {
  const firstRenderRef = useRef(true)
  const prevFieldsRef = useRef<any>(undefined)
  const fields = useFormFields(schema, options ?? {})
  const $fields = $(fields)

  const [firstRender, prevFields] = useMemo(() => {
    const firstRender = firstRenderRef.current
    firstRenderRef.current = false
    const prevFields = prevFieldsRef.current
    prevFieldsRef.current = fields
    return [firstRender, prevFields]
  }, [JSON.stringify(fields)]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!firstRender && prevFields !== fields) {
    $fields.set(fields)
  }

  return $fields
}
