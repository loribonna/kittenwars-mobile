import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

interface IconProps {
	name: String;
	onPress?: Function;
	opacity?: number;
}

const style = StyleSheet.create({
	container: {
		flex: 1
	},
	content: {
		alignItems: 'center',
		width: 30
	}
});

export const Icon: React.FunctionComponent<IconProps> = (
	props
): JSX.Element => {
	return (
		<View>
			{props.onPress && (
				<View style={style.container}>
					<TouchableOpacity
						onPress={() => props.onPress()}
						style={[
							style.content,
							{ opacity: props.opacity || 1 }
						]}>
						<Ionicons name={props.name} color="white" size={30} />
					</TouchableOpacity>
				</View>
			)}
			{!props.onPress && (
				<View style={style.container}>
					<Ionicons name={props.name} color="white" size={30} />
				</View>
			)}
		</View>
	);
};
