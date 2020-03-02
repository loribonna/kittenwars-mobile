import { StyleSheet } from 'react-native';

export const styleBase = {
	primaryColor: '#fc6603',
	secondaryColor: '#03fc94',
	complementaryColor: '#036bfc',
	neutralColor: '#eee',
	textColor: '#777'
};

export const alignCenter = StyleSheet.create({
	center: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
}).center;


export const textStyle = StyleSheet.create({
	text:{
		color:styleBase.textColor,
		fontWeight:"300",
		fontSize:20
	}
}).text;