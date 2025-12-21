import { useMemo, useState, useCallback } from 'react'
import { transformSchema, ajv } from 'startupjs/schema'
import _set from 'lodash/set'
import _get from 'lodash/get'

export default function useValidate (
  { always = false }: { always?: boolean } = {}
): any {
  const forceUpdate = useForceUpdate()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => createValidateWrapper({ always, forceUpdate }), [])
}

function createValidateWrapper (
  { always, forceUpdate }: { always: boolean, forceUpdate: () => void }
): any {
  const _validate = new Validate({ always, forceUpdate })
  function validate (): boolean | undefined {
    if (!_validate.hasValidator()) throw Error(ERRORS.notInitialized)
    _validate.activate()
    return _validate.run()
  }
  // wrap 'validate' function into Proxy to make it behave like an instance of Validate class
  // while still being callable directly
  const methods = new WeakMap<(...args: any[]) => any, (...args: any[]) => any>()
  return new Proxy(validate, {
    get (target, prop: string | symbol) {
      // This is a hack to force update the component the parent component when the errors change
      // if the parent component is using the errors prop to render something
      // (like disabling a Submit button when there are errors)
      // TODO: _shouldForceUpdate should correctly reset back to false if Form unmounts
      if (prop === 'errors') {
        _validate.makeReactive()
        return _validate.getErrors()
      } else if (prop === 'hasErrors') {
        _validate.makeReactive()
        return _validate.getHasErrors()
      }
      let res = Reflect.get(_validate as unknown as object, prop)
      // bind methods called on validate (which is a function) to the _validate object
      if (typeof res === 'function') {
        if (!methods.has(res)) methods.set(res, res.bind(_validate))
        res = methods.get(res)
      }
      return res
    }
  })
}

function useForceUpdate (): () => void {
  const [, setState] = useState(Math.random())
  // parent component's forceUpdate might be called from a child component
  // so we need to use setTimeout to make sure it runs asynchronously
  return useCallback(() => {
    setTimeout(() => {
      setState(Math.random())
    }, 0)
  }, [])
}

const ERRORS = {
  notInitialized: `
    useValidate():
    'validate' is not initialized with the Form component.

    You must pass 'validate' from useValidate()
    to the 'validate' prop of the Form component:

    const validate = useValidate()
    <Form validate={validate} ... />
  `
}

class Validate {
  always: boolean

  private _isReactive?: boolean
  private _lastHasErrors?: boolean
  private readonly _forceUpdate: () => void
  private _validator?: Validator
  private _formId?: string

  constructor ({ forceUpdate, always }: { forceUpdate: () => void, always: boolean }) {
    this._forceUpdate = forceUpdate
    this.always = always
  }

  init ({ validator, formId }: { validator: Validator, formId: string }): void {
    this._validator = validator
    this._formId = formId
    this._validator.onHasErrorsChange = ({ formId }: { formId?: string } = {}) => {
      // only the Form which is currently associated with this 'validate' can force an update
      if (formId && formId !== this._formId) return
      if (this._isReactive) this._forceUpdate()
    }
  }

  activate (): void {
    this._validator?.activate()
  }

  deactivate (): void {
    this._validator?.deactivate()
  }

  makeReactive (): void {
    this._isReactive = true
  }

  hasValidator (): boolean {
    return !!this._validator
  }

  run (): boolean | undefined {
    if (!this._validator) throw Error('Validator is not set')
    return this._validator.run()
  }

  getErrors (): any {
    return this._validator?.getErrors()
  }

  getHasErrors (): boolean | undefined {
    const hasErrors = this._validator?.getHasErrors()
    this._lastHasErrors = hasErrors
    return hasErrors
  }

  reset ({ formId }: { formId?: string } = {}): void {
    // if formId is set, reset only if it matches the formId currently associated with this 'validate'.
    // This prevents race conditions when a Form is unmounted and another Form is mounted right away
    // which uses the same 'validate' prop.
    // Only one Form can be associated with one 'validate' at a time.
    // TODO: add check to init() to prevent multiple Forms from using the same 'validate'.
    if (formId && formId !== this._formId) return
    this._validator = undefined
    this._formId = undefined
    if (this._lastHasErrors) {
      this._lastHasErrors = undefined
      if (this._isReactive) this._forceUpdate()
    }
  }
}

export class Validator {
  onHasErrorsChange?: (args?: { formId?: string }) => void

  private _active?: boolean
  private _validate?: any
  private _getValue?: () => any
  private _hasErrors?: boolean
  private _$errors?: any
  private _initialized?: boolean
  private _forceUpdate?: () => void
  private _formId?: string

  init ({
    fields, // either simplified schema or full schema
    getValue, // obtain current value to validate (usually it will be from a closure of Form component)
    $errors, // reactive object to store errors, this is basically a hack to use model's .setDiffDeep()
    forceUpdate, // force update Form itself
    formId
  }: {
    fields: Record<string, any> | any
    getValue: () => any
    $errors: any
    forceUpdate: () => void
    formId: string
  }): void {
    let schema = fields
    // we allow extra properties in Form to let people just pass the full document
    // instead of forcing them to pick only the fields used in schema
    schema = transformSchema(schema, { additionalProperties: true })
    this._validate = ajv.compile(schema)
    this._getValue = getValue
    this._$errors = $errors
    this._forceUpdate = forceUpdate
    this._formId = formId
    this._initialized = true
  }

  activate (): void {
    this._active = true
  }

  deactivate (): void {
    this._active = false
  }

  getErrors (): any {
    return this._$errors?.get()
  }

  getHasErrors (): boolean | undefined {
    return this._hasErrors
  }

  run (): boolean | undefined {
    if (!this._active) return
    if (!this._initialized) throw Error('Validator is not initialized')
    const valid = this._validate(this._getValue?.())
    if (valid) {
      if (this._hasErrors) {
        this._hasErrors = undefined
        this._$errors?.del()
        this._forceUpdate?.()
        this.onHasErrorsChange?.({ formId: this._formId })
      }
      return true
    } else {
      const newErrors = transformAjvErrors(this._validate.errors)
      const hadErrors = this._hasErrors
      this._hasErrors = true
      this._$errors?.set(newErrors)
      if (!hadErrors) {
        this._forceUpdate?.()
        this.onHasErrorsChange?.({ formId: this._formId })
      }
      return false
    }
  }
}

// transform errors from ajv to our format
function transformAjvErrors (errors?: any[]): Record<string, any> {
  const res: Record<string, any> = {}

  for (const error of errors ?? []) {
    let path: any
    let message: any

    // Handling errors related to required fields
    // since required errors are declared at the root of the schema,
    // the instancePath for them is ''
    if (error.instancePath === '') {
      if (error.keyword === 'required') {
        path = error.params.missingProperty
        message = 'This field is required'
      } else if (
        error.keyword === 'errorMessage' &&
        error.params.errors[0].keyword === 'required'
      ) {
        // Handling ajv-errors errors
        // ajv-errors generates the 'errorMessage' keyword with params.errors
        path = error.params.errors[0].params.missingProperty
        message = error.message
      }
    } else {
      // Handling other types of errors
      path = error.instancePath.replace(/^\//, '').split('/')
      message = error.message
    }
    if (!_get(res, path)) _set(res, path, [])
    _get(res, path).push(message)
  }

  return res
}
