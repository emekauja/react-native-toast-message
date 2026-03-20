/* eslint-env jest */

require('react-native-gesture-handler/jestSetup');

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View } = require('react-native');
  const createAnimatedComponent = (Component) =>
    React.forwardRef((props, ref) => React.createElement(Component, { ...props, ref }));

  const FadeInDown = {
    springify: () => ({})
  };
  const FadeInUp = {
    springify: () => ({})
  };
  const FadeOutLeft = {
    duration: () => ({})
  };

  return {
    __esModule: true,
    default: {
      View: createAnimatedComponent(View),
      createAnimatedComponent
    },
    FadeInDown,
    FadeInUp,
    FadeOutLeft,
    createAnimatedComponent,
    runOnJS: (fn) => fn,
    useAnimatedStyle: (updater) => updater(),
    useSharedValue: (value) => ({ value }),
    withSpring: (value) => value,
    withTiming: (value, _config, callback) => {
      if (callback) {
        callback(true);
      }

      return value;
    }
  };
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');

  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaConsumer: ({ children }) => children({ top: 0, right: 0, bottom: 0, left: 0 }),
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 })
  };
});

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');

  const createPanGesture = () => ({
    enabled() {
      return this;
    },
    onBegin() {
      return this;
    },
    onUpdate() {
      return this;
    },
    onEnd() {
      return this;
    },
    onFinalize() {
      return this;
    }
  });

  return {
    Gesture: {
      Pan: createPanGesture
    },
    GestureDetector: ({ children }) => React.createElement(React.Fragment, null, children)
  };
});
