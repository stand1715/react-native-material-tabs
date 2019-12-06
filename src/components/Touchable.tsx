import React from 'react';
import {
  Platform,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface TouchableProps {
  style?: StyleProp<ViewStyle>;
  children: React.ReactChild;
  onPress: () => void;
}

const Touchable = (props: TouchableProps) =>
  Platform.OS === 'ios' ? (
    <TouchableOpacity style={props.style} onPress={props.onPress}>
      {props.children}
    </TouchableOpacity>
  ) : (
      <TouchableWithoutFeedback onPress={props.onPress}>
        <View style={props.style} onPress={props.onPress}>{props.children}</View>
      </TouchableWithoutFeedback>
    );

export default Touchable;
