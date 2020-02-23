import * as React from 'react';
import { getJWTToken, redirectToLogin } from '../../helpers/helpers';
import { get, post } from '../../helpers/crud';
import { IUser, IKitten } from '../../helpers/interfaces';
import { CreateImageDto } from '../../helpers/dto/create-image';
import { View, Text, Button } from 'react-native';
import { BASE_URI } from '../../helpers/statics';
import {
	GoogleSignin,
	GoogleSigninButton,
	statusCodes
} from '@react-native-community/google-signin';

interface LoginProps {}

interface LoginState {
	loggedIn: boolean;
	userInfo?: any;
	isSigninInProgress: boolean;
}

export class Login extends React.Component<LoginProps, LoginState> {
	constructor(props) {
		super(props);
		this.state = { isSigninInProgress: false, loggedIn: false };
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

	async _signIn() {
		try {
			await GoogleSignin.hasPlayServices();
			const userInfo = await GoogleSignin.signIn();
			this.setState({
				...this.state,
				userInfo: userInfo,
				loggedIn: true
			});
		} catch (error) {
			console.log(error);
			if (error.code === statusCodes.SIGN_IN_CANCELLED) {
				// user cancelled the login flow
			} else if (error.code === statusCodes.IN_PROGRESS) {
				// operation (f.e. sign in) is in progress already
			} else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
				// play services not available or outdated
			} else {
				// some other error happened
			}
		}
	}

	async signOut() {
		try {
			await GoogleSignin.revokeAccess();
			await GoogleSignin.signOut();
			this.setState({ ...this.state, userInfo: null, loggedIn: false });
		} catch (error) {
			console.error(error);
		}
	}

	async getCurrentUserInfo() {
		try {
			const userInfo = await GoogleSignin.signInSilently();
			this.setState({
				...this.state,
				userInfo: userInfo,
				loggedIn: userInfo != null ? true : false
			});
		} catch (error) {
			if (error.code === statusCodes.SIGN_IN_REQUIRED) {
				// user has not signed in yet
				this.setState({ ...this.state, loggedIn: false });
			} else {
				// some other error
				this.setState({ ...this.state, loggedIn: false });
			}
		}
	}

	async handleOAuthLogin() {}

	render() {
		return (
			<View>
				{!this.state.loggedIn && (
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
				)}

				{this.state.loggedIn && (
					<View>
						<Button
							onPress={this.signOut.bind(this)}
							title="Signout"
							color="#841584"></Button>
					</View>
				)}
			</View>
		);
	}
}
