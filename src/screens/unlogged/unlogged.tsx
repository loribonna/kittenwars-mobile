import * as React from 'react';
import { get } from '../../helpers/crud';
import { IKitten } from '../../helpers/interfaces';
import { View, Text } from 'react-native';
import { ImageDisplay } from '../../components/image/image';
import { BASE_URI } from '../../helpers/statics';

interface UnloggedScreenProps {}

interface UnloggedScreenState {
	bestKittens: IKitten[];
	worstKittens: IKitten[];
}

export class UnloggedScreen extends React.Component<
	UnloggedScreenProps,
	UnloggedScreenState
> {
	constructor(props) {
		super(props);
		this.state = { bestKittens: [], worstKittens: [] };
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
			console.log(e);
		}
	}

	async loadLeastLikedKitten() {
		try {
			const kittens = await get(BASE_URI + '/score/worst');
			this.setState({ ...this.state, worstKittens: kittens });
		} catch (e) {
			console.log(e);
		}
	}

	render() {
		return (
			<View>
				<View style={{ height: '100%' }}>
					{Array.isArray(this.state.bestKittens) &&
						this.state.bestKittens[0] && (
							<View style={{ height: '50%', width: null }}>
								<Text>
									BEST KITTEN WITH{' '}
									{this.state.bestKittens[0].votes} VOTES
								</Text>
								<ImageDisplay
									fullUri={`${BASE_URI}/score/best/${this.state.bestKittens[0].savedName}`}
								/>
							</View>
						)}

					{Array.isArray(this.state.worstKittens) &&
						this.state.worstKittens[0] && (
							<View style={{ height: '50%', width: null }}>
								<Text>
									WORST KITTEN WITH{' '}
									{this.state.worstKittens[0].votes} VOTES
								</Text>
								<ImageDisplay
									fullUri={`${BASE_URI}/score/worst/${this.state.worstKittens[0].savedName}`}
								/>
							</View>
						)}
				</View>
			</View>
		);
	}
}
