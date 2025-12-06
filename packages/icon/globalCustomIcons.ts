export const customIcons: Record<string, any> = {}

export function setCustomIcons (newCustomIcons: Record<string, any> = {}) {
  Object.assign(customIcons, newCustomIcons)
}
