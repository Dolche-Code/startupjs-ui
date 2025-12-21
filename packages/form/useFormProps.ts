import { createContext, useContext, useState } from 'react'

export const FormPropsContext = createContext<Record<string, any> | undefined>(undefined)

export default function useFormProps (): Record<string, any> {
  // useState is used to avoid re-creating the object on every render
  const [empty] = useState<Record<string, any>>({})
  return useContext(FormPropsContext) ?? empty
}
