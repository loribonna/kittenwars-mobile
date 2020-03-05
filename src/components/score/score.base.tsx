import * as React from 'react';
import { get } from '../../helpers/crud';
import { IKitten } from '../../helpers/interfaces';
import {
	View,
	Dimensions,
	LayoutRectangle,
	Text,
	StyleProp,
	ViewStyle
} from 'react-native';
import { ImageDisplay } from '../image/image';
import { BASE_URI } from '../../helpers/statics';
import {
	mainBackgroundColor,
	alignCenter,
	textStyle
} from '../../helpers/style.base';
import { Carousel } from '../carousel/carousel';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App';
import { Loading } from '../loading/loading';

interface ScoreProps {
	navigation: StackNavigationProp<RootStackParamList, 'Unlogged'>;
}

interface ScoreState {
	bestKittens: IKitten[];
	worstKittens: IKitten[];
	loading: boolean;
	currentKitten: 'best' | 'worst';
	viewHeight: number;
}

const baseWidth = Dimensions.get('screen').width;

interface KittensRenderProps {
	kittens: IKitten[];
	type: 'best' | 'worst';
	onLoadEnd: () => void;
	onLoadStart: () => void;
	key?: any;
	style?: StyleProp<ViewStyle>;
}

const KittensRender: React.FunctionComponent<KittensRenderProps> = ({
	kittens,
	type,
	onLoadEnd,
	onLoadStart,
	style
}): JSX.Element => {
	if (!kittens || !Array.isArray(kittens) || !kittens[0]) {
		return null;
	}
	return (
		<View style={[alignCenter, { height: '100%', width: baseWidth }]}>
			{Array.isArray(kittens) && kittens[0] && (
				<View style={{ height: '80%', width: '80%' }}>
					<ImageDisplay
						style={style}
						enableCenterOffset={true}
						onLoadingEnd={() => {
							onLoadEnd();
						}}
						onLoadingStart={() => {
							onLoadStart();
						}}
						label={(() => {
							const m = type === 'best' ? 'BEST' : 'WORST';
							return `${m} KITTEN WITH ${kittens[0].votes} VOTES`;
						})()}
						fullUri={`${BASE_URI}/score/${type}/${kittens[0].savedName}`}
					/>
				</View>
			)}
		</View>
	);
};

export abstract class ScoreBase extends React.Component<
	ScoreProps,
	ScoreState
> {
	_loadingRef: Loading;
	constructor(props) {
		super(props);
		this.state = {
			bestKittens: [],
			worstKittens: [],
			currentKitten: 'best',
			loading: true,
			viewHeight: null
		};
	}

	async componentDidMount() {
		this.onKittenImageChangeStart();

		try {
			const [best, worst] = await Promise.all([
				this.loadMostLikedKitten(),
				this.loadLeastLikedKitten()
			]);
			this.setState({
				...this.state,
				bestKittens: best,
				worstKittens: worst
			});
		} catch (e) {
			console.warn(e);
		}
		this.onKittenImageChangeEnd();
	}

	async loadMostLikedKitten(): Promise<IKitten[]> {
		try {
			return await get(BASE_URI + '/score/best');
		} catch (e) {
			console.warn(e);
		}
	}

	async loadLeastLikedKitten(): Promise<IKitten[]> {
		try {
			return await get(BASE_URI + '/score/worst');
		} catch (e) {
			console.warn(e);
		}
	}

	scrollEnd(key: 'best' | 'worst') {
		if (key != this.state.currentKitten) {
			this.setState({
				...this.state,
				currentKitten: key
			});
			this.props.navigation.setOptions({
				headerTitle: key === 'best' ? 'Best Kitten!' : 'Worst Kitten!'
			});
		}
	}

	onKittenImageChangeEnd() {
		this._loadingRef.onFeatureChangeEnd();
	}

	onKittenImageChangeStart() {
		this._loadingRef.onFeatureChangeStart();
	}

	measureView(layout: LayoutRectangle) {
		this.setState({
			...this.state,
			viewHeight: layout.height
		});
	}

	onLoadEnd() {
		this.setState({ ...this.state, loading: false });
	}

	onLoadStart() {
		this.setState({ ...this.state, loading: true });
	}

	render() {
		const loadOk =
			!this.state.loading &&
			(!this.state.bestKittens ||
				!this.state.worstKittens ||
				!this.state.bestKittens.length ||
				!this.state.worstKittens.length);

		return (
			<View
				style={{
					height: '100%',
					width: '100%',
					backgroundColor: mainBackgroundColor
				}}
				onLayout={e => this.measureView(e.nativeEvent.layout)}>
				<Loading
					onLoadStart={this.onLoadStart.bind(this)}
					onLoadEnd={this.onLoadEnd.bind(this)}
					getRef={ref => {
						this._loadingRef = ref;
					}}
				/>
				{loadOk && (
					<View style={alignCenter}>
						<Text style={textStyle}>Not enough Kittens!</Text>
					</View>
				)}
				<Carousel
					loading={this.state.loading}
					onPageChange={this.scrollEnd.bind(this)}
					data={
						[
							{
								style: { alignItems: 'center' },
								kittens: this.state.bestKittens,
								type: 'best',
								key: 'best',
								onLoadEnd: this.onKittenImageChangeEnd.bind(
									this
								),
								onLoadStart: this.onKittenImageChangeStart.bind(
									this
								)
							},
							{
								style: { alignItems: 'center' },
								kittens: this.state.worstKittens,
								type: 'worst',
								key: 'worst',
								onLoadStart: this.onKittenImageChangeStart.bind(
									this
								),
								onLoadEnd: this.onKittenImageChangeEnd.bind(
									this
								)
							}
						] as KittensRenderProps[]
					}
					itemRender={KittensRender}
				/>
			</View>
		);
	}
}
