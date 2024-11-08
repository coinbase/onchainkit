export type OpenEvent = {
    eventName: 'open';
    widgetName: string;
  };
  
  export type TransitionViewEvent = {
    eventName: 'transition_view';
    pageRoute: string;
  };
  
  export type PublicErrorEvent = {
    eventName: 'error';
    // TODO: Public error shape
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any;
  };
  
  export type ExitEvent = {
    eventName: 'exit';
    // TODO: Public error shape
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any;
  };
  
  export type SuccessEvent = {
    eventName: 'success';
  };
  
  export type RequestOpenUrlEvent = {
    eventName: 'request_open_url';
    url: string;
  };
  
  export type EventMetadata =
    | OpenEvent
    | TransitionViewEvent
    | PublicErrorEvent
    | ExitEvent
    | SuccessEvent
    | RequestOpenUrlEvent;
  