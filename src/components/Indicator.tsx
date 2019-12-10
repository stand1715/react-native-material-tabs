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
background-color: ${(props: BarProps) => 'transparent'};
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
    style={{ transform: [{ translateX: props.value }], ...style, opacity: props.value < 0 ? 0 : 1 }}
    tabWidth={props.tabWidth}
  />
);

export default Indicator;
