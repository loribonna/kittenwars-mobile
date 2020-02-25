import { Pages } from './interfaces';
import AsyncStorage from '@react-native-community/async-storage';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { get } from './crud';
import { BASE_URI } from './statics';

export const getJWTToken = async () => {
	const token = await AsyncStorage.getItem('token');
	return token;
};

export const setJWTToken = async (token: string) => {
	await AsyncStorage.setItem('token', token);
};

export const checkJWTToken = async (token: string): Promise<boolean> => {
	try {
		if (token) {
			await get(BASE_URI + '/auth/jwt_check', token);
			return true;
		}
	} catch (e) {
		if(e.status!=401){
			console.log(e);
		}
	}
	return false;
};
