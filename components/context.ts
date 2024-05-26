export type ContextState = {
  response: object;
  jsonataExpressions: Array<string>;
  selectedExpression: object;
};

export const CONTEXT_KEY = Symbol("CONTEXT_KEY") as InjectionKey<string>;
