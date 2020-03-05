import * as React from 'react';
import { ImageDisplay } from '../../../components/image/image';
import { get, put } from '../../../helpers/crud';
import { VOTE_URI } from '../../../helpers/statics';
import { IKitten } from '../../../helpers/interfaces';
import { getJWTToken } from '../../../helpers/helpers';
import { View, Text, StyleSheet, LayoutRectangle } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Loading } from '../../../components/loading/loading';
import { textStyle, alignCenter, mainBackgroundColor, styleBase } from '../../../helpers/style.base';
import { Border } from '../../../components/border/border';
import { LoginService } from '../../../helpers/login.service';
import { KittenVote } from '../../../helpers/types';

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
		try {
			await this.loadRandomKittens();
		} catch (e) {
			console.warn(e);
		}
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
			} else {
				newState = Object.assign(newState, {
					empty: true
				});
			}
		} catch (e) {
			if (e.status === 401) {
				LoginService.logout(this.props.navigation);
			}
		}
		this.setState({ ...this.state, ...newState });
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

		const vote: KittenVote = {
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
				LoginService.logout(this.props.navigation);
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
		if (this.state.empty) {
			return (
				<View style={[alignCenter, { height: '100%', width: '100%' }]}>
					<Text style={textStyle}>No kittens to load</Text>
					<Text style={textStyle}>INSERT KITTEN!</Text>
				</View>
			);
		}
		const borderWidth = 10;
		const height = this.state.viewSize
			? this.state.viewSize.height - borderWidth
			: 0;

		const style = StyleSheet.create({
			imageContainer: {
				height: height / 2,
				borderRadius: 10,
				overflow: 'hidden'
			},
			text: { ...textStyle, color: 'white' }
		});

		const getKittenRender = (kitten: IKitten) =>
			kitten ? (
				<Border style={style.imageContainer}>
					<ImageDisplay
						style={{ alignItems: 'center' }}
						disabled={this._disableClick}
						onLoadingStart={() => this.onKittenImageChangeStart()}
						onLoadingEnd={() => this.onKittenImageChangeEnd()}
						disableRadius={true}
						key={kitten.savedName}
						imageID={kitten.savedName}
						onClick={this.voteKitten.bind(this)}
					/>
				</Border>
			) : null;

		return (
			<View
				style={{
					flex: 1
				}}>
				<Loading
					getRef={ref => {
						this._loadingRef = ref;
					}}
					onLoadStart={() => this.onLoadStart()}
					onLoadEnd={() => this.onLoadEnd()}
				/>

				{this.state.showScore && (
					<View
						style={{
							position: 'absolute',
							zIndex: 2000,
							height: "100%",
							backgroundColor:styleBase.primaryColor,
							width: '100%',
							justifyContent: 'center',
							alignItems: 'center'
						}}>
						{this.state.win && (
							<Text style={style.text}>You WON!</Text>
						)}
						{!this.state.win && (
							<Text style={style.text}>You Lose :(</Text>
						)}
					</View>
				)}

				<View
					onLayout={e => this.measureView(e.nativeEvent.layout)}
					style={{
						flex: 1,
						borderRadius: 15,
						overflow: 'hidden',
						borderWidth: 5,
						borderColor: 'transparent'
					}}>
					{getKittenRender(this.state.leftKitten)}
					<View style={{ height: 1, width: '100%' }} />
					{getKittenRender(this.state.rightKitten)}
				</View>
			</View>
		);
	}
}
