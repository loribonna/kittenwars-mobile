import { LOGIN_URI, DEFAULT_URI } from './statics';
import { Pages, UnloggedPages, LoggedPages } from './interfaces';
import { AsyncStorage } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export const getJWTToken = async () => {
	const token = await AsyncStorage.getItem('token');
	return token;
};

export const redirectToLogin = ({ navigation }: BottomTabBarProps) => {
	navigation.navigate(Pages.login);
};

export const redirectToDefault = ({ navigation }: BottomTabBarProps) => {
	navigation.navigate(Pages.score);
};
