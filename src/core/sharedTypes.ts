export type Button = {
    label: string;
    action?: 'post' | 'post_redirect';
  };
  
export type FrameMetadata = {
    image: string;
    buttons?: [Button, ...Button[]];
    post_url?: string;
    refresh_period?: number;
  };