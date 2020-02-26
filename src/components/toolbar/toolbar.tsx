import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
	View,
	StyleSheet,
	Text,
	Dimensions,
	GestureResponderEvent
} from 'react-native';
import { FlashMode, CameraType } from 'react-native-camera';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from '../icon/icon';

const { width: winWidth, height: winHeight } = Dimensions.get('window');

const ToolbarStyle = StyleSheet.create({
	base: {
		width: winWidth,
		flex: 1,
		flexDirection: 'row',
		position: 'absolute',
		height: 100,
		bottom: 0,
		top: null
	},
	alignCenter: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	captureBtn: {
		width: 60,
		height: 60,
		borderWidth: 2,
		borderRadius: 60,
		borderColor: '#FFFFFF'
	},
	captureBtnInternal: {
		width: 56,
		height: 56,
		borderWidth: 2,
		borderRadius: 76,
		backgroundColor: 'white',
		borderColor: 'transparent'
	}
});

interface ToolbarProps {
	capturing: Boolean;
	flashMode: keyof FlashMode;
	cameraType: keyof CameraType;
	setFlashMode: Function;
	setCameraType: Function;
	onCapture: (event: GestureResponderEvent) => void;
}

export const Toolbar: React.FunctionComponent<ToolbarProps> = (
	props
): JSX.Element => {
	return (
		<View style={ToolbarStyle.base}>
			<View style={ToolbarStyle.alignCenter}>
				<Icon
					onPress={() =>
						props.setFlashMode(
							props.flashMode == 'on'
								? 'off'
								: props.flashMode == 'auto'
								? 'on'
								: 'auto'
						)
					}
					name={
						props.flashMode == 'off' ? 'md-flash-off' : 'md-flash'
					}
					opacity={props.flashMode == 'auto' ? 0.4 : 1}
				/>
			</View>
			<View style={ToolbarStyle.alignCenter}>
				<TouchableOpacity
					onPress={props.onCapture}
					style={{ bottom: 30 }}>
					<View style={ToolbarStyle.captureBtn}>
						<View style={ToolbarStyle.captureBtnInternal} />
					</View>
				</TouchableOpacity>
			</View>
			<View style={ToolbarStyle.alignCenter}>
				<Icon
					onPress={() =>
						props.setCameraType(
							props.cameraType === 'back' ? 'front' : 'back'
						)
					}
					name="md-reverse-camera"
				/>
			</View>
		</View>
	);
};
