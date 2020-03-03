import React from 'react';
import { View, LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';

export const Border: React.FunctionComponent<React.PropsWithChildren<{
	opacity?: string | number;
	width?: number;
	style?: StyleProp<ViewStyle>;
	onLayout?: (e: LayoutChangeEvent) => void;
}>> = props => {
	return (
		<View
			style={[
				{
					borderRightColor: `rgba(0,0,0,${
						props.opacity ? props.opacity : '0.1'
					})`,
					borderBottomColor: `rgba(0,0,0,${
						props.opacity ? props.opacity : '0.1'
					})`,
					borderTopWidth: 0,
					borderLeftWidth: 0,
					borderWidth: props.width ? props.width : 2
				},
				props.style
			]}
			onLayout={e => (props.onLayout ? props.onLayout(e) : null)}>
			{props.children}
		</View>
	);
};
