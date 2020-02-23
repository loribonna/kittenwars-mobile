import * as React from 'react';
import { KITTENS_URI } from '../../helpers/statics';
import { getFile } from '../../helpers/crud';
import { getJWTToken } from '../../helpers/helpers';
import { View, TouchableHighlight, Image } from 'react-native';

interface ImageDisplayProps {
	imageID?: string;
	onClick?: Function;
	fullUri?: string;
}

interface ImageDisplayState {
	imageID?: string;
	img?: string;
	fullUri?: string;
}

export class ImageDisplay extends React.Component<
	ImageDisplayProps,
	ImageDisplayState
> {
	_imageData = '';
	_mounted = false;
	constructor(props) {
		super(props);
		if (!this.props.imageID && !this.props.fullUri) {
			console.error('Loading component error: imageID or fullUri needed');
			throw new Error(
				'Loading component error: imageID or fullUri needed'
			);
		}

		if (this.props.fullUri) {
			this.state = { fullUri: this.props.fullUri };
		} else if (this.props.imageID) {
			this.state = { imageID: this.props.imageID };
		}
	}

	composeUri(imageID): string {
		return KITTENS_URI + imageID + '/data';
	}

	getUri(): string {
		return this.state.fullUri
			? this.state.fullUri
			: this.composeUri(this.state.imageID);
	}

	imageClick(event) {
		if (this.props.onClick) {
			this.props.onClick(this.props.imageID);
		}
	}

	async componentDidMount() {
		this._mounted = true;
		if (this.state.imageID || this.state.fullUri) {
			await this.loadImage();
		}
	}

	componentWillUnmount() {
		this._mounted = false;
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
					fullUri: this.props.fullUri
				});
			}
			await this.loadImage();
		}
	}

	async loadImage() {
		const token = await getJWTToken();

		try {
			const img = await getFile(this.getUri(), token);

			if (this._mounted) {
				this.setState({ ...this.state, img: img });
			}
		} catch (e) {
			console.log(e);
		}
	}

	getImg() {
		if (this.state.img) {
			return 'data:image/png;base64,' + this.state.img;
		}
	}

	render() {
		return (
			<View>
				{this.props.onClick && (
					<TouchableHighlight onPress={this.imageClick.bind(this)}>
						<Image
							key={this.state.imageID as string}
							style={{ width: 100, height: 100 }}
							source={{ uri: this.getImg() }}
						/>
					</TouchableHighlight>
				)}
				{!this.props.onClick && (
					<Image
						key={this.state.imageID as string}
						style={{ width: 100, height: 100 }}
						source={{ uri: this.getImg() }}
					/>
				)}
			</View>
		);
	}
}
