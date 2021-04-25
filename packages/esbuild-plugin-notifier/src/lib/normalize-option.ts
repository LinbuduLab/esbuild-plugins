import type {} from 'node-notifier';

export interface ESBuildPluginNotifierOption {
  title: string;

  favicon?: string;
  // TODO: native sound list
  sound?: boolean | string;

  successSound?: boolean | string;
  warningSound?: boolean | string;
  failureSound?: boolean | string;
  buildSound?: boolean | string;

  suppressSuccess?: boolean | 'always' | 'initial';

  showDuration: number;
  // support URL, and download to tmp directory?
  successIcon: string;
  warningIcon: string;
  failureIcon: string;
  buildIcon: string;

  // on click handle
}
