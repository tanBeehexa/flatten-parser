export type ContextState = {
  response: object
  jsonataExpr: Array<string>,
  currentExpr: object
}

export const CONTEXT_KEY = Symbol('CONTEXT_KEY') as InjectionKey<string>