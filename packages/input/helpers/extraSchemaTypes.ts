const EXTRA_SCHEMA_TYPES = ['string', 'boolean', 'integer'] as const

export type ExtraSchemaType = typeof EXTRA_SCHEMA_TYPES[number]

export default EXTRA_SCHEMA_TYPES
