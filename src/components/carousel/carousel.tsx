import * as React from 'react';
import {
	View,
	FlatList,
	ViewToken,
	ViewStyle,
	StyleProp
} from 'react-native';

export type Direction = 'next' | 'previous';

interface CarouselProps {
	style?: StyleProp<ViewStyle>;
	onPageChange?: (key: any) => void;
	data: any[];
	itemRender: (item: any) => JSX.Element;
	loading?: boolean;
}

interface CarouselState {
	currentItemKey?: any;
}

export class Carousel extends React.Component<CarouselProps, CarouselState> {
	constructor(props) {
		super(props);
		this._handlePageChange = this._handlePageChange.bind(this);
		this.state = {};
	}

	_handlePageChange(data: {
		changed: ViewToken[];
		viewableItems: ViewToken[];
	}) {
		if (data.viewableItems && data.viewableItems[0]) {
			if (
				!this.state.currentItemKey ||
				data.viewableItems[0].key != this.state.currentItemKey
			) {
				this.setState({
					...this.state,
					currentItemKey: data.viewableItems[0].key
				});
				this.props.onPageChange(data.viewableItems[0].key);
			}
		}
	}

	render() {
		return (
			<View style={[this.props.style,{height:"100%"}]}>
				<FlatList
					horizontal={true}
					pagingEnabled={true}
					data={this.props.data}
					onViewableItemsChanged={this._handlePageChange}
					renderItem={({ item, index }) =>
						this.props.itemRender(item)
					}
					keyExtractor={item => item.key.toString()}
				/>
			</View>
		);
	}
}
