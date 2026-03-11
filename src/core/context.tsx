import { createContext, useContext } from 'react';

import type { ToastApi, ToastLayouts, ToastOptions, ToastTheme, ToastViewportProps } from '../types';
import type { ToastState } from './store';

export type ToastEnvironment = ToastApi & {
  state: ToastState;
  layouts: ToastLayouts;
  defaultLayout: string;
  defaultOptions?: Partial<ToastOptions>;
  maxVisible: number;
  offsets?: ToastViewportProps['offsets'];
  theme: ToastTheme;
};

export const ToastContext = createContext<ToastEnvironment | null>(null);

export const useToastContext = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider.');
  }

  return context;
};

export const useToast = (): ToastApi => {
  const { show, hide, hideAll } = useToastContext();

  return {
    show,
    hide,
    hideAll
  };
};
