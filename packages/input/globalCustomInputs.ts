export const customInputs: Record<string, any> = {}

export function setCustomInputs (newCustomInputs: Record<string, any> = {}): void {
  Object.assign(customInputs, newCustomInputs)
}
