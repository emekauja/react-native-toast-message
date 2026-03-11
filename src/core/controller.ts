import type { ToastApi, ToastOptions } from '../types';

let currentApi: ToastApi | null = null;

export const setToastApi = (api: ToastApi | null) => {
  currentApi = api;
};

const warnIfUnavailable = (method: keyof ToastApi) => {
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    console.warn(`Toast.${method} was called before ToastProvider mounted.`);
  }
};

export const Toast = {
  show(toast: ToastOptions) {
    if (!currentApi) {
      warnIfUnavailable('show');
      return '';
    }

    return currentApi.show(toast);
  },
  hide(id: string) {
    if (!currentApi) {
      warnIfUnavailable('hide');
      return;
    }

    currentApi.hide(id);
  },
  hideAll(host?: string) {
    if (!currentApi) {
      warnIfUnavailable('hideAll');
      return;
    }

    currentApi.hideAll(host);
  }
};
