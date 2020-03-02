import { Pages } from './interfaces';
import AsyncStorage from '@react-native-community/async-storage';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { get } from './crud';
import { BASE_URI } from './statics';
import { CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import {
	GoogleSignin,
	statusCodes,
	User
} from '@react-native-community/google-signin';

export const getJWTToken = async () => {
	const token = await AsyncStorage.getItem('token');
	return token;
};

export const setJWTToken = async (token: string) => {
	await AsyncStorage.setItem('token', token);
};

const _removeJWTToken = async () => {
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
			console.log(e);
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

export const logout = async (navigation: any) => {
	try {
		//await GoogleSignin.revokeAccess();
		await _removeJWTToken();
		await GoogleSignin.signOut();

		overwriteNavigation(navigation, 'Unlogged');
	} catch (error) {
		console.log(error);
	}
};
