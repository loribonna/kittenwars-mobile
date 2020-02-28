import * as React from 'react';
import {
	Text,
	StyleSheet,
	View,
	NativeEventSubscription,
	Keyboard,
	NativeSyntheticEvent,
	TextInputKeyPressEventData
} from 'react-native';
import { SubjectData } from '../../helpers/types';
import { TextInput } from 'react-native-gesture-handler';

interface TextInputProps {
	label?: string;
	value?: string;
	placeholder: string;
	name: string;
	maxlen?: number;
	type?: 'string' | 'number';
	onTextChange?: (data: SubjectData) => void;
	onEditingStart?: () => void;
	onEditingEnd?: () => void;
}

interface TextInputState {
	value: string;
	keyboard: boolean;
}

const style = StyleSheet.create({
	textInput: {
		alignSelf: 'center',
		justifyContent: 'center',
		borderRadius: 30,
		borderWidth: 2,
		borderColor: 'lightblue',
		width: '80%'
	}
});

export class CustomTextInput extends React.Component<
	TextInputProps,
	TextInputState
> {
	keyboardOpen: NativeEventSubscription;
	keyboardClose: NativeEventSubscription;
	constructor(props) {
		super(props);
		this.state = {
			value: props.value || '',
			keyboard: false
		};
	}

	componentDidMount() {
		if (this.props.onEditingStart) {
			this.keyboardOpen = Keyboard.addListener(
				'keyboardDidShow',
				this.keyboardShow.bind(this)
			);
		}
		if (this.props.onEditingEnd) {
			this.keyboardClose = Keyboard.addListener(
				'keyboardDidHide',
				this.endEditing.bind(this)
			);
		}
	}

	componentWillUnmount() {
		if (this.keyboardOpen) {
			this.keyboardOpen.remove();
		}
		if (this.keyboardClose) {
			this.keyboardClose.remove();
		}
	}

	endEditing() {
		if (this.state.keyboard) {
			this.setState({ ...this.state, keyboard: false });
			if (this.props.onEditingEnd) {
				this.props.onEditingEnd();
			}
		}
	}

	keyboardShow() {
		if (this.state.keyboard && this.props.onEditingStart) {
			this.props.onEditingStart();
		}
	}

	startEditing() {
		if (!this.state.keyboard) {
			this.setState({ ...this.state, keyboard: true });
		}
	}

	handleTextChange(text: string) {
		if (this.props.onTextChange) {
			this.setState({ ...this.state, value: text });

			const data: SubjectData = {
				name: this.props.name,
				value: text,
				type: this.props.type
			};

			this.props.onTextChange(data);
		}
	}

	render() {
		return (
			<View style={style.textInput}>
				{this.props.label && (
					<Text style={{ paddingRight: 2 }}>{this.props.label}</Text>
				)}
				<TextInput
					keyboardType={
						this.props.type === 'number' ? 'numeric' : 'default'
					}
					onResponderStart={this.startEditing.bind(this)}
					// style={style.textInput}
					placeholder={this.props.placeholder}
					maxLength={this.props.maxlen ? this.props.maxlen : null}
					value={this.state.value}
					onChangeText={text => this.handleTextChange(text)}
				/>
			</View>
		);
	}
}
