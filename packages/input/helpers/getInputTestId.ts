export default function getInputTestId (props: {
  testId?: string
  label?: unknown
  description?: unknown
  placeholder?: unknown
} & Record<string, any>): string | undefined {
  if (props.testId) return props.testId

  const inputName =
    (typeof props.label === 'string' && props.label !== '' ? props.label : null) ??
    (typeof props.description === 'string' && props.description !== '' ? props.description : null) ??
    (typeof props.placeholder === 'string' && props.placeholder !== '' ? props.placeholder : null)

  if (!inputName || typeof inputName !== 'string') return undefined

  const nameHash = simpleNumericHash(inputName)
  const allowedCharacters = inputName.match(/\w+/g)

  return (allowedCharacters ?? []).join('_').slice(0, 20) + '-' + nameHash
}

function simpleNumericHash (s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0
  return h
}
