import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Kittens } from './src/screens/tabs/kittens/kittens';
import { User } from './src/screens/tabs/user/user';
import { Score } from './src/screens/tabs/score/score';
import { Login } from './src/screens/stack/login/login';
import { UnloggedScreen } from './src/screens/stack/unlogged/unlogged';
import { getJWTToken, overwriteNavigation } from './src/helpers/helpers';
import { get } from './src/helpers/crud';
import {
	createStackNavigator,
	StackNavigationProp
} from '@react-navigation/stack';
import { InsertKitten } from './src/screens/stack/insert/insert';
import { BASE_URI } from './src/helpers/statics';
import {
	HeaderButton,
	HeaderTitle
} from './src/components/header/header.common';
import { LoginService } from './src/helpers/login.service';

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
			<Tab.Screen
				options={{
					tabBarLabel: () => (
						<HeaderTitle fontSize={15} title="War!" />
					)
				}}
				name="Kittens"
				component={Kittens}
			/>
			<Tab.Screen
				options={{
					tabBarLabel: () => (
						<HeaderTitle fontSize={15} title="User" />
					)
				}}
				name="User"
				component={User}
			/>
			<Tab.Screen
				options={{
					tabBarLabel: () => (
						<HeaderTitle fontSize={15} title="Score" />
					)
				}}
				name="Score"
				component={Score}
			/>
		</Tab.Navigator>
	);
};

export default class App extends React.Component<AppProps, AppState> {
	_loginService: LoginService;
	_navigationRef: any;

	constructor(props) {
		super(props);
		this.state = { isAdmin: false, logged: false };
	}

	async componentDidMount() {
		this._loginService = new LoginService();
		const signed = await this._loginService.setup();

		if (signed && this._navigationRef) {
			overwriteNavigation(this._navigationRef, "Logged");
		}
	}

	async checkSession(): Promise<boolean> {
		try {
			const token = await getJWTToken();

			if (token) {
				await get(BASE_URI + '/auth/jwt_check', token);
				return true;
			}
		} catch (e) {
			console.warn(e);
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
			<NavigationContainer
				ref={ref => {
					this._navigationRef = ref;
				}}>
				<Stack.Navigator initialRouteName="Unlogged">
					<Stack.Screen
						options={({ navigation }) => ({
							headerRight: () => (
								<HeaderButton
									title="login"
									onPress={() =>
										this.redirectToLogin(navigation)
									}
								/>
							),

							headerTitle: () => (
								<HeaderTitle title={'Best Kitten!'} />
							)
						})}
						name="Unlogged"
						component={UnloggedScreen}
					/>

					<Stack.Screen
						name="Login"
						options={{
							headerTitle: () => <HeaderTitle title={'Login'} />
						}}
						children={({navigation}) => (
							<Login navigation={navigation} loginService={this._loginService} />
						)}
					/>
					<Stack.Screen
						name="Logged"
						component={LoggedScreen}
						initialParams={({ navigation }) => ({
							stackNavigation: navigation
						})}
						options={({ navigation }) => ({
							headerRight: () => (
								<HeaderButton
									title="logout"
									onPress={() =>
										this._loginService.logout(navigation)
									}
								/>
							),
							headerTitle: () => (
								<HeaderTitle title={'Kittenwars!'} />
							)
						})}
					/>
					<Stack.Screen
						name="Insert"
						component={InsertKitten}
						options={{
							headerTitle: () => (
								<HeaderTitle title={'Insert Kitten!'} />
							)
						}}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		);
	}
}
