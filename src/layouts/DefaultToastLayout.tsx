import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, TextStyle } from 'react-native';

import type { ToastLayoutRenderProps, ToastTone } from '../types';

const TONE_SYMBOLS: Record<ToastTone, string> = {
  default: '•',
  success: '✓',
  error: '!',
  warning: '!',
  info: 'i'
};

const renderTextNode = (
  value: ToastLayoutRenderProps['toast']['title'],
  style: StyleProp<TextStyle>,
  testID: string
) => {
  if (typeof value === 'string' || typeof value === 'number') {
    return (
      <Text testID={testID} style={style}>
        {value}
      </Text>
    );
  }

  return value;
};

export const DefaultToastLayout = ({
  toast,
  dismiss,
  theme,
  tone
}: ToastLayoutRenderProps) => {
  const defaultLeading =
    toast.leading !== undefined ? (
      toast.leading
    ) : toast.type === 'default' ? null : (
      <View
        style={[
          styles.leadingDefault,
          {
            width: theme.spacing.leadingSize,
            height: theme.spacing.leadingSize,
            borderRadius: theme.radius.icon,
            backgroundColor: tone.iconBackground
          }
        ]}>
        <Text style={[styles.leadingLabel, { color: tone.iconForeground }]}>
          {TONE_SYMBOLS[toast.type]}
        </Text>
      </View>
    );

  const handleActionPress = () => {
    toast.action?.onPress();
    if (toast.action?.closeOnPress ?? true) {
      dismiss();
    }
  };

  return (
    <View
      testID={`toast-content-${toast.id}`}
      style={[
        styles.container,
        theme.shadow,
        {
          backgroundColor: tone.background,
          borderColor: tone.border,
          borderLeftColor: tone.accent,
          borderRadius: theme.radius.card,
          paddingHorizontal: theme.spacing.horizontalPadding,
          paddingVertical: theme.spacing.verticalPadding
        },
        toast.styles?.container
      ]}>
      <View style={[styles.content, toast.styles?.content]}>
        {defaultLeading ? <View style={[styles.leading, toast.styles?.leading]}>{defaultLeading}</View> : null}

        <View style={[styles.textContent, toast.styles?.textContent]}>
          {renderTextNode(
            toast.title,
            [
              styles.title,
              theme.typography.title,
              { color: tone.title },
              toast.styles?.title
            ],
            `toast-title-${toast.id}`
          )}

          {toast.subtitle
            ? renderTextNode(
                toast.subtitle,
                [
                  styles.subtitle,
                  theme.typography.subtitle,
                  { color: tone.subtitle },
                  toast.styles?.subtitle
                ],
                `toast-subtitle-${toast.id}`
              )
            : null}

          {toast.action ? (
            <Pressable
              accessibilityRole='button'
              onPress={handleActionPress}
              style={[styles.actionContainer, toast.styles?.actionContainer]}>
              <Text
                testID={`toast-action-${toast.id}`}
                style={[
                  theme.typography.action,
                  styles.actionLabel,
                  { color: tone.action },
                  toast.styles?.actionLabel
                ]}>
                {toast.action.label}
              </Text>
            </Pressable>
          ) : null}
        </View>

        <View style={[styles.trailing, toast.styles?.trailing]}>
          {toast.trailing}
          <Pressable
            accessibilityRole='button'
            onPress={dismiss}
            style={[styles.closeButton, toast.styles?.closeButton]}>
            <Text
              style={[
                theme.typography.close,
                styles.closeLabel,
                { color: tone.close },
                toast.styles?.closeLabel
              ]}>
              ×
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderLeftWidth: 4
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  leading: {
    marginRight: 12,
    paddingTop: 2
  },
  leadingDefault: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  leadingLabel: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  textContent: {
    flex: 1
  },
  title: {
    marginBottom: 2
  },
  subtitle: {
    marginTop: 2
  },
  actionContainer: {
    alignSelf: 'flex-start',
    marginTop: 8
  },
  actionLabel: {
    textDecorationLine: 'underline'
  },
  trailing: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 12
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    minWidth: 28,
    minHeight: 28
  },
  closeLabel: {
    textAlign: 'center'
  }
});
