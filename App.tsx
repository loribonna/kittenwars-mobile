import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Kittens } from './src/screens/kittens/kittens';
import { User } from './src/screens/user/user';
import { Login } from './src/screens/login/login';
import { UnloggedScreen } from './src/screens/unlogged/unlogged';
import { getJWTToken } from './src/helpers/helpers';
import { get } from './src/helpers/crud';
import { IUser } from './src/helpers/interfaces';
import {
	createStackNavigator,
	StackNavigationProp
} from '@react-navigation/stack';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export type RootStackParamList = {
	Login: any;
	Logged: any;
	Unlogged: any;
};

export interface LoggedStackNavigationProp {
	stackNavigation: StackNavigationProp<RootStackParamList, 'Logged'>;
}
export interface UnoggedStackNavigationProp {
	stackNavigation: StackNavigationProp<RootStackParamList, 'Unlogged'>;
}

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

	async checkSession(): Promise<boolean> {
		try {
			const token = await getJWTToken();

			if (token) {
				await get('/auth/jwt_check', token);
				return true;
			}
		} catch (e) {
			console.log(e);
		}

		return false;
	}

	async checkAuth(valid: Boolean) {
		this.setState({ ...this.state, logged: valid });
	}

	redirectToLogin(navigation) {
		navigation.navigate('Login');
	}

	render() {
		return (
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Unlogged">
					<Stack.Screen
						options={({ navigation }) => ({
							headerRight: () => (
								<Button
									onPress={() =>
										this.redirectToLogin(navigation)
									}
									title="Login"
								/>
							)
						})}
						name="Unlogged"
						component={UnloggedScreen}
					/>
					<Stack.Screen name="Login" component={Login} />
					<Stack.Screen name="Logged" component={LoggedScreen} />
				</Stack.Navigator>
			</NavigationContainer>
		);
	}
}
