import React, { useState, useEffect, useCallback } from 'react';
import {
  Animated,
  ScrollView,
  View,
  ScrollViewProps,
  StyleProp,
  TextStyle,
  I18nManager,
} from 'react-native';

import Tab from './Tab';
import Indicator from './Indicator';
import { ContentType } from './Tab/Tab';

import { Bar, TabTrack } from '../lib/styles';
import constants from '../lib/constants';

interface Props extends Pick<ScrollViewProps, 'keyboardShouldPersistTaps'> {
  allowFontScaling: boolean;
  selectedIndex: number;
  barColor: string;
  barHeight: number;
  activeTextColor: string;
  indicatorColor: string;
  inactiveTextColor: string;
  scrollable: boolean;
  indicatorStyle: StyleProp<ViewStyle>;
  textStyle: StyleProp<TextStyle>;
  activeTextStyle: StyleProp<TextStyle>;
  items: ContentType[];
  uppercase: boolean;
  onChange(index: number): void;
}

const getKeyForTab = (item: ContentType) =>
  typeof item === 'string' ? item : item.key;

const MaterialTabs: React.FC<Props> = ({
  items,
  hide,
  selectedIndex,
  scrollable,
  keyboardShouldPersistTaps,
  barHeight,
  barWidthPercentage = 0.4,
  onChange,
  allowFontScaling,
  activeTextColor,
  indicatorStyle,
  textStyle,
  activeTextStyle,
  inactiveTextColor,
  uppercase,
  indicatorColor,
  barColor,
  translateX
}) => {
  const [tabWidth, setTabWidth] = useState(0);
  const [barWidth, setBarWidth] = useState(0);
  const [indicatorPosition] = useState(new Animated.Value(0));
  const scrollView = React.createRef<ScrollView>();
  const bar = React.createRef<View>();

  const getTabWidth = useCallback(
    (width: number = 0) => {
      if (items.length && !scrollable) {
        setTabWidth(width / items.length);
      }

      setBarWidth(width);
    },
    [items.length, scrollable]
  );

  useEffect(() => {
    const getAnimateValues = () => {

      const scrollValue = !scrollable ? tabWidth : barWidth * barWidthPercentage;
      const indicator = I18nManager.isRTL
        ? -selectedIndex * scrollValue
        : selectedIndex * scrollValue;

      // All props for fixed tabs are the same
      if (!scrollable) {
        return {
          indicatorPosition: indicator,
          scrollPosition: 0,
        };
      }

      return {
        indicatorPosition: indicator,
        scrollPosition: I18nManager.isRTL
          ? scrollValue * 0.25 +
          scrollValue * (items.length - selectedIndex - 2)
          : scrollValue * 0.25 + scrollValue * (selectedIndex - 1),
      };
    };

    const selectTab = () => {
      const values = getAnimateValues();

      Animated.spring(indicatorPosition, {
        toValue: values.indicatorPosition,
        tension: 300,
        friction: 20,
        useNativeDriver: true,
      }).start();

      if (scrollView.current) {
        scrollView.current.scrollTo({
          x: values.scrollPosition,
        });
      }
    };

    bar.current &&
      bar.current.measure((_, b, width) => {
        getTabWidth(width);
      });

    selectTab();
  }, [
    bar,
    hide,
    barWidth,
    getTabWidth,
    indicatorPosition,
    items.length,
    scrollView,
    scrollable,
    selectedIndex,
    tabWidth,
    barWidthPercentage
  ]);

  return (
    items && (
      <Bar
        ref={bar}
        barColor={barColor}
        barHeight={barHeight}
        onLayout={event => getTabWidth(event.nativeEvent.layout.width)}
      >
        <ScrollView
          horizontal
          ref={scrollView}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          scrollEnabled={scrollable}
        >
          <Indicator
            style={indicatorStyle}
            color={indicatorColor}
            value={translateX || indicatorPosition}
            tabWidth={!scrollable ? tabWidth : barWidth * barWidthPercentage}
            hide={hide}
          />
          <TabTrack barHeight={barHeight}>
            {items.map((item, idx) => (
              <Tab
                allowFontScaling={allowFontScaling}
                content={item}
                key={getKeyForTab(item) || undefined}
                onPress={() => onChange(idx)}
                active={idx === selectedIndex}
                activeTextColor={activeTextColor}
                textStyle={textStyle}
                activeTextStyle={selectedIndex === idx && activeTextStyle}
                tabHeight={barHeight}
                tabWidth={!scrollable ? tabWidth : barWidth * barWidthPercentage}
                uppercase={uppercase}
                inActiveTextColor={inactiveTextColor}
              />
            ))}
          </TabTrack>

        </ScrollView>
      </Bar>
    )
  );
};

MaterialTabs.defaultProps = {
  allowFontScaling: true,
  selectedIndex: 0,
  barColor: '#13897b',
  barHeight: constants.barHeight,
  activeTextColor: '#fff',
  indicatorColor: '#fff',
  inactiveTextColor: 'rgba(255, 255, 255, 0.7)',
  scrollable: false,
  uppercase: true,
  keyboardShouldPersistTaps: 'never',
};

export default MaterialTabs;
