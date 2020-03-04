import * as React from 'react';
import { getJWTToken } from '../../../helpers/helpers';
import { get } from '../../../helpers/crud';
import { IUser } from '../../../helpers/interfaces';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { BASE_URI } from '../../../helpers/statics';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../App';
import {
	styleBase,
	alignCenter,
	textStyle,
	clearTextStyle,
	darkTextStyle
} from '../../../helpers/style.base';
import { CircleBox } from '../../../components/circleBox/circleBox';
import { Loading } from '../../../components/loading/loading';
import { CustomButton } from '../../../components/button/button';
import { Border } from '../../../components/border/border';
import { LoginService } from '../../../helpers/login.service';

interface UserProps {
	navigation: StackNavigationProp<RootStackParamList, 'Logged'>;
}

interface UserState {
	userScore: Number;
	scoreBoard: IUser[];
	userPosition: Number;
}

interface UserElementProp {
	user: IUser;
	index: number;
}

const UserElement: React.FunctionComponent<UserElementProp> = ({
	user,
	index
}) => {
	const color =
		index % 2
			? styleBase.getPrimaryColorWithOpacity(0.8)
			: styleBase.getSecondaryColorWithOpacity(0.8);
	return (
		<View
			style={{
				paddingLeft: 10,
				paddingRight: 10,
				backgroundColor: color,
				paddingBottom: 0,
				maxWidth: '80%',
				marginBottom: 0,
				flex: 1
			}}>
			<Text style={darkTextStyle}>
				<Text>Username: </Text>
				<Text style={{ marginLeft: 5, color: 'white' }}>
					{user.username}
				</Text>
			</Text>

			<Text style={darkTextStyle}>
				<Text>Score: </Text>
				<Text style={{ marginLeft: 5, color: 'white' }}>
					{user.score}
				</Text>
			</Text>
		</View>
	);
};

export class User extends React.Component<UserProps, UserState> {
	_loadingRef: Loading;
	constructor(props) {
		super(props);
		this.state = {
			userScore: 0,
			scoreBoard: [],
			userPosition: -1
		};
	}

	async componentDidMount() {
		this.onScoreLoadStart();
		await Promise.all([
			this.loadUserScore(),
			this.loadScoreBoard(),
			this.getUserBoardPosition()
		]);

		this.onScoreLoadEnd();
	}

	async loadUserScore() {
		try {
			const token = await getJWTToken();

			const score = await get(BASE_URI + '/users/score', token);
			this.setState({ ...this.state, userScore: score });
		} catch (e) {
			if (e.status === 401) {
				LoginService.logout(this.props.navigation);
			}
		}
	}

	async loadScoreBoard() {
		try {
			const token = await getJWTToken();

			const board = await get(BASE_URI + '/users/board', token);
			this.setState({
				...this.state,
				scoreBoard: board
			});
		} catch (e) {
			if (e.status === 401) {
				LoginService.logout(this.props.navigation);
			}
		}
	}

	async getUserBoardPosition() {
		try {
			const token = await getJWTToken();

			const position = await get(BASE_URI + '/users/position', token);
			this.setState({ ...this.state, userPosition: position });
		} catch (e) {
			if (e.status === 401) {
				LoginService.logout(this.props.navigation);
			}
		}
	}

	async insertNewKitten() {
		this.props.navigation.navigate('Insert');
	}

	onScoreLoadStart() {
		this._loadingRef.onFeatureChangeStart();
	}

	onScoreLoadEnd() {
		this._loadingRef.onFeatureChangeEnd();
	}

	render() {
		const ScoreBox = (
			<View
				style={[
					alignCenter,
					{
						flexDirection: 'row',
						justifyContent: 'space-evenly',
						marginTop: 10,
						marginBottom: 10
					}
				]}>
				<Border
					style={[
						style.scoreContainer,
						{ marginRight: 5, marginLeft: 10 }
					]}>
					<Text style={[textStyle]}>USER POSITION</Text>
					<CircleBox
						borderEnabled={true}
						color={styleBase.secondaryColor}
						style={[alignCenter]}>
						<Text style={[clearTextStyle]}>
							{this.state.userPosition}
						</Text>
					</CircleBox>
				</Border>
				<Border
					style={[
						style.scoreContainer,
						{ marginRight: 10, marginLeft: 5 }
					]}>
					<Text style={[textStyle]}>USER SCORE</Text>
					<CircleBox
						borderEnabled={true}
						color={styleBase.secondaryColor}
						style={[alignCenter]}>
						<Text style={[clearTextStyle]}>
							{this.state.userScore}
						</Text>
					</CircleBox>
				</Border>
			</View>
		);

		const ScoreBoard = (
			<View
				style={[
					alignCenter,
					{ height: '100%', marginLeft: 10, marginRight: 10 }
				]}>
				<Border
					style={[
						alignCenter,
						{
							width: '100%',
							backgroundColor: styleBase.neutralColor,
							borderRadius: 10,
							marginBottom: 10
						}
					]}>
					<Text
						style={[
							textStyle,
							{ alignSelf: 'flex-start', padding: 10 }
						]}>
						SCORE BOARD:
					</Text>
					<Border
						style={{
							borderRadius: 10,
							overflow: 'hidden',
							marginBottom: 10,
							flex: 1
						}}>
						{this.state.scoreBoard.map((item, index) => (
							<UserElement
								key={item.account.id as string}
								user={item}
								index={index}
							/>
						))}
					</Border>
				</Border>
			</View>
		);

		return (
			<View style={{ height: '100%', width: '100%' }}>
				<Loading
					getRef={ref => {
						this._loadingRef = ref;
					}}
				/>

				<ScrollView>
					<View style={{ flex: 1 }}>
						{ScoreBox}
						<View style={{ width: '50%', paddingBottom: 10 }}>
							<CustomButton
								style={{ marginLeft: 10, marginRight: 10 }}
								title="Insert new Kitten!"
								onPress={this.insertNewKitten.bind(this)}
							/>
						</View>
						{ScoreBoard}
					</View>
				</ScrollView>
			</View>
		);
	}
}

const style = StyleSheet.create({
	scoreContainer: {
		flex: 1,
		alignItems: 'center',
		height: '100%',
		backgroundColor: styleBase.neutralColor,
		borderRadius: 10,
		marginBottom: 10
	}
});
