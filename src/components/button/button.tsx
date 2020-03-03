import React from 'react';
import { Border } from '../border/border';
import { styleBase } from '../../helpers/style.base';
import { Button, StyleProp, ViewStyle } from 'react-native';

export const CustomButton: React.FunctionComponent<{
	onPress: () => void;
	title: string;
	disabled?: boolean;
	disabledColor?: string;
	style?: StyleProp<ViewStyle>;
}> = ({ onPress, title, disabled, disabledColor, style }) => {
	return (
		<Border
			style={[{ overflow: 'hidden', borderRadius: 7 }, style]}
			width={1.5}>
			<Button
				color={
					disabled
						? disabledColor
							? disabledColor
							: styleBase.neutralColor
						: styleBase.primaryColor
				}
				onPress={() => (!disabled ? onPress() : null)}
				title={title}
			/>
		</Border>
	);
};
