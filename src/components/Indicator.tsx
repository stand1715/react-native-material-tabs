import React from 'react';
import { Animated, Text } from 'react-native';
import styled from 'styled-components/native';

import constants from '../lib/constants';
import { TabText } from './Tab/styles';

interface BarProps {
  tabWidth: number;
  color: string;
}

const Bar = styled(Animated.View)`
height: ${constants.indicatorHeight};
width: ${(props: BarProps) => props.tabWidth};
position: absolute;
bottom: 0;
background-color: ${(props: BarProps) => props.color};
`;

interface IndicatorProps {
  color: string;
  tabWidth: number;
  style: any;
  value: Animated.Value;
}

const Indicator = ({ style = {}, ...props }: IndicatorProps) => (
  <Bar
    color={props.color}
    style={{ transform: [{ translateX: props.value }], ...style }}
    tabWidth={props.tabWidth}
  >
    <Text>on99</Text>
  </Bar>
);

export default Indicator;
