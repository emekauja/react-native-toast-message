import React, { useCallback, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutLeft,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';

import {
  STACK_OPACITY_STEP,
  STACK_SCALE_STEP,
  SWIPE_DISMISS_THRESHOLD
} from '../constants';
import type { ResolvedToast, ToastLayoutRenderer, ToastTheme } from '../types';

type ToastItemProps = {
  toast: ResolvedToast;
  renderer: ToastLayoutRenderer;
  placementIndex: number;
  totalVisible: number;
  zIndex: number;
  offset: number;
  theme: ToastTheme;
  dismiss: (id: string) => void;
};

const SCREEN_WIDTH = Dimensions.get('window').width;

export const ToastItem = ({
  toast,
  renderer,
  placementIndex,
  totalVisible,
  zIndex,
  offset,
  theme,
  dismiss
}: ToastItemProps) => {
  const translateX = useSharedValue(0);
  const isSwiping = useSharedValue(false);
  const swipeEnabled = placementIndex === 0;

  const handleDismiss = useCallback(() => {
    dismiss(toast.id);
  }, [dismiss, toast.id]);

  useEffect(() => {
    if (!toast.autoHide || !swipeEnabled) {
      return;
    }

    const timeout = setTimeout(handleDismiss, toast.duration);
    return () => clearTimeout(timeout);
  }, [handleDismiss, swipeEnabled, toast.autoHide, toast.duration]);

  const gesture = Gesture.Pan()
    .enabled(swipeEnabled)
    .onBegin(() => {
      isSwiping.value = true;
    })
    .onUpdate((event) => {
      if (event.translationX > 0) {
        return;
      }

      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX < -SWIPE_DISMISS_THRESHOLD) {
        translateX.value = withTiming(-SCREEN_WIDTH, { duration: 180 }, (finished) => {
          if (finished) {
            runOnJS(handleDismiss)();
          }
        });
        return;
      }

      translateX.value = withSpring(0);
    })
    .onFinalize(() => {
      isSwiping.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => {
    const scale = Math.max(1 - placementIndex * STACK_SCALE_STEP, 0.88);
    const opacity = Math.max(1 - placementIndex * STACK_OPACITY_STEP, 0.7);
    const edgeStyle =
      toast.placement === 'top'
        ? { top: withSpring(offset + placementIndex * theme.spacing.stackOffset) }
        : { bottom: withSpring(offset + placementIndex * theme.spacing.stackOffset) };

    return {
      ...edgeStyle,
      left: theme.spacing.viewportHorizontal,
      right: theme.spacing.viewportHorizontal,
      opacity,
      position: 'absolute',
      transform: [
        {
          scale: withSpring(isSwiping.value ? scale * 0.98 : scale)
        },
        {
          translateX: translateX.value
        }
      ],
      zIndex
    };
  }, [offset, placementIndex, theme, toast.placement, zIndex]);

  const content = (
    <Animated.View
      accessibilityHint={swipeEnabled ? 'swipe-enabled' : 'swipe-disabled'}
      entering={toast.placement === 'top' ? FadeInDown.springify() : FadeInUp.springify()}
      exiting={FadeOutLeft.duration(180)}
      style={animatedStyle}
      testID={`toast-item-${toast.id}`}>
      {renderer({
        toast,
        dismiss: handleDismiss,
        index: placementIndex,
        totalVisible,
        isVisible: true,
        theme,
        tone: theme.colors.tones[toast.type]
      })}
    </Animated.View>
  );

  if (!swipeEnabled) {
    return content;
  }

  return <GestureDetector gesture={gesture}>{content}</GestureDetector>;
};
