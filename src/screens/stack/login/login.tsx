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
import { LoginService } from '../../../helpers/login.service';

interface LoginProps {
	navigation: StackNavigationProp<RootStackParamList, 'Login'>;
	loginService: LoginService;
}

interface LoginState {
	isSigninInProgress: boolean;
	error: boolean;
}

export class Login extends React.Component<LoginProps, LoginState> {
	constructor(props) {
		super(props);
		this.state = {
			isSigninInProgress: false,
			error: false
		};
	}

	_redirectToLoggedArea() {
		overwriteNavigation(this.props.navigation, 'Logged');
	}

	async signIn() {
		try {
			this.setState({ ...this.state, isSigninInProgress: true });
			const signed = await this.props.loginService._signIn();

			if (signed) {
				this._redirectToLoggedArea();
			} else {
				this.setState({ ...this.state, isSigninInProgress: false });
			}
		} catch (error) {
			// error.code = {SIGN_IN_CANCELLED|IN_PROGRESS|PLAY_SERVICES_NOT_AVAILABLE|...}
			this.setState({ ...this.state, error: true });
			console.warn(error);
		}
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
							onPress={this.signIn.bind(this)}
							disabled={this.state.isSigninInProgress}
						/>

						{this.state.error && (
							<Text>Google Play services unavaiable</Text>
						)}
					</View>
				</View>
			</View>
		);
	}
}
