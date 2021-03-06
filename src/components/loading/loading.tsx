import React from 'react';
import {
	View,
	Text,
	Dimensions,
	StyleSheet,
	ViewStyle,
	StyleProp
} from 'react-native';
import { alignCenter, styleBase } from '../../helpers/style.base';

interface LoadingInterface {
	width?: number;
	manual?: boolean;
	getRef: (ref: Loading) => void;
	onLoadEnd?: () => void;
	onLoadStart?: () => void;
	text?: string;
	style?: StyleProp<ViewStyle>;
}

interface LoadingState {
	showLoading: boolean;
}

export class Loading extends React.Component<LoadingInterface, LoadingState> {
	private _width = Dimensions.get('window').width;
	private _cFeatures = 0;
	constructor(props) {
		super(props);
		if (props.width) {
			this._width = props.width;
		}

		this.state = { showLoading: false };
	}

	componentDidMount() {
		this._cFeatures = 0;
		if (this.props.getRef) {
			this.props.getRef(this);
		}
	}

	public onFeatureChangeStart() {
		this._cFeatures++;
		if (!this.state.showLoading) {
			this.setState({
				...this.state,
				showLoading: true
			});
			this.props.onLoadStart ? this.props.onLoadStart() : null;
		}
	}

	public onFeatureChangeEnd() {
		this._cFeatures > 0 ? this._cFeatures-- : null;
		if (this._cFeatures == 0) {
			this.setState({
				...this.state,
				showLoading: false
			});
			this.props.onLoadEnd ? this.props.onLoadEnd() : null;
		}
	}

	render() {
		const view = (
			<View
				style={[
					alignCenter,
					{
						position: 'absolute',
						zIndex: 1000,
						backgroundColor: styleBase.primaryColor
					},
					style.container,
					this.props.style
				]}>
				<Text style={{ fontSize: this._width / 10, color: 'white' }}>
					{this.props.text || 'LOADING..'}
				</Text>
			</View>
		);

		if (this.props.manual) {
			return view;
		} else {
			if (this.state.showLoading) {
				return view;
			} else {
				return null;
			}
		}
	}
}

const style = StyleSheet.create({
	container: {
		height: '100%',
		width: '100%'
	}
});
