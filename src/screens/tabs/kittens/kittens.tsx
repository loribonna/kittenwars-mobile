import * as React from 'react';
import { ImageDisplay } from '../../../components/image/image';
import { get, put } from '../../../helpers/crud';
import { VOTE_URI } from '../../../helpers/statics';
import { IKitten } from '../../../helpers/interfaces';
import { getJWTToken, overwriteNavigation } from '../../../helpers/helpers';
import {
	View,
	Text,
	Dimensions,
	StyleSheet,
	LayoutRectangle
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Loading } from '../../../components/loading/loading';
import { styleBase, textStyle } from '../../../helpers/style.base';

interface KittensProps extends BottomTabBarProps {}

interface KittensState {
	leftKitten?: IKitten;
	rightKitten?: IKitten;
	win?: boolean;
	empty: boolean;
	loading: boolean;
	viewSize?: LayoutRectangle;
	showScore: boolean;
}

const SCORE_TIMEOUT = 500;

export class Kittens extends React.Component<KittensProps, KittensState> {
	_mounted = false;
	_disableClick = false;
	_loadingRef: Loading;
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			empty: false,
			showScore: false
		};
	}

	async componentDidMount() {
		this._mounted = true;
		await this.loadRandomKittens();
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	async loadRandomKittens() {
		let newState = {};
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
				overwriteNavigation(this.props.navigation, 'Unlogged');
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
			this.setState({ ...this.state, win: win });

			this.scoreTimeout();
			await this.loadRandomKittens();
			this._disableClick = false;
		} catch (e) {
			if (e.status === 401) {
				overwriteNavigation(this.props.navigation, 'Unlogged');
			}
		}
	}

	measureView(layout: LayoutRectangle) {
		this.setState({
			...this.state,
			viewSize: layout
		});
	}

	onLoadStart() {
		this.setState({
			...this.state,
			loading: true
		});
	}

	onLoadEnd() {
		this.setState({
			...this.state,
			loading: false
		});
	}

	onKittenImageChangeEnd() {
		this._loadingRef.onFeatureChangeEnd();
	}

	onKittenImageChangeStart() {
		this._loadingRef.onFeatureChangeStart();
	}

	scoreTimeout() {
		this.setState({ ...this.state, showScore: true });
		setTimeout(() => {
			this.setState({ ...this.state, showScore: false });
		}, SCORE_TIMEOUT);
	}

	render() {
		const height = this.state.viewSize ? this.state.viewSize.height : 0;

		return (
			<View
				onLayout={e => this.measureView(e.nativeEvent.layout)}
				style={{ flex: 1 }}>
				<Loading
					featuresNumber={2}
					getRef={ref => (this._loadingRef = ref)}
				/>
				{this.state.showScore && (
					<View
						style={{
							position: 'absolute',
							zIndex: 1000,
							height: height,
							width: '100%',
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: styleBase.primaryColor
						}}>
						{this.state.win && (
							<Text style={[textStyle, { color: 'white' }]}>
								You WON!
							</Text>
						)}
						{!this.state.win && (
							<Text style={[textStyle, { color: 'white' }]}>
								You Lose :(
							</Text>
						)}
					</View>
				)}
				{!this.state.loading && this.state.empty && (
					<Text>No kittens to load - INSERT KITTEN</Text>
				)}
				<View
					style={{
						flex: 1
					}}>
					{this.state.leftKitten && (
						<View
							style={{
								height: height / 2
							}}>
							<ImageDisplay
								onImageChange={() =>
									this.onKittenImageChangeStart()
								}
								onLoadingEnd={() =>
									this.onKittenImageChangeEnd()
								}
								disableRadius={true}
								key={this.state.leftKitten.savedName}
								imageID={this.state.leftKitten.savedName}
								onClick={this.voteKitten.bind(
									this
								)}></ImageDisplay>
						</View>
					)}
					{this.state.rightKitten && (
						<View
							style={{
								height: height / 2
							}}>
							<ImageDisplay
								onImageChange={() =>
									this.onKittenImageChangeStart()
								}
								onLoadingEnd={() =>
									this.onKittenImageChangeEnd()
								}
								disableRadius={true}
								key={this.state.rightKitten.savedName}
								imageID={this.state.rightKitten.savedName}
								onClick={this.voteKitten.bind(
									this
								)}></ImageDisplay>
						</View>
					)}
				</View>
			</View>
		);
	}
}
