import React from 'react';
import { Button, Modal, StyleSheet, Text, View } from 'react-native';
import { act, fireEvent, render, screen, within } from '@testing-library/react-native';

import { ToastProvider } from '../core/provider';
import { ToastViewport } from '../components/ToastViewport';
import { Toast } from '../core/controller';
import { useToast } from '../core/context';

jest.useFakeTimers();

const HookHarness = () => {
  const toast = useToast();

  return (
    <Button
      onPress={() =>
        toast.show({
          title: 'Hook toast',
          subtitle: 'From hook'
        })
      }
      title='Show toast'
    />
  );
};

describe('toast library', () => {
  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it('renders a toast from the hook API', () => {
    render(
      <ToastProvider>
        <HookHarness />
      </ToastProvider>
    );

    fireEvent.press(screen.getByText('Show toast'));

    expect(screen.getByText('Hook toast')).toBeOnTheScreen();
    expect(screen.getByText('From hook')).toBeOnTheScreen();
  });

  it('renders a toast from the imperative API in the default host', () => {
    render(<ToastProvider />);

    act(() => {
      Toast.show({ title: 'Imperative toast' });
    });

    const viewport = screen.getByTestId('toast-viewport-default');

    expect(within(viewport).getByText('Imperative toast')).toBeOnTheScreen();
  });

  it('targets named hosts independently', () => {
    render(
      <ToastProvider>
        <ToastViewport host='modal' testID='toast-viewport-modal' />
      </ToastProvider>
    );

    act(() => {
      Toast.show({ title: 'Modal only', host: 'modal' });
    });

    expect(within(screen.getByTestId('toast-viewport-modal')).getByText('Modal only')).toBeOnTheScreen();
    expect(within(screen.getByTestId('toast-viewport-default')).queryByText('Modal only')).toBeNull();
  });

  it('queues toasts and promotes the next queued toast when the visible one is dismissed', () => {
    render(<ToastProvider maxVisible={1} />);

    let firstId = '';
    let secondId = '';

    act(() => {
      firstId = Toast.show({ title: 'First toast', autoHide: false });
      secondId = Toast.show({ title: 'Second toast', autoHide: false });
    });

    expect(screen.queryByText('First toast')).toBeNull();
    expect(screen.getByText('Second toast')).toBeOnTheScreen();

    act(() => {
      Toast.hide(secondId);
    });

    expect(screen.getByText('First toast')).toBeOnTheScreen();

    act(() => {
      Toast.hide(firstId);
    });
  });

  it('auto-hides after the configured duration', () => {
    render(<ToastProvider />);

    act(() => {
      Toast.show({ title: 'Auto hide', duration: 1000 });
    });

    expect(screen.getByText('Auto hide')).toBeOnTheScreen();

    act(() => {
      jest.advanceTimersByTime(1100);
    });

    expect(screen.queryByText('Auto hide')).toBeNull();
  });

  it('honors closeOnPress=false for toast actions', () => {
    const onActionPress = jest.fn();

    render(<ToastProvider />);

    act(() => {
      Toast.show({
        title: 'Action toast',
        autoHide: false,
        action: {
          label: 'Undo',
          onPress: onActionPress,
          closeOnPress: false
        }
      });
    });

    fireEvent.press(screen.getByText('Undo'));

    expect(onActionPress).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Action toast')).toBeOnTheScreen();
  });

  it('renders top and bottom placements in the correct edge containers', () => {
    render(<ToastProvider />);

    let topId = '';
    let bottomId = '';

    act(() => {
      topId = Toast.show({ title: 'Top toast', autoHide: false });
      bottomId = Toast.show({ title: 'Bottom toast', placement: 'bottom', autoHide: false });
    });

    const topStyle = StyleSheet.flatten(screen.getByTestId(`toast-item-${topId}`).props.style);
    const bottomStyle = StyleSheet.flatten(screen.getByTestId(`toast-item-${bottomId}`).props.style);

    expect(screen.getByText('Top toast')).toBeOnTheScreen();
    expect(screen.getByText('Bottom toast')).toBeOnTheScreen();
    expect(typeof topStyle.top).toBe('number');
    expect(topStyle.bottom).toBeUndefined();
    expect(typeof bottomStyle.bottom).toBe('number');
    expect(bottomStyle.top).toBeUndefined();
  });

  it('uses named custom layouts', () => {
    render(
      <ToastProvider
        layouts={{
          banner: ({ toast }) => <Text>{toast.title} custom layout</Text>
        }}
      />
    );

    act(() => {
      Toast.show({ title: 'Named', layout: 'banner' });
    });

    expect(screen.getByText('Named custom layout')).toBeOnTheScreen();
  });

  it('uses per-toast render overrides', () => {
    render(<ToastProvider />);

    act(() => {
      Toast.show({
        title: 'Ignored',
        render: ({ toast, dismiss }) => (
          <View>
            <Text>{toast.title} inline renderer</Text>
            <Button onPress={dismiss} title='Dismiss custom' />
          </View>
        )
      });
    });

    expect(screen.getByText('Ignored inline renderer')).toBeOnTheScreen();

    fireEvent.press(screen.getByText('Dismiss custom'));

    expect(screen.queryByText('Ignored inline renderer')).toBeNull();
  });

  it('applies style overrides to the default layout', () => {
    render(<ToastProvider />);

    let toastId = '';

    act(() => {
      toastId = Toast.show({
        title: 'Styled toast',
        autoHide: false,
        styles: {
          container: { backgroundColor: 'pink' },
          title: { color: 'navy' }
        }
      });
    });

    expect(screen.getByTestId(`toast-content-${toastId}`)).toHaveStyle({ backgroundColor: 'pink' });
    expect(screen.getByText('Styled toast')).toHaveStyle({ color: 'navy' });
  });

  it('uses provider-level icon overrides for tone and close icons', () => {
    const SuccessIcon = () => <Text>success icon</Text>;
    const CloseIcon = () => <Text>close icon</Text>;

    render(
      <ToastProvider
        iconByTone={{
          success: SuccessIcon,
          x: CloseIcon
        }}
      />
    );

    act(() => {
      Toast.show({
        title: 'Icon override toast',
        type: 'success',
        autoHide: false
      });
    });

    expect(screen.getByText('success icon')).toBeOnTheScreen();
    expect(screen.getByText('close icon')).toBeOnTheScreen();
    expect(screen.queryByText('✓')).toBeNull();
  });

  it('suppresses provider tone icons when showToneIcons=false', () => {
    render(<ToastProvider showToneIcons={false} />);

    let toastId = '';

    act(() => {
      toastId = Toast.show({
        title: 'No tone icon',
        type: 'success',
        autoHide: false
      });
    });

    expect(screen.queryByTestId(`toast-leading-icon-${toastId}`)).toBeNull();
    expect(screen.getByTestId(`toast-close-icon-${toastId}`)).toBeOnTheScreen();
  });

  it('falls back to the platform default font when no typography fontFamily override is supplied', () => {
    render(<ToastProvider />);

    let toastId = '';

    act(() => {
      toastId = Toast.show({ title: 'Typography fallback', autoHide: false });
    });

    const title = screen.getByTestId(`toast-title-${toastId}`);
    const flattenedStyle = StyleSheet.flatten(title.props.style);

    expect(flattenedStyle.fontFamily).toBeUndefined();
  });

  it('marks only the active toast as swipe-enabled', () => {
    render(<ToastProvider maxVisible={2} />);

    let firstId = '';
    let secondId = '';

    act(() => {
      firstId = Toast.show({ title: 'Older', autoHide: false });
      secondId = Toast.show({ title: 'Newest', autoHide: false });
    });

    expect(screen.getByTestId(`toast-item-${secondId}`).props.accessibilityHint).toBe('swipe-enabled');
    expect(screen.getByTestId(`toast-item-${firstId}`).props.accessibilityHint).toBe('swipe-disabled');
  });

  it('supports rendering a viewport inside a modal subtree', () => {
    render(
      <ToastProvider>
        <Modal transparent visible>
          <ToastViewport host='modal' testID='toast-viewport-modal' />
        </Modal>
      </ToastProvider>
    );

    act(() => {
      Toast.show({ title: 'Modal toast', host: 'modal' });
    });

    expect(within(screen.getByTestId('toast-viewport-modal')).getByText('Modal toast')).toBeOnTheScreen();
  });
});
