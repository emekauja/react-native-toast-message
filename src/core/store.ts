import { DEFAULT_DURATION, DEFAULT_HOST } from '../constants';
import type { InternalToast, ResolvedToast, ToastOptions, ToastStyleOverrides } from '../types';

export type ToastState = {
  toastsByHost: Record<string, InternalToast[]>;
};

type ToastAction =
  | { type: 'show'; toast: InternalToast }
  | { type: 'hide'; id: string }
  | { type: 'hideAll'; host?: string };

export const initialToastState: ToastState = {
  toastsByHost: {}
};

export const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case 'show': {
      const hostToasts = state.toastsByHost[action.toast.host] ?? [];

      return {
        toastsByHost: {
          ...state.toastsByHost,
          [action.toast.host]: [action.toast, ...hostToasts]
        }
      };
    }
    case 'hide': {
      const nextToastsByHost = Object.entries(state.toastsByHost).reduce<ToastState['toastsByHost']>(
        (acc, [host, toasts]) => {
          const nextToasts = toasts.filter((toast) => toast.id !== action.id);
          if (nextToasts.length > 0) {
            acc[host] = nextToasts;
          }
          return acc;
        },
        {}
      );

      return { toastsByHost: nextToastsByHost };
    }
    case 'hideAll': {
      if (!action.host) {
        return initialToastState;
      }

      const nextToastsByHost = { ...state.toastsByHost };
      delete nextToastsByHost[action.host];
      return { toastsByHost: nextToastsByHost };
    }
    default:
      return state;
  }
};

const STYLE_SLOTS: Array<keyof ToastStyleOverrides> = [
  'container',
  'content',
  'leading',
  'textContent',
  'title',
  'subtitle',
  'actionContainer',
  'actionLabel',
  'trailing',
  'closeButton',
  'closeLabel'
];

export const mergeToastStyles = (
  ...styleSets: Array<ToastStyleOverrides | undefined>
): ToastStyleOverrides | undefined => {
  const merged = STYLE_SLOTS.reduce<ToastStyleOverrides>((acc, slot) => {
    const styles = styleSets
      .map((styleSet) => styleSet?.[slot])
      .filter((style): style is NonNullable<typeof style> => style != null);

    if (styles.length > 0) {
      acc[slot] = styles;
    }

    return acc;
  }, {});

  return Object.keys(merged).length > 0 ? merged : undefined;
};

export const createInternalToast = (
  toast: ToastOptions,
  options?: {
    host?: string;
  }
): InternalToast => ({
  ...toast,
  id: toast.id ?? '',
  host: toast.host ?? options?.host ?? DEFAULT_HOST,
  createdAt: Date.now()
});

export const resolveToast = (
  toast: InternalToast,
  providerDefaults?: Partial<ToastOptions>,
  viewportDefaults?: Partial<ToastOptions>
): ResolvedToast => {
  const merged = {
    ...providerDefaults,
    ...viewportDefaults,
    ...toast
  };

  return {
    ...toast,
    ...merged,
    host: toast.host,
    type: merged.type ?? 'default',
    placement: merged.placement ?? 'top',
    duration: merged.duration ?? DEFAULT_DURATION,
    autoHide: merged.autoHide ?? true,
    styles: mergeToastStyles(providerDefaults?.styles, viewportDefaults?.styles, toast.styles)
  };
};

export const hasToastId = (state: ToastState, id: string) =>
  Object.values(state.toastsByHost).some((toasts) => toasts.some((toast) => toast.id === id));
