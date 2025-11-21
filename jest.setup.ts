import '@testing-library/jest-dom'

if (!window.CustomEvent) {
  window.CustomEvent = class CustomEvent extends Event {
    detail: any
    constructor(event: string, params: any) {
      super(event, params)
      this.detail = params?.detail
    }
  } as any
}
