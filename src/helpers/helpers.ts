import AsyncStorage from '@react-native-community/async-storage';
import { get } from './crud';
import { BASE_URI } from './statics';
import { CommonActions } from '@react-navigation/native';

export const getJWTToken = async () => {
	const token = await AsyncStorage.getItem('token');
	return token;
};

export const setJWTToken = async (token: string) => {
	await AsyncStorage.setItem('token', token);
};

export const removeJWTToken = async () => {
	await AsyncStorage.removeItem('token');
};

export const checkJWTToken = async (token: string): Promise<boolean> => {
	try {
		if (token) {
			await get(BASE_URI + '/auth/jwt_check', token);
			return true;
		}
	} catch (e) {
		if (e.status != 401) {
			console.warn(e);
		}
	}
	return false;
};

export const overwriteNavigation = (navigation: any, route: string) => {
	navigation.dispatch(
		CommonActions.reset({
			index: 0,
			routes: [{ name: route }]
		})
	);
};
