import * as React from 'react';
import {
	View,
	StyleSheet,
	NativeSyntheticEvent,
	NativeScrollEvent,
	Dimensions,
	FlatList,
	ViewToken,
	Text
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { IKitten } from '../../helpers/interfaces';
import { styleBase, alignCenter } from '../../helpers/style.base';
import { Loading } from '../loading/loading';

export type Direction = 'next' | 'previous';

interface CarouselProps {
	style: object;
	onPageChange?: (key: any) => void;
	data: any[];
	itemRender: (item: any) => JSX.Element;
	loading?: boolean;
}

interface CarouselState {
	currentItemKey?: any;
	loading: boolean;
}

const style = StyleSheet.create({
	container: {
		flex: 1
	}
});

const screenWidth = Dimensions.get('window').width;

export class Carousel extends React.Component<CarouselProps, CarouselState> {
	constructor(props) {
		super(props);
		this._handlePageChange = this._handlePageChange.bind(this);
		this.state = { loading: props.loading || false };
	}

	componentDidUpdate() {
		if (this.props.loading != this.state.loading) {
			this.setState({
				...this.state,
				loading: this.props.loading
			});
		}
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
			<View>
				{this.props.loading && <Loading manual={true} />}
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
