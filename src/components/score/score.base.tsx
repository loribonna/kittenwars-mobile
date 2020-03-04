import * as React from 'react';
import { get } from '../../helpers/crud';
import { IKitten } from '../../helpers/interfaces';
import { View, Dimensions, LayoutRectangle } from 'react-native';
import { ImageDisplay } from '../image/image';
import { BASE_URI } from '../../helpers/statics';
import { mainBackgroundColor } from '../../helpers/style.base';
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

const screenWidth = Dimensions.get('screen').width;

interface KittensRenderProps {
	kittens: IKitten[];
	type: 'best' | 'worst';
	onLoadEnd: () => void;
	onLoadStart: () => void;
	key?: any;
}

const KittensRender: React.FunctionComponent<KittensRenderProps> = ({
	kittens,
	type,
	onLoadEnd,
	onLoadStart
}): JSX.Element => {
	if (!kittens || !Array.isArray(kittens) || !kittens[0]) {
		return null;
	}
	return (
		<View style={{ height: '100%', width: screenWidth }}>
			{Array.isArray(kittens) && kittens[0] && (
				<View style={{ height: '100%', width: '100%' }}>
					<ImageDisplay
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
		await this.loadMostLikedKitten();
		await this.loadLeastLikedKitten();
	}

	async loadMostLikedKitten() {
		try {
			const kittens = await get(BASE_URI + '/score/best');
			this.setState({ ...this.state, bestKittens: kittens });
		} catch (e) {
			console.warn(e);
		}
	}

	async loadLeastLikedKitten() {
		try {
			const kittens = await get(BASE_URI + '/score/worst');
			this.setState({ ...this.state, worstKittens: kittens });
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

	render() {
		return (
			<View onLayout={e => this.measureView(e.nativeEvent.layout)}>
				<Loading
					featuresNumber={2}
					getRef={ref => {
						this._loadingRef = ref;
					}}
				/>
				<Carousel
					loading={this.state.loading}
					style={{ backgroundColor: mainBackgroundColor }}
					onPageChange={this.scrollEnd.bind(this)}
					data={
						[
							{
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
