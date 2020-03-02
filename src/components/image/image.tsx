import * as React from 'react';
import { KITTENS_URI } from '../../helpers/statics';
import { getUnparsed } from '../../helpers/crud';
import { getJWTToken } from '../../helpers/helpers';
import {
	View,
	Image,
	Text,
	TouchableHighlight,
	Dimensions,
	LayoutRectangle
} from 'react-native';
import { styleBase } from '../../helpers/style.base';

interface ImageDisplayProps {
	imageID?: string;
	onClick?: Function;
	fullUri?: string;
	label?: string;
	onLoadingEnd?: (ref: ImageDisplay) => void;
}

interface ContainerDim {
	height: number;
	width: number;
}

interface ImageDisplayState {
	imageID?: string;
	img?: string;
	fullUri?: string;
	containerDim: ContainerDim;
	imgRatio: number;
	labelDim: ContainerDim;
	loading: boolean;
}

function getBaseDim() {
	return {
		height: null,
		width: null
	};
}

const dim = Dimensions.get('window');

export class ImageDisplay extends React.Component<
	ImageDisplayProps,
	ImageDisplayState
> {
	imgRef: Image;
	_mounted = false;
	_containerSetup = false;
	_labelSetup = false;

	constructor(props) {
		super(props);
		if (!this.props.imageID && !this.props.fullUri) {
			console.error('Loading component error: imageID or fullUri needed');
			throw new Error(
				'Loading component error: imageID or fullUri needed'
			);
		}

		if (this.props.fullUri) {
			this.state = {
				fullUri: this.props.fullUri,
				containerDim: getBaseDim(),
				imgRatio: 1,
				labelDim: getBaseDim(),
				loading: true
			};
		} else if (this.props.imageID) {
			this.state = {
				imageID: this.props.imageID,
				containerDim: getBaseDim(),
				imgRatio: 1,
				labelDim: getBaseDim(),
				loading: true
			};
		}
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	async componentDidMount() {
		this._mounted = true;
		try {
			if (this.state.imageID || this.state.fullUri) {
				await this.loadImage();
			}
		} catch (e) {
			console.warn(e);
		}
	}

	async componentDidUpdate() {
		if (
			this.state.imageID != this.props.imageID ||
			this.state.fullUri != this.props.fullUri
		) {
			if (this._mounted) {
				this.setState({
					...this.state,
					imageID: this.props.imageID,
					fullUri: this.props.fullUri,
					loading: true
				});
				this.props.onLoadingEnd ? this.props.onLoadingEnd(this) : null;
			}
			await this.loadImage();
		}
	}

	_getImgRatio(img: string): Promise<number> {
		return new Promise<number>((resolve, reject) => {
			if (!img) {
				resolve(1);
			} else {
				Image.getSize(
					img,
					(w, h) => resolve(h / w),
					e => reject(e)
				);
			}
		});
	}

	measureView(layout: LayoutRectangle) {
		if (!this._containerSetup) {
			this._containerSetup = true;
		}
		this.setState({
			...this.state,
			containerDim: {
				width: layout.width,
				height: layout.height
			}
		});
	}

	measureLabel(layout: LayoutRectangle) {
		if (!this._labelSetup) {
			this._labelSetup = true;
		}
		this.setState({
			...this.state,
			labelDim: {
				width: layout.width,
				height: layout.height
			}
		});
	}

	composeUri(imageID): string {
		return KITTENS_URI + imageID + '/data';
	}

	getUri(): string {
		return this.state.fullUri
			? this.state.fullUri
			: this.composeUri(this.state.imageID);
	}

	imageClick() {
		if (this.props.onClick) {
			this.props.onClick(this.props.imageID);
		}
	}

	async loadImage() {
		const token = await getJWTToken();

		try {
			const img = await getUnparsed(this.getUri(), token);

			const ratio = await this._getImgRatio(this.getImg(img));
			if (this._mounted) {
				this.setState({
					...this.state,
					img: img,
					loading: false,
					imgRatio: ratio
				});
				this.props.onLoadingEnd ? this.props.onLoadingEnd(this) : null;
			}
		} catch (e) {
			console.log(e);
		}
	}

	getImg(img?: string) {
		if (img) {
			return 'data:image/png;base64,' + img;
		}
		if (this.state.img) {
			return 'data:image/png;base64,' + this.state.img;
		}
	}

	getImgContainerSize(hScale = 1): ContainerDim {
		if (!this._containerSetup) {
			return { height: null, width: null };
		}
		return {
			height: this.state.containerDim.height
				? this.state.containerDim.height * hScale
				: null,
			width: this.state.containerDim.width
		};
	}

	getImgLabelSize(hScale = 1): ContainerDim {
		if (!this._labelSetup) {
			return { height: null, width: null };
		}
		return {
			height: this.state.labelDim.height
				? this.state.labelDim.height * hScale
				: null,
			width: this.state.labelDim.width
		};
	}

	getImgSize(hScale = 1): ContainerDim {
		if (!this._labelSetup || !this._containerSetup) {
			return { height: null, width: null };
		}
		const containerSize = this.getImgContainerSize();
		const descriptionSize = this.getImgLabelSize();

		let contH = containerSize.height - (descriptionSize.height | 0);

		if (this.state.imgRatio >= 1) {
			//height greater or equal width
			const h = contH;
			const w = contH * this.state.imgRatio;
			return {
				height: h,
				width: w
			};
		} else {
			const w = containerSize.width;
			const h = w * this.state.imgRatio;

			return {
				height: h,
				width: w
			};
		}
	}

	getTopOffsetCenter(): number {
		if (!this._labelSetup || !this._containerSetup) {
			return null;
		}

		const container = this.getImgContainerSize();
		const label = this.getImgLabelSize();
		const img = this.getImgSize();

		return (
			container.height / 2 -
			(((label.height | 0) * 5) / 2 + img.height) / 2
		);
	}

	render() {
		let labelDisplay: () => JSX.Element = () => null;
		if (this.props.label) {
			labelDisplay = () => {
				return (
					<View
						onLayout={e => this.measureLabel(e.nativeEvent.layout)}
						style={{
							alignItems: 'center',
							justifyContent: 'center',
							backgroundColor: styleBase.neutralColor
						}}>
						<Text>Title</Text>
						<Text
							style={{
								color: styleBase.textColor,
								paddingTop: 5
							}}>
							Description of the image
						</Text>
					</View>
				);
			};
		} else {
			this._labelSetup = true;
		}

		const imageDisplay: () => JSX.Element = () => {
			return (
				<View style={this.getImgContainerSize()}>
					<View
						style={{
							borderRadius: 10,
							overflow: 'hidden',
							marginTop: this.getTopOffsetCenter()
						}}>
						<Image
							source={{ uri: this.getImg() }}
							style={[
								{
									resizeMode: 'contain'
								},
								this.getImgSize()
							]}
							key={this.state.imageID}
						/>
						{labelDisplay()}
					</View>
				</View>
			);
		};

		return (
			<View
				style={{ flex: 1 }}
				onLayout={event => this.measureView(event.nativeEvent.layout)}>
				{this.props.onClick && (
					<TouchableHighlight onPress={this.imageClick.bind(this)}>
						{imageDisplay()}
					</TouchableHighlight>
				)}
				{!this.props.onClick && imageDisplay()}
			</View>
		);
	}
}
