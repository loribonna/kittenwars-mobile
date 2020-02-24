import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Kittens } from './src/screens/kittens/kittens';
import { User } from './src/screens/user/user';
import { Login } from './src/screens/login/login';
import { getJWTToken } from './src/helpers/helpers';
import { get } from './src/helpers/crud';
import { IUser } from './src/helpers/interfaces';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export type RootStackParamList = {
	LoggedOut: any;
	LoggedIn: any;
};

interface AppProps {}
interface AppState {
	logged: Boolean;
	isAdmin: Boolean;
}

const LoggedScreen: React.FunctionComponent<{}> = (): JSX.Element => {
	return (
		<Tab.Navigator>
			<Tab.Screen name="Kittens" component={Kittens} />
			<Tab.Screen name="User" component={User} />
		</Tab.Navigator>
	);
};

export default class App extends React.Component<AppProps, AppState> {
	constructor(props) {
		super(props);
		this.state = { isAdmin: false, logged: false };
	}

	async componentDidMount() {
		const hasSession = await this.checkSession();
		this.setState({ ...this.state, logged: hasSession });
	}

	async checkAdmin(token?: string): Promise<void> {
		const t = token ? token : await getJWTToken();
		const userInfo: IUser = await get('/users', t);
		if (userInfo.isAdmin) {
			this.setState({ ...this.state, isAdmin: true });
		}
	}

	async checkSession(): Promise<boolean> {
		let ret = false;
		try {
			const token = await getJWTToken();

			if (token) {
				await get('/auth/jwt_check', token);
				ret = true;
				await this.checkAdmin(token);
			}
		} catch (e) {
			console.log(e);
		}

		return ret;
	}

	async checkAuth(valid: Boolean) {
		console.log(valid);
		this.setState({ ...this.state, logged: valid });
		await this.checkAdmin();
	}

	render() {
		return (
			<NavigationContainer>
				<Stack.Navigator initialRouteName="LoggedOut">
					<Stack.Screen name="LoggedOut" component={Login} />
					<Stack.Screen name="LoggedIn" component={LoggedScreen} />
				</Stack.Navigator>
			</NavigationContainer>
		);
	}
}
