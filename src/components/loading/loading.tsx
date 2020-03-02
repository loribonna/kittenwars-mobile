import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { alignCenter, styleBase } from '../../helpers/style.base';

export const Loading: React.FunctionComponent<{}> = () => {
	const width = Dimensions.get('window').width;

	return (
		<View
			style={[
				alignCenter,
				{
					position: 'absolute',
					zIndex: 1000,
					backgroundColor: styleBase.primaryColor,
					width: '100%',
					height: '100%'
				}
			]}>
			<Text style={{ fontSize: width / 10, color: 'white' }}>
				LOADING..
			</Text>
		</View>
	);
};
