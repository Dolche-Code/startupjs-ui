import { useMemo } from 'react'
import { pickFormFields } from 'startupjs'

export default function useFormFields (
  schema: any,
  options: Record<string, any> = {}
): Record<string, any> {
  return useMemo(() => {
    const fields = pickFormFields(schema, options)
    return JSON.parse(JSON.stringify(fields))
  }, [schema, JSON.stringify(options)]) // eslint-disable-line react-hooks/exhaustive-deps
}
