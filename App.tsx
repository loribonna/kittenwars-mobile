import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Kittens } from './src/screens/kittens/kittens';
import { User } from './src/screens/user/user';
import { Login } from './src/screens/login/login';

const Tab = createBottomTabNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Tab.Navigator>
				<Tab.Screen name="Kittens" component={Kittens} />
				<Tab.Screen name="User" component={User} />
				<Tab.Screen name="Login" component={Login} />
			</Tab.Navigator>
		</NavigationContainer>
	);
}
