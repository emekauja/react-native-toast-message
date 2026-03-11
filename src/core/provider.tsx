import React, { useEffect, useMemo, useReducer, useRef } from 'react';

import { DEFAULT_HOST, DEFAULT_LAYOUT, DEFAULT_MAX_VISIBLE } from '../constants';
import { ToastViewport } from '../components/ToastViewport';
import { ToastContext } from './context';
import { setToastApi } from './controller';
import { createInternalToast, hasToastId, initialToastState, toastReducer } from './store';
import { createToastTheme } from '../theme';
import type { ToastApi, ToastProviderProps } from '../types';

const createGeneratedToastId = (counter: React.MutableRefObject<number>) => {
  counter.current += 1;
  return `toast-${counter.current}`;
};

export const ToastProvider = ({
  children,
  layouts,
  defaultLayout = DEFAULT_LAYOUT,
  defaultOptions,
  maxVisible = DEFAULT_MAX_VISIBLE,
  offsets,
  theme,
  renderDefaultViewport = true,
  viewportProps
}: ToastProviderProps) => {
  const [state, dispatch] = useReducer(toastReducer, initialToastState);
  const idCounter = useRef(0);

  const api = useMemo<ToastApi>(
    () => ({
      show: (toast) => {
        const preferredId = toast.id ?? createGeneratedToastId(idCounter);
        const id = hasToastId(state, preferredId) ? createGeneratedToastId(idCounter) : preferredId;
        const host = toast.host ?? defaultOptions?.host ?? DEFAULT_HOST;

        dispatch({
          type: 'show',
          toast: {
            ...createInternalToast(toast, { host }),
            id
          }
        });

        return id;
      },
      hide: (id) => {
        dispatch({ type: 'hide', id });
      },
      hideAll: (host) => {
        dispatch({ type: 'hideAll', host });
      }
    }),
    [defaultOptions?.host, state]
  );

  useEffect(() => {
    setToastApi(api);
    return () => setToastApi(null);
  }, [api]);

  const environment = useMemo(
    () => ({
      ...api,
      state,
      layouts: layouts ?? {},
      defaultLayout,
      defaultOptions,
      maxVisible,
      offsets,
      theme: createToastTheme(theme)
    }),
    [api, defaultLayout, defaultOptions, layouts, maxVisible, offsets, state, theme]
  );

  return (
    <ToastContext.Provider value={environment}>
      {children}
      {renderDefaultViewport ? <ToastViewport {...viewportProps} /> : null}
    </ToastContext.Provider>
  );
};
