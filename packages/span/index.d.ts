/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode } from 'react';
import { type TextStyle, type StyleProp, type TextProps } from 'react-native';
import './index.styl';
export declare const _PropsJsonSchema: {};
export interface SpanProps extends TextProps {
    style?: StyleProp<TextStyle>;
    children?: ReactNode;
    /** @deprecated use h1-h6 props instead */
    variant?: 'default' | 'description' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    /** bold text */
    bold?: boolean;
    /** italic text */
    italic?: boolean;
    /** full width (flex: 1) */
    full?: boolean;
    /** description text color */
    description?: boolean;
    /** theme name */
    theme?: string;
    /** h1 header */
    h1?: boolean;
    /** h2 header */
    h2?: boolean;
    /** h3 header */
    h3?: boolean;
    /** h4 header */
    h4?: boolean;
    /** h5 header */
    h5?: boolean;
    /** h6 header */
    h6?: boolean;
}
declare const _default: import("react").ComponentType<SpanProps>;
export default _default;
