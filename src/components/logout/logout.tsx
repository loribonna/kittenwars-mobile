import React from 'react';
import { GoogleSignin } from '@react-native-community/google-signin';

export default function Logout({ navigation }) {
    const _ = async () => {
		try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
        } catch (error) {
            console.error(error);
        }
    };
    
    React.useEffect(() => {
		_();
	}, []);

    return null;
}