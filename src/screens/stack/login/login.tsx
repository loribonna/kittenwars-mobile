import * as React from 'react';
import { post } from '../../../helpers/crud';
import { View, Text, Button, StyleSheet } from 'react-native';
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
import { CLIENT_ID } from 'react-native-dotenv';
import { styleBase, alignCenter } from '../../../helpers/style.base';

interface LoginProps {
	navigation: StackNavigationProp<RootStackParamList, 'Login'>;
}

interface LoginState {
	isSigninInProgress: boolean;
	googlePlayMissing: boolean;
	error: boolean;
}

export class Login extends React.Component<LoginProps, LoginState> {
	constructor(props) {
		super(props);
		this.state = {
			isSigninInProgress: false,
			googlePlayMissing: false,
			error: false
		};
	}

	async componentDidMount() {
		GoogleSignin.configure({
			webClientId: CLIENT_ID,
			offlineAccess: true,
			hostedDomain: '',
			forceConsentPrompt: false
		});

		await this.getCurrentUserInfo();
	}

	_redirectToLoggedArea() {
		overwriteNavigation(this.props.navigation, 'Logged');
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
			if (await GoogleSignin.hasPlayServices()) {
				const userInfo: User = await GoogleSignin.signIn();
				await this.finalizeAuth(userInfo);
			} else {
				this.setState({
					...this.state,
					googlePlayMissing: true,
					isSigninInProgress: false
				});
				return;
			}
		} catch (error) {
			// error.code = {SIGN_IN_CANCELLED|IN_PROGRESS|PLAY_SERVICES_NOT_AVAILABLE|...}
			if (error.code == statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
				this.setState({ ...this.state, error: true });
				return;
			}
			console.log(error);
		} finally {
			this.setState({ ...this.state, isSigninInProgress: false });
		}
	}

	async getCurrentUserInfo() {
		this.setState({ ...this.state, isSigninInProgress: true });

		try {
			const userInfo = await GoogleSignin.signInSilently();
			if (userInfo) {
				await this.finalizeAuth(userInfo);
			}
		} catch (error) {
			//error.code = {SIGN_IN_REQUIRED|...}
			if (error.code == statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
				this.setState({ ...this.state, error: true });
			}
		}
		this.setState({ ...this.state, isSigninInProgress: false });
	}

	render() {
		return (
			<View style={alignCenter}>
				<View
					style={{
						borderRadius: 20,
						overflow: 'hidden',
						height: '80%',
						width: '80%',
						backgroundColor: styleBase.neutralColor,
						justifyContent: 'center',
						alignItems: 'center'
					}}>
					<View style={[alignCenter, { width: '80%', height: null }]}>
						<Text>Login to Kittenwars!</Text>
						<Text>Access all the awesome features!</Text>

						<GoogleSigninButton
							style={{ width: '100%' }}
							size={GoogleSigninButton.Size.Wide}
							color={GoogleSigninButton.Color.Dark}
							onPress={this._signIn.bind(this)}
							disabled={this.state.isSigninInProgress}
						/>

						{this.state.error && (
							<Text>Google Play services unavaiable</Text>
						)}
						{this.state.googlePlayMissing && (
							<Text>Need Google Play to access!</Text>
						)}
					</View>
				</View>
			</View>
		);
	}
}
