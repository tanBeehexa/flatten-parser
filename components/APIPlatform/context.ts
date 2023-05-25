  export class APIPlatformState {
    constructor (
        public headers = {}
    ) {}
  }

  export const API_PLATFORM_CONTEXT_KEY = Symbol('API_PLATFORM_CONTEXT_KEY') as InjectionKey<string>