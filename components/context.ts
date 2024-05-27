import { type CheckboxOptionType } from "ant-design-vue";

export type ContextState = {
  response: object;
  jsonataExpressions: Array<string>;
  selectedExpression: {
    key: string;
    mappingKeys: Array<CheckboxOptionType["value"]>;
  };
};

export const CONTEXT_KEY = Symbol("CONTEXT_KEY") as InjectionKey<string>;
