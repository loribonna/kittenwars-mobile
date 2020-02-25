import * as React from 'react';
import {
	Button,
	View,
	Image,
	Text,
	BackHandler,
	NativeEventSubscription
} from 'react-native';
import { RNCamera, TakePictureResponse } from 'react-native-camera';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../App';

interface CameraProps {
	navigation: StackNavigationProp<RootStackParamList, 'Camera'>;
}
interface CameraState {
	photo?: TakePictureResponse;
	preview: Boolean;
}

export class Camera extends React.Component<CameraProps, CameraState> {
	camera: RNCamera;
	backHandler: NativeEventSubscription;
	constructor(props) {
		super(props);
		this.state = { preview: false };
	}

	resumeCamera(camera: RNCamera) {
		if (camera) {
			camera.resumePreview();
			this.setState({ ...this.state, preview: true });
		}
	}

	stopCamera(camera: RNCamera) {
		if (camera) {
			camera.pausePreview();
			this.setState({ ...this.state, preview: false });
		}
	}

	async takePicture(camera: RNCamera) {
		try {
			const options = { quality: 0.5, base64: true };
			const data = await camera.takePictureAsync(options);
			//  eslint-disable-next-line
			console.log(data.uri);
		} catch (e) {
			console.log(e);
		}
	}

	render() {
		return (
			<View>
				{this.state.preview && (
					<View>
						<Button
							title="Stop Picture"
							onPress={() => this.stopCamera(this.camera)}
						/>
					</View>
				)}
				{!this.state.preview && (
					<Button
						title="Resume Picture"
						onPress={() => this.resumeCamera(this.camera)}
					/>
				)}
				<RNCamera
					ref={ref => {
						this.camera = ref;
					}}
					type={RNCamera.Constants.Type.back}
					flashMode={RNCamera.Constants.FlashMode.on}
					androidCameraPermissionOptions={{
						title: 'Permission to use camera',
						message: 'We need your permission to use your camera',
						buttonPositive: 'Ok',
						buttonNegative: 'Cancel'
					}}>
					{({ camera, status, recordAudioPermissionStatus }) => {
						if (status !== 'READY' || !this.state.preview)
							return null;
						return (
							<View
								style={{
									height: '100%',
									width: null
								}}>
								<TouchableOpacity
									onPress={() => this.takePicture(camera)}>
									<Text style={{ fontSize: 14 }}> SNAP </Text>
								</TouchableOpacity>
							</View>
						);
					}}
				</RNCamera>

				{/* 
				<RNCamera
					ref={ref => {
						this.camera = ref;
					}}
					type={RNCamera.Constants.Type.back}
					flashMode={RNCamera.Constants.FlashMode.auto}
					androidCameraPermissionOptions={{
						title: 'Permission to use camera',
						message:
							'Kittenwars need your permission to use your camera',
						buttonPositive: 'Ok',
						buttonNegative: 'Cancel'
					}}
				/>

				{this.state.photo && (
					<View style={{ height: '40%' }}>
						<Image
							style={{
								height: '100%',
								width: null,
								resizeMode: 'contain'
							}}
							source={{ uri: this.state.photo.uri }}
						/>
					</View>
				)}

				 */}
			</View>
		);
	}
}
