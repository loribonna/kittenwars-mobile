import {
	GoogleSignin,
	User,
	statusCodes
} from '@react-native-community/google-signin';
import { CLIENT_ID } from 'react-native-dotenv';
import { post } from './crud';
import { BASE_URI } from './statics';
import { setJWTToken } from './helpers';

export class LoginService {
	async setup(): Promise<boolean> {
		GoogleSignin.configure({
			webClientId: CLIENT_ID,
			offlineAccess: true,
			hostedDomain: '',
			forceConsentPrompt: false
		});

		return await this.silentSignIn();
	}

	async finalizeAuth(userInfo: User): Promise<boolean> {
		try {
			const data: any = await post(
				BASE_URI + '/auth/google/token?id_token=' + userInfo.idToken
			);
			await setJWTToken(data.jwt);

			return true;
		} catch (e) {
			console.warn(e);
			return false;
		}
	}

	async _signIn(): Promise<boolean> {
		try {
			if (await GoogleSignin.hasPlayServices()) {
				const userInfo: User = await GoogleSignin.signIn();
				return await this.finalizeAuth(userInfo);
			} else {
				return false;
			}
		} catch (error) {
			// error.code = {SIGN_IN_CANCELLED|IN_PROGRESS|PLAY_SERVICES_NOT_AVAILABLE|...}
			if (error.code == statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
				throw error;
			}
			return false;
		}
	}

	async silentSignIn(): Promise<boolean> {
		try {
			const userInfo = await GoogleSignin.signInSilently();
			return await this.finalizeAuth(userInfo);
		} catch (error) {
			//error.code = {SIGN_IN_REQUIRED|...}
			if (error.code == statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
				throw error;
			}
		}
		return false;
	}
}
