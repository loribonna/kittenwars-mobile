import * as React from 'react';
import {
	Button,
	View,
	Image,
	Text,
	BackHandler,
	NativeEventSubscription,
	StyleSheet,
	GestureResponderEvent,
	AppState,
	AppStateStatus
} from 'react-native';
import {
	RNCamera,
	TakePictureResponse,
	CameraType,
	FlashMode
} from 'react-native-camera';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../App';
import { Toolbar } from '../../../components/toolbar/toolbar';

interface CameraProps {
	navigation: StackNavigationProp<RootStackParamList, 'Camera'>;
}
interface CameraState {
	photo?: TakePictureResponse;
	cameraType: keyof CameraType;
	flashMode: keyof FlashMode;
	capturing: Boolean;
}

const cameraStyle = StyleSheet.create({
	preview: {
		height: '100%',
		width: '100%'
	}
});

export class Camera extends React.Component<CameraProps, CameraState> {
	camera: RNCamera;
	backHandler: NativeEventSubscription;
	constructor(props) {
		super(props);
		this.state = {
			cameraType: 'back',
			flashMode: 'auto',
			capturing: false
		};
	}

	async takePicture(event: GestureResponderEvent): Promise<void> {
		this.setState({ ...this.state, capturing: true });
		try {
			const options = { quality: 0.5, base64: true };
			const data = await this.camera.takePictureAsync(options);
			//  eslint-disable-next-line
			console.log(data.uri);
		} catch (e) {
			console.log(e);
		} finally {
			this.setState({ ...this.state, capturing: false });
		}
	}

	_handleAppStateChange = (nextAppState: AppStateStatus) => {
		/* Reference to RNCamera instance */
		if (!this.camera) {
			return;
		}

		switch (nextAppState) {
			case 'active':
				this.camera.resumePreview();
				break;
			case 'background':
				this.camera.pausePreview();
				break;
			case 'inactive':
			default:
		}
	};

	componentDidMount() {
		AppState.addEventListener('change', this._handleAppStateChange);
	}

	componentWillUnmount() {
		AppState.removeEventListener('change', this._handleAppStateChange);
	}

	onFlashModeChange(mode: keyof FlashMode) {
		this.setState({ ...this.state, flashMode: mode });
	}

	onCameraTypeChange(type: keyof CameraType) {
		this.setState({ ...this.state, cameraType: type });
	}

	render() {
		return (
			<View>
				<RNCamera
					ref={ref => {
						this.camera = ref;
					}}
					type={this.state.cameraType}
					flashMode={this.state.flashMode}
					androidCameraPermissionOptions={{
						title: 'Permission to use camera',
						message: 'We need your permission to use your camera',
						buttonPositive: 'Ok',
						buttonNegative: 'Cancel'
					}}>
					{({ camera, status, recordAudioPermissionStatus }) => {
						if (status !== 'READY') return null;
						return <View style={cameraStyle.preview} />;
					}}
				</RNCamera>
				<Toolbar
					onCapture={this.takePicture.bind(this)}
					setCameraType={type => this.onCameraTypeChange(type)}
					setFlashMode={mode => this.onFlashModeChange(mode)}
					capturing={this.state.capturing}
					cameraType={this.state.cameraType}
					flashMode={this.state.flashMode}
				/>
			</View>
		);
	}
}
