import * as React from 'react';
import { View, Image, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../App';
import ImagePicker, {
	ImagePickerOptions,
	ImagePickerResponse
} from 'react-native-image-picker';
import { IKitten } from '../../../helpers/interfaces';
import { SubjectData } from '../../../helpers/types';
import { BASE_URI } from '../../../helpers/statics';
import { postFile } from '../../../helpers/crud';
import { getJWTToken } from '../../../helpers/helpers';
import { CustomTextInput } from '../../../components/input/textinput';
import { CustomButton } from '../../../components/button/button';
import { Loading } from '../../../components/loading/loading';

const MAX_IMAGE_SIZE = 16 * 1024 * 1024 - 1; // 16 MB

interface InsertProp {
	navigation: StackNavigationProp<RootStackParamList, 'Logged'>;
}

interface InsertState {
	image?: ImagePickerResponse;
	kittenImage?: File;
	kittenInfo: Partial<IKitten>;
	confirmable: boolean;
	editing: boolean;
}

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
	_loadingRef: Loading;
	constructor(props) {
		super(props);
		this.state = {
			kittenInfo: {},
			confirmable: false,
			editing: false
		};
	}

	async takePicture() {
		const options: ImagePickerOptions = {
			title: 'Get the photo of your kitten!',
			chooseFromLibraryButtonTitle: 'Choose Kitten from library!',
			takePhotoButtonTitle: 'Take a photo...',
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
		let value = data.value;
		if (data.type) {
			if (data.type == 'number' && !isNaN(Number(value))) {
				value = Number(value);
			}
		}
		const confirmable: boolean =
			data.name === 'name'
				? data.value
					? this.checkState()
					: false
				: this.state.confirmable;

		this.setState({
			...this.state,
			kittenInfo: { ...this.state.kittenInfo, [data.name]: value },
			confirmable: confirmable
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
		this.onDataSendStart();

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
			this.onDataSendEnd();
			console.warn(e);
		}
	}

	onDataSendStart() {
		this._loadingRef.onFeatureChangeStart();
	}

	onDataSendEnd() {
		this._loadingRef.onFeatureChangeEnd();
	}

	onEditingStart() {
		if (!this.state.editing) {
			this.setState({ ...this.state, editing: true });
		}
	}

	onEditingEnd() {
		if (this.state.editing) {
			this.setState({ ...this.state, editing: false });
		}
	}

	render() {
		const TextInputContainer = (
			<View
				style={{
					height: '18%',
					paddingTop: '1%',
					width: '80%'
				}}>
				<CustomTextInput
					style={{ width: '100%' }}
					name="name"
					value={this.state.kittenInfo.name?.toString()}
					maxlen={40}
					placeholder="Kitten name"
					onTextChange={data => this.updateData(data)}
					onEditingStart={this.onEditingStart.bind(this)}
					onEditingEnd={this.onEditingEnd.bind(this)}
				/>

				<View style={{ paddingTop: '1%' }} />
				<CustomTextInput
					style={{ width: '100%' }}
					name="age"
					type="number"
					value={this.state.kittenInfo.age?.toString()}
					maxlen={2}
					placeholder="Age (Optional)"
					onEditingStart={this.onEditingStart.bind(this)}
					onEditingEnd={this.onEditingEnd.bind(this)}
					onTextChange={data => this.updateData(data)}
				/>
			</View>
		);

		const ImagePreviewContainer = this.state.editing ? null : (
			<View
				style={{
					height: '60%',
					width: '80%',
					paddingTop: this.state.image ? '8%' : '1%'
				}}>
				{this.state.image && (
					<Image
						style={{
							borderRadius: 20,
							height: '100%',
							width: null,
							resizeMode: 'contain'
						}}
						source={{ uri: this.state.image.uri }}
					/>
				)}
				<View
					style={{
						marginTop: '4%',
						alignItems: 'center',
						width: '100%'
					}}>
					<CustomButton
						style={{
							alignSelf: 'center',
							width: '100%',
							borderRadius: 30
						}}
						title={
							this.state.image ? 'Change picture' : 'Take picture'
						}
						onPress={this.takePicture.bind(this)}
					/>
				</View>
			</View>
		);
		const ConfirmButtonContainer = this.state.editing ? null : (
			<View
				style={{
					height: '10%',
					position: 'absolute',
					bottom: 0
				}}>
				<CustomButton
					disabled={!this.state.confirmable}
					title="Confirm"
					onPress={this.insertKitten.bind(this)}
				/>
			</View>
		);

		return (
			<ScrollView
				contentContainerStyle={{
					alignItems: 'center',
					height: '100%',
					width: '100%'
				}}>
				<Loading
					getRef={ref => {
						this._loadingRef = ref;
					}}
				/>
				{TextInputContainer}
				{ImagePreviewContainer}
				{ConfirmButtonContainer}
			</ScrollView>
		);
	}
}
