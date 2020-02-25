import * as React from 'react';
import { ImageDisplay } from '../../components/image/image';
import { get, put } from '../../helpers/crud';
import { VOTE_URI } from '../../helpers/statics';
import { IKitten } from '../../helpers/interfaces';
import {
	getJWTToken
} from '../../helpers/helpers';
import { View, Text, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, LoggedStackNavigationProp } from '../../../App';

interface KittensProps extends BottomTabBarProps, LoggedStackNavigationProp {}

interface KittensState {
	leftKitten?: IKitten;
	rightKitten?: IKitten;
	win?: boolean;
	loading: boolean;
	empty: boolean;
}

export class Kittens extends React.Component<KittensProps, KittensState> {
	_mounted = false;
	_disableClick = false;
	constructor(props) {
		super(props);
		this.state = { loading: false, empty: false };
	}

	async componentDidMount() {
		this._mounted = true;
		await this.loadRandomKittens();
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	async loadRandomKittens() {
		let newState = { loading: false };
		this.setState({ ...this.state, loading: true });
		try {
			const token = await getJWTToken();

			const kittens: IKitten[] = await get(VOTE_URI, token);
			if (Array.isArray(kittens)) {
				if (kittens.length == 2) {
					newState = Object.assign(newState, {
						leftKitten: kittens[0],
						rightKitten: kittens[1]
					});
				} else {
					newState = Object.assign(newState, {
						empty: true
					});
				}
			}
		} catch (e) {
			if (e.status === 401) {
				this.props.stackNavigation.replace("Unlogged");
			}
		} finally {
			this.setState({ ...this.state, ...newState });
		}
	}

	async voteKitten(kittenSavedName: String) {
		this._disableClick = true;
		if (!this.state.leftKitten || !this.state.rightKitten) {
			console.error(
				'Kitten vote error: kitten ' +
					kittenSavedName +
					' does not exist'
			);
			return;
		}
		const votedKitten =
			this.state.leftKitten?.savedName === kittenSavedName
				? this.state.leftKitten
				: this.state.rightKitten;

		const vote = {
			kittenVoted: votedKitten._id,
			kittenA: this.state.leftKitten._id,
			kittenB: this.state.rightKitten._id
		};

		try {
			const token = await getJWTToken();

			const win: boolean = await put(VOTE_URI, vote, token);
			await this.loadRandomKittens();
			this._disableClick = false;

			this.setState({ ...this.state, win: win });
		} catch (e) {
			if (e.status === 401) {
				this.props.stackNavigation.replace("Unlogged");
			}
		}
	}

	render() {
		return (
			<View>
				{this.state.loading && <Text>Loading random kittens...</Text>}
				{!this.state.loading && this.state.empty && (
					<Text>No kittens to load - INSERT KITTEN</Text>
				)}
				<View style={{ height: '100%' }}>
					{this.state.leftKitten && (
						<View style={{ height: '50%', width: null }}>
							<ImageDisplay
								key={this.state.leftKitten.savedName as string}
								imageID={this.state.leftKitten.savedName}
								onClick={this.voteKitten.bind(
									this
								)}></ImageDisplay>
						</View>
					)}
					{this.state.rightKitten && (
						<View style={{ height: '50%', width: null }}>
							<ImageDisplay
								key={this.state.rightKitten.savedName as string}
								imageID={this.state.rightKitten.savedName}
								onClick={this.voteKitten.bind(
									this
								)}></ImageDisplay>
						</View>
					)}
				</View>

				{this.state.win != null && this.state.win && <Text>WIN</Text>}
				{this.state.win != null && !this.state.win && <Text>LOSE</Text>}
			</View>
		);
	}
}
