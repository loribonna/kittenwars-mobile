import * as React from 'react';
import {
	View,
	Text,
	Button,
	Image,
	ScrollView,
	Dimensions,
	StyleSheet
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../App';
import ImagePicker, {
	ImagePickerOptions,
	ImagePickerResponse
} from 'react-native-image-picker';
import { TextInput } from 'react-native-gesture-handler';
import { IKitten } from '../../../helpers/interfaces';
import { SubjectData } from '../../../helpers/types';
import { BASE_URI } from '../../../helpers/statics';
import { post, postFile } from '../../../helpers/crud';
import { getJWTToken } from '../../../helpers/helpers';

const MAX_IMAGE_SIZE = 16 * 1024 * 1024 - 1; // 16 MB

interface InsertProp {
	navigation: StackNavigationProp<RootStackParamList, 'Logged'>;
}

interface InsertState {
	image?: ImagePickerResponse;
	kittenImage?: File;
	kittenInfo: Partial<IKitten>;
	confirmable: boolean;
	loading: boolean;
}

const style = StyleSheet.create({
	textInput: {
		alignSelf: 'center',
		justifyContent: 'center',
		borderRadius: 30,
		borderWidth: 2,
		borderColor: 'lightblue',
		width: "80%"
	}
});

const imagePickerAsync = async (options: ImagePickerOptions) =>
	new Promise(
		(
			resolve: (res: ImagePickerResponse) => void,
			reject: (e: { error: string; status: 'error' | 'cancel' }) => void
		) => {
			ImagePicker.showImagePicker(options, response => {
				if (response.didCancel) {
					reject({ error: 'canceled', status: 'cancel' });
				} else if (response.error) {
					reject({ error: response.error, status: 'error' });
				} else {
					resolve(response);
				}
			});
		}
	);

export class InsertKitten extends React.Component<InsertProp, InsertState> {
	constructor(props) {
		super(props);
		this.state = { kittenInfo: {}, confirmable: false, loading: false };
	}

	async takePicture() {
		const options = {
			title: 'Take a photo of a kitten!',
			storageOptions: {
				skipBackup: true,
				path: 'images'
			}
		};

		try {
			const image = await imagePickerAsync(options);
			this.setState({
				...this.state,
				image: image,
				confirmable: this.state.kittenInfo.name ? true : false
			});
		} catch (e) {
			if (e.status == 'error') {
				console.warn(e.error);
			}
		}
	}

	updateData(data: SubjectData) {
		this.setState({
			...this.state,
			kittenInfo: { ...this.state.kittenInfo, [data.name]: data.value },
			confirmable:
				data.name === 'name' && this.checkState()
					? true
					: this.state.confirmable
		});
	}

	checkState(): boolean {
		return (
			this.state.image &&
			this.state.image.fileSize <= MAX_IMAGE_SIZE &&
			this.state.kittenInfo.name != null
		);
	}

	async insertKitten() {
		if (!this.checkState()) {
			return;
		}
		this.setState({ ...this.state, loading: true });

		try {
			const token = await getJWTToken();
			const formData = new FormData();

			formData.append('image', {
				uri: this.state.image.uri,
				name: 'image.jpg',
				type: 'image/jpeg'
			} as any);
			formData.append('kitten', JSON.stringify(this.state.kittenInfo));

			await postFile(BASE_URI + '/kittens', formData, token);

			this.props.navigation.goBack();
		} catch (e) {
			this.setState({ ...this.state, loading: false });
			console.warn(e);
		}
	}

	render() {
		return (
			<View
				style={{
					flex: 1,
					alignItems: 'center'
				}}>
				<View style={{ height: '18%', paddingTop: '1%', width:"100%" }}>
					<TextInput
						style={style.textInput}
						placeholder="Kitten name"
						maxLength={40}
						value={this.state.kittenInfo.name?.toString()}
						onChangeText={text =>
							this.updateData({ name: 'name', value: text })
						}
					/>
                    <View  style={{ paddingTop: '1%' }} />
					<TextInput
						style={style.textInput}
						placeholder="Age (Optional)"
						maxLength={2}
						keyboardType="numeric"
						value={this.state.kittenInfo.name?.toString()}
						onChangeText={text =>
							this.updateData({ name: 'name', value: text })
						}
					/>
				</View>

				<View
					style={{
						height: '60%',
						width: '100%'
					}}>
					{this.state.image && (
						<Image
							style={{
								height: '100%',
								width: null,
								resizeMode: 'contain'
							}}
							source={{ uri: this.state.image.uri }}
						/>
					)}
					<View style={{ paddingTop: '5%' }}>
						<Button
							disabled={this.state.loading}
							onPress={this.takePicture.bind(this)}
							title={
								this.state.image
									? 'Change picture'
									: 'Take picture'
							}
						/>
					</View>
				</View>

				<View
					style={{ height: '10%', position: 'absolute', bottom: 0 }}>
					{!this.state.confirmable && (
						<View
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								bottom: 0
							}}>
							<Button
								disabled={this.state.loading}
								onPress={this.insertKitten.bind(this)}
								title="Confirm"
							/>
						</View>
					)}
				</View>
			</View>
		);
	}
}
