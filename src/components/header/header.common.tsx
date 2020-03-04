import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { CustomButton } from '../button/button';

export const HeaderButton: React.FunctionComponent<{
	onPress: Function;
	title: string;
}> = ({ onPress, title }) => {
	return (
		<CustomButton
			style={{ marginRight: 10, borderRadius: 5 }}
			title={title}
			onPress={() => onPress()}
		/>
	);
};

export const HeaderTitle: React.FunctionComponent<{
	title: string;
	fontSize?: number;
}> = ({ title, fontSize = 20 }) => {
	return (
		<Text style={[style.headerTitle, { fontSize: fontSize }]}>{title}</Text>
	);
};

const style = StyleSheet.create({
	headerTitle: {
		fontWeight: '300'
	}
});
