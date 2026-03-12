import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DEFAULT_HOST } from '../constants';
import { useToastContext } from '../core/context';
import { resolveToast } from '../core/store';
import { DefaultToastLayout } from '../layouts/DefaultToastLayout';
import type { ToastLayoutRenderer, ToastPlacement, ToastViewportProps } from '../types';
import { ToastItem } from './ToastItem';

const PLACEMENTS: ToastPlacement[] = ['top', 'bottom'];

export const ToastViewport = ({
  host = DEFAULT_HOST,
  maxVisible,
  offsets,
  defaultOptions,
  style,
  testID
}: ToastViewportProps) => {
  const environment = useToastContext();
  const insets = useSafeAreaInsets();

  const resolvedMaxVisible = maxVisible ?? environment.maxVisible;
  const rawToasts = environment.state.toastsByHost[host] ?? [];
  const visibleToasts = rawToasts
    .slice(0, resolvedMaxVisible)
    .map((toast) => resolveToast(toast, environment.defaultOptions, defaultOptions));

  const resolvedOffsets = {
    top:
      offsets?.top ??
      environment.offsets?.top ??
      environment.theme.spacing.edgeOffset + insets.top,
    bottom:
      offsets?.bottom ??
      environment.offsets?.bottom ??
      environment.theme.spacing.edgeOffset + insets.bottom
  };

  const itemsByPlacement = useMemo(
    () =>
      PLACEMENTS.reduce<Record<ToastPlacement, typeof visibleToasts>>(
        (acc, placement) => {
          acc[placement] = visibleToasts.filter((toast) => toast.placement === placement);
          return acc;
        },
        {
          top: [],
          bottom: []
        }
      ),
    [visibleToasts]
  );

  const renderToast = (toast: (typeof visibleToasts)[number], placementIndex: number, total: number) => {
    const renderer: ToastLayoutRenderer =
      toast.render ??
      (toast.layout ? environment.layouts[toast.layout] : undefined) ??
      environment.layouts[environment.defaultLayout] ??
      DefaultToastLayout;

    return (
      <ToastItem
        dismiss={environment.hide}
        icons={environment.icons}
        key={toast.id}
        offset={resolvedOffsets[toast.placement]}
        placementIndex={placementIndex}
        renderer={renderer}
        theme={environment.theme}
        toast={toast}
        totalVisible={total}
        zIndex={1000 - placementIndex}
      />
    );
  };

  return (
    <View
      pointerEvents='box-none'
      style={[StyleSheet.absoluteFillObject, style]}
      testID={testID ?? `toast-viewport-${host}`}>
      {PLACEMENTS.map((placement) =>
        itemsByPlacement[placement].map((toast, index) =>
          renderToast(toast, index, itemsByPlacement[placement].length)
        )
      )}
    </View>
  );
};
