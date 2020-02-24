import { Pages } from './interfaces';
import AsyncStorage from '@react-native-community/async-storage';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { get } from './crud';

export const getJWTToken = async () => {
	const token = await AsyncStorage.getItem('token');
	return token;
};

export const setJWTToken = async (token: string) => {
	await AsyncStorage.setItem('token', token);
};

export const redirectToLogin = ({ navigation }: BottomTabBarProps) => {
	navigation.navigate(Pages.login);
};

export const redirectToDefault = ({ navigation }: BottomTabBarProps) => {
	navigation.navigate(Pages.score);
};

export const checkJWTToken = async (token: string): Promise<boolean> => {
	try {
		if (token) {
			await get('/auth/jwt_check', token);
			return true;
		}
	} catch (e) {
		console.log(e);
	}
	return false;
};
