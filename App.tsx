import React from 'react';
import { Button, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Kittens } from './src/screens/tabs/kittens/kittens';
import { User } from './src/screens/tabs/user/user';
import { Score } from './src/screens/tabs/score/score';
import { Login } from './src/screens/stack/login/login';
import { UnloggedScreen } from './src/screens/stack/unlogged/unlogged';
import { getJWTToken, logout } from './src/helpers/helpers';
import { get } from './src/helpers/crud';
import {
	createStackNavigator,
	StackNavigationProp
} from '@react-navigation/stack';
import { InsertKitten } from './src/screens/stack/insert/insert';
import { BASE_URI } from './src/helpers/statics';
import { styleBase } from './src/helpers/style.base';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export type RootStackParamList = {
	Login: any;
	Logged: any;
	Unlogged: any;
	Insert: any;
};

interface AppProps {}
interface AppState {
	logged: Boolean;
	isAdmin: Boolean;
}

const LoggedScreen: React.FunctionComponent<{
	navigation: StackNavigationProp<RootStackParamList, 'Logged'>;
}> = ({ navigation }): JSX.Element => {
	return (
		<Tab.Navigator>
			<Tab.Screen name="Kittens" component={Kittens} />
			<Tab.Screen name="User" component={User} />
			<Tab.Screen name="Score" component={Score} />
		</Tab.Navigator>
	);
};

export default class App extends React.Component<AppProps, AppState> {
	constructor(props) {
		super(props);
		this.state = { isAdmin: false, logged: false };
	}

	async checkSession(): Promise<boolean> {
		try {
			const token = await getJWTToken();

			if (token) {
				await get(BASE_URI + '/auth/jwt_check', token);
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
								<View style={{ paddingRight: 10 }}>
									<Button
										onPress={() =>
											this.redirectToLogin(navigation)
										}
										title="Login"
									/>
								</View>
							),
							headerTitle: 'Best Kitten!'
						})}
						name="Unlogged"
						component={UnloggedScreen}
					/>

					<Stack.Screen name="Login" component={Login} />
					<Stack.Screen
						name="Logged"
						component={LoggedScreen}
						initialParams={({ navigation }) => ({
							stackNavigation: navigation
						})}
						options={({ navigation }) => ({
							headerRight: () => (
								<View style={{ paddingRight: 10 }}>
									<Button
										color={styleBase.primaryColor}
										onPress={() => logout(navigation)}
										title="Logout"
									/>
								</View>
							),
							headerTitle: 'Kittenwars!'
						})}
					/>
					<Stack.Screen
						name="Insert"
						component={InsertKitten}
						options={{ headerTitle: 'Insert Kitten!' }}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		);
	}
}
