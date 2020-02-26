import * as React from 'react';
import { getJWTToken, overwriteNavigation } from '../../../helpers/helpers';
import { get, post } from '../../../helpers/crud';
import { IUser } from '../../../helpers/interfaces';
import { View, Text, FlatList, Button, Image } from 'react-native';
import { BASE_URI } from '../../../helpers/statics';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../App';
import { TakePictureResponse } from 'react-native-camera';

interface UserProps {
	navigation: StackNavigationProp<RootStackParamList, 'Logged'>;
}

interface UserState {
	userScore: Number;
	scoreBoard: IUser[];
	userPosition: Number;
	fileUpl?: File;
	fileOk?: boolean;
	loading: boolean;
	image?: string;
}

interface UserElementProp {
	user: IUser;
	index: number;
}

const UserElement: React.FunctionComponent<UserElementProp> = ({
	user,
	index
}) => {
	const color = index % 2 ? 'lightblue' : 'cyan';
	return (
		<View style={{ paddingLeft: 20, backgroundColor: color }}>
			<Text>Username: {user.username}</Text>
			<Text>Score: {user.score}</Text>
		</View>
	);
};

export class User extends React.Component<UserProps, UserState> {
	constructor(props) {
		super(props);
		this.state = {
			fileUpl: undefined,
			userScore: 0,
			scoreBoard: [],
			userPosition: -1,
			loading: false
		};
	}

	async componentDidMount() {
		this.setState({ ...this.state, loading: true });
		await Promise.all([
			this.loadUserScore(),
			this.loadScoreBoard(),
			this.getUserBoaardPosition()
		]);

		this.setState({ ...this.state, loading: false });
	}

	async loadUserScore() {
		try {
			const token = await getJWTToken();

			const score = await get(BASE_URI + '/users/score', token);
			this.setState({ ...this.state, userScore: score });
		} catch (e) {
			if (e.status === 401) {
				overwriteNavigation(this.props.navigation, 'Unlogged');
			}
		}
	}

	async loadScoreBoard() {
		try {
			const token = await getJWTToken();

			const board = await get(BASE_URI + '/users/board', token);
			this.setState({ ...this.state, scoreBoard: board });
		} catch (e) {
			if (e.status === 401) {
				overwriteNavigation(this.props.navigation, 'Unlogged');
			}
		}
	}

	async getUserBoaardPosition() {
		try {
			const token = await getJWTToken();

			const position = await get(BASE_URI + '/users/position', token);
			this.setState({ ...this.state, userPosition: position });
		} catch (e) {
			if (e.status === 401) {
				overwriteNavigation(this.props.navigation, 'Unlogged');
			}
		}
	}

	async insertNewKitten(event) {
		// event.preventDefault();
		// if (!this.state.fileUpl) {
		// 	return;
		// }
		// try {
		// 	const token = await getJWTToken();
		// 	const formData = new FormData();
		// 	formData.append('image', this.state.fileUpl);
		// 	const insertedKitten: IKitten = await post(
		// 		'/kittens',
		// 		formData,
		// 		token
		// 	);
		// 	this.setState({ ...this.state, fileUpl: undefined, fileOk: true });
		// } catch (e) {
		// 	this.setState({ ...this.state, fileOk: false });
		// 	if (e.status === 401) {
		// 		overwriteNavigation(this.props.stackNavigation, 'Unlogged')
		// 	}
		// }
	}

	// onFileChange(event) {
	// 	// if (
	// 	// 	!event.target ||
	// 	// 	!event.target.files ||
	// 	// 	event.target.files.length < 0 ||
	// 	// 	!event.target.files[0]
	// 	// ) {
	// 	// 	this.setState({ ...this.state, fileUpl: undefined });
	// 	// } else {
	// 	// 	this.setState({ ...this.state, fileUpl: event.target.files[0] });
	// 	// }
	// }

	onGoBack(data: TakePictureResponse) {
		if (data && data.uri) {
			this.setState({ ...this.state, image: data.uri });
		}
	}

	goToCamera() {
		this.props.navigation.navigate('Camera', {
			onGoBack: this.onGoBack.bind(this)
		});
	}

	render() {
		return (
			<View>
				<Button onPress={this.goToCamera.bind(this)} title="Camera" />
				{this.state.image && (
					<Image
						style={{
							height: '60%',
							width: null,
							resizeMode: 'contain'
						}}
						source={{ uri: this.state.image }}
					/>
				)}
				{this.state.loading && <Text>Loading user data...</Text>}
				{!this.state.loading && (
					<View style={{ paddingTop: 10 }}>
						<Text>USER SCORE {this.state.userScore}</Text>
						<Text>USER POSITION {this.state.userPosition}</Text>
						<Text>SCORE BOARD:</Text>
						<FlatList
							data={this.state.scoreBoard}
							renderItem={({ item, index }) => (
								<UserElement
									key={item.account.id as string}
									user={item}
									index={index}
								/>
							)}
							keyExtractor={(item, index) =>
								item.account.id.toString()
							}
						/>
					</View>
				)}
			</View>
		);
	}
}
