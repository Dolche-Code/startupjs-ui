/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode } from 'react';
import { type DivProps } from '@startupjs-ui/div';
declare const _default: import("react").ComponentType<ContentProps>;
export default _default;
export declare const _PropsJsonSchema: {};
export interface ContentProps extends Omit<DivProps, 'style' | 'padding' | 'full'> {
    /** Custom styles applied to the root view */
    style?: DivProps['style'];
    /** Content rendered inside wrapper */
    children?: ReactNode;
    /** Add equal top and bottom padding. true maps to default spacing @default false */
    padding?: boolean | number;
    /** Expand to take full available space in parent flex layout @default false */
    full?: boolean;
    /** Content width preset @default 'tablet' */
    width?: 'mobile' | 'tablet' | 'desktop' | 'wide' | 'full';
    /** Remove horizontal paddings */
    pure?: boolean;
}
