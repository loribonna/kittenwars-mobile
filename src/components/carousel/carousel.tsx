import * as React from 'react';
import {
	View,
	StyleSheet,
	NativeSyntheticEvent,
	NativeScrollEvent,
	Dimensions,
	FlatList,
	ViewToken
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { IKitten } from '../../helpers/interfaces';

export type Direction = 'next' | 'previous';

interface CarouselProps {
	style: object;
	onPageChange?: (key: any) => void;
	data: any[];
	itemRender: (item: any) => JSX.Element;
}

interface CarouselState {
	currentItemKey?: any;
}

const style = StyleSheet.create({
	container: {
		flex: 1
	}
});

const screenWidth = Dimensions.get('window').width;

export class Carousel extends React.Component<CarouselProps, any> {
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
			<FlatList
				horizontal={true}
				pagingEnabled={true}
				data={this.props.data}
				onViewableItemsChanged={this._handlePageChange}
				renderItem={({ item, index }) => this.props.itemRender(item)}
				keyExtractor={item => item.key.toString()}
			/>
		);
	}
}
