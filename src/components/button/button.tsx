import React from 'react';
import { Border } from '../border/border';
import { styleBase } from '../../helpers/style.base';
import { Button, StyleProp, ViewStyle } from 'react-native';

export const CustomButton: React.FunctionComponent<{
	onPress: () => void;
	title: string;
	style?: StyleProp<ViewStyle>;
}> = ({ onPress, title, style }) => {
	return (
		<Border style={[{ overflow: 'hidden', borderRadius:7 }, style]} width={1.5}>
			<Button
				color={styleBase.primaryColor}
				onPress={() => onPress()}
				title={title}
			/>
		</Border>
	);
};
