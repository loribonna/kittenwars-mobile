import * as React from 'react';
import { View, LayoutRectangle, StyleProp, ViewStyle } from 'react-native';
import { Border } from '../border/border';

interface CircleBoxProps {
	style: StyleProp<ViewStyle>;
	color?: string;
	borderEnabled?: boolean;
}

interface CircleBoxState {
	viewSize?: LayoutRectangle;
}

export class CircleBox extends React.Component<
	React.PropsWithChildren<CircleBoxProps>,
	CircleBoxState
> {
	constructor(props) {
		super(props);
		this.state = {};
	}

	async componentDidMount() {}

	getStyle(): { height?; width?; borderRadius? } {
		if (!this.state.viewSize) {
			return {};
		}

		const max =
			this.state.viewSize.width < this.state.viewSize.height
				? this.state.viewSize.height
				: this.state.viewSize.width;

		return {
			height: max,
			width: max,
			borderRadius: max / 2
		};
	}

	measureView(layout: LayoutRectangle) {
		this.setState({
			...this.state,
			viewSize: layout
		});
	}

	

	render() {
		const circleBox = (
			<View
				onLayout={e => this.measureView(e.nativeEvent.layout)}
				style={[
					this.getStyle(),
					this.props.style,
					{
						backgroundColor: this.props.color
							? this.props.color
							: null,
							padding:15
					}
				]}>
				{this.props.children}
			</View>
		);

		if (this.props.borderEnabled) {
			const radius = this.getStyle().borderRadius || null;
			return (
				<Border style={{flex:1, borderRadius: radius}}>
					{circleBox}
				</Border>
			);
		} else {
			return circleBox;
		}
	}
}
