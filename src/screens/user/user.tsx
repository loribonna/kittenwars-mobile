import * as React from 'react';
import { getJWTToken } from '../../helpers/helpers';
import { get, post } from '../../helpers/crud';
import { IUser, IKitten } from '../../helpers/interfaces';
import { View, Text } from 'react-native';
import { LoggedStackNavigationProp } from '../../../App';

interface UserProps extends LoggedStackNavigationProp {}

interface UserState {
	userScore: Number;
	scoreBoard: IUser[];
	userPosition: Number;
	fileUpl?: File;
	fileOk?: boolean;
}

function UserElement(user: IUser) {
	return (
		<ul className="user-element">
			<li>{user.username}</li>
			<li>{user.score}</li>
		</ul>
	);
}

export class User extends React.Component<UserProps, UserState> {
	constructor(props) {
		super(props);
		this.state = {
			fileUpl: undefined,
			userScore: 0,
			scoreBoard: [],
			userPosition: -1
		};
	}

	async componentDidMount() {
		// await Promise.all([
		// 	this.loadUserScore(),
		// 	this.loadScoreBoard(),
		// 	this.getUserBoaardPosition()
		// ]);
	}

	async loadUserScore() {
		try {
			const token = await getJWTToken();

			const score = await get('/users/score', token);
			this.setState({ ...this.state, userScore: score });
		} catch (e) {
			if (e.status === 401) {
				this.props.stackNavigation.replace('Unlogged')
			}
		}
	}

	async loadScoreBoard() {
		try {
			const token = await getJWTToken();

			const board = await get('/users/board', token);
			this.setState({ ...this.state, scoreBoard: board });
		} catch (e) {
			if (e.status === 401) {
				this.props.stackNavigation.replace('Unlogged')
			}
		}
	}

	async getUserBoaardPosition() {
		try {
			const token = await getJWTToken();

			const position = await get('/users/position', token);
			this.setState({ ...this.state, userPosition: position });
		} catch (e) {
			if (e.status === 401) {
				this.props.stackNavigation.replace('Unlogged')
			}
		}
	}

	async insertNewKitten(event) {
		event.preventDefault();

		if (!this.state.fileUpl) {
			return;
		}
		try {
			const token = await getJWTToken();

			const formData = new FormData();
			formData.append('image', this.state.fileUpl);

			const insertedKitten: IKitten = await post(
				'/kittens',
				formData,
				token
			);
			this.setState({ ...this.state, fileUpl: undefined, fileOk: true });
		} catch (e) {
			this.setState({ ...this.state, fileOk: false });

			if (e.status === 401) {
				this.props.stackNavigation.replace('Unlogged')
			}
		}
	}

	onFileChange(event) {
		if (
			!event.target ||
			!event.target.files ||
			event.target.files.length < 0 ||
			!event.target.files[0]
		) {
			this.setState({ ...this.state, fileUpl: undefined });
		} else {
			this.setState({ ...this.state, fileUpl: event.target.files[0] });
		}
	}

	render() {
		return (
			<View>
				{/* <form
					encType="multipart/form-data"
					onSubmit={this.insertNewKitten.bind(this)}>
					file input:{' '}
					<input
						type="file"
						name="image"
						onChange={this.onFileChange.bind(this)}
					/>
					<br />
					<input type="submit" value="INSERT KITTEN" />
					<br />
					{this.state.fileOk != null &&
						this.state.fileOk &&
						'UPLOAD OK'}
					{this.state.fileOk != null &&
						!this.state.fileOk &&
						'UPLOAD ERROR'}
				</form>
				<br />
				<br /> */}
				<Text>USER SCORE {this.state.userScore}</Text>
				<Text>USER POSITION {this.state.userPosition}</Text>
				<Text>SCORE BOARD:</Text>
				{/* <ul className="score-board-container">
					{this.state.scoreBoard.map((user, index) => {
						return <li key={index}>{UserElement(user)}</li>;
					})}
				</ul> */}
			</View>
		);
	}
}
