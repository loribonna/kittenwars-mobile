import React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { styleBase } from '../../helpers/style.base';

export const HeaderButton: React.FunctionComponent<{
	onPress: Function;
	title: string;
}> = ({ onPress, title }) => {
	return (
		<View style={{ paddingRight: 10 }}>
			<Button
				color={styleBase.primaryColor}
				onPress={() => onPress()}
				title={title}
			/>
		</View>
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
