import { StyleSheet } from 'react-native';

export const styleBase = {
	primaryColor: '#fc6603',
	getPrimaryColorWithOpacity: opacity => `rgba(252, 102, 3,${opacity})`,
	secondaryColor: '#fca503',
	getSecondaryColorWithOpacity: opacity => `rgba(252, 165, 3,${opacity})`,
	complementaryColor: '#036bfc',
	neutralColor: '#eee',
	textColor: '#777',
	titleTextColor: 'black',
	secondaryTextColor: 'white'
};

export const mainBackgroundColor = styleBase.getSecondaryColorWithOpacity(0.7);

export const alignCenter = StyleSheet.create({
	center: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
}).center;

export const textStyle = StyleSheet.create({
	text: {
		color: styleBase.textColor,
		fontWeight: '300',
		fontSize: 20
	}
}).text;

export const clearTextStyle = StyleSheet.create({
	text: {
		color: styleBase.secondaryTextColor,
		fontWeight: '300',
		fontSize: 20
	}
}).text;

export const darkTextStyle = StyleSheet.create({
	text: {
		color: styleBase.titleTextColor,
		fontWeight: '300',
		fontSize: 20
	}
}).text;