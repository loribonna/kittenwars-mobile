import * as React from 'react';
import { post } from '../../../helpers/crud';
import { View, Text, Button } from 'react-native';
import { BASE_URI } from '../../../helpers/statics';
import {
	GoogleSignin,
	GoogleSigninButton,
	statusCodes,
	User
} from '@react-native-community/google-signin';
import { setJWTToken, overwriteNavigation } from '../../../helpers/helpers';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../App';

interface LoginProps {
	navigation: StackNavigationProp<RootStackParamList, 'Login'>;
}

interface LoginState {
	isSigninInProgress: boolean;
}

export class Login extends React.Component<LoginProps, LoginState> {
	constructor(props) {
		super(props);
		this.state = { isSigninInProgress: false };
	}

	async componentDidMount() {
		GoogleSignin.configure({
			webClientId:
				'662468816604-hn0bs6a3g09oietos8peq12firir4sk3.apps.googleusercontent.com',
			offlineAccess: true,
			hostedDomain: '',
			forceConsentPrompt: true
		});

		await this.getCurrentUserInfo();
	}

	_redirectToLoggedArea() {
		overwriteNavigation(this.props.navigation, "Logged");
	}

	async finalizeAuth(userInfo: User) {
		try {
			const data: any = await post(
				BASE_URI + '/auth/google/token?id_token=' + userInfo.idToken
			);
			await setJWTToken(data.jwt);

			this._redirectToLoggedArea();
		} catch (e) {
			console.error(e);
		}
	}

	async _signIn() {
		try {
			this.setState({ ...this.state, isSigninInProgress: true });
			await GoogleSignin.hasPlayServices();
			const userInfo: User = await GoogleSignin.signIn();
			await this.finalizeAuth(userInfo);
		} catch (error) {
			// error.code = {SIGN_IN_CANCELLED|IN_PROGRESS|PLAY_SERVICES_NOT_AVAILABLE|...}
			console.log(error);
		} finally {
			this.setState({ ...this.state, isSigninInProgress: false });
		}
	}

	async getCurrentUserInfo() {
		try {
			this.setState({ ...this.state, isSigninInProgress: true });
			const userInfo = await GoogleSignin.signInSilently();
			await this.finalizeAuth(userInfo);
		} catch (error) {
			//error.code = {SIGN_IN_REQUIRED|...}
			console.log(error);
		} finally {
			this.setState({ ...this.state, isSigninInProgress: false });
		}
	}

	render() {
		return (
			<View>
				<Text>You are currently logged out</Text>

				<GoogleSigninButton
					style={{ width: 192, height: 48 }}
					size={GoogleSigninButton.Size.Wide}
					color={GoogleSigninButton.Color.Dark}
					onPress={this._signIn.bind(this)}
					disabled={this.state.isSigninInProgress}
				/>
			</View>
		);
	}
}
