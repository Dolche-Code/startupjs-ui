/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode, type RefObject } from 'react';
import { type StyleProp, type TextStyle, type ViewStyle, type TextInputProps } from 'react-native';
declare const _default: import("react").ComponentType<UITextInputProps>;
export default _default;
export declare const _PropsJsonSchema: {};
export interface UITextInputProps extends Omit<TextInputProps, 'placeholder' | 'style'> {
    /** Ref to access the underlying input */
    ref?: RefObject<any>;
    /** Custom styles for the wrapper element */
    style?: StyleProp<ViewStyle>;
    /** Custom styles for the input element */
    inputStyle?: StyleProp<TextStyle>;
    /** Custom styles for the primary icon */
    iconStyle?: StyleProp<TextStyle>;
    /** Custom styles for the secondary icon */
    secondaryIconStyle?: StyleProp<TextStyle>;
    /** Placeholder text */
    placeholder?: string | number;
    /** Test identifier */
    testID?: string;
    /** Input value @default '' */
    value?: string;
    /** Size preset @default 'm' */
    size?: 'l' | 'm' | 's';
    /** Disable input interactions @default false */
    disabled?: boolean;
    /** Render a non-editable value @default false */
    readonly?: boolean;
    /** Enable dynamic height based on content @default false */
    resize?: boolean;
    /** Number of lines to display @default 1 */
    numberOfLines?: number;
    /** Primary icon component */
    icon?: any;
    /** Position of the primary icon @default 'left' */
    iconPosition?: 'left' | 'right';
    /** Secondary icon component */
    secondaryIcon?: any;
    /** Primary icon press handler */
    onIconPress?: () => void;
    /** Secondary icon press handler */
    onSecondaryIconPress?: () => void;
    /** Focus event handler */
    onFocus?: (...args: any[]) => void;
    /** Blur event handler */
    onBlur?: (...args: any[]) => void;
    /** Change text handler */
    onChangeText?: (...args: any[]) => void;
    /** Custom wrapper renderer @private */
    _renderWrapper?: (options: {
        style?: StyleProp<ViewStyle>;
    }, children: ReactNode) => ReactNode;
    /** Error state flag @private */
    _hasError?: boolean;
}
