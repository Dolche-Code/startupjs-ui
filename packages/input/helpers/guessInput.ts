// guess input type based on schema type and props
export default function guessInput (
  input?: string,
  type?: string,
  props: Record<string, any> = {}
): string {
  if (input) return input
  if (type) {
    if (props.enum) return 'select'
    if (SCHEMA_TYPES_TO_INPUT[type]) return SCHEMA_TYPES_TO_INPUT[type]
    return type
  }
  return 'text'
}

export const SCHEMA_TYPES_TO_INPUT: Record<string, string> = {
  string: 'text',
  boolean: 'checkbox',
  integer: 'number',
  number: 'number',
  array: 'array',
  object: 'object'
}
