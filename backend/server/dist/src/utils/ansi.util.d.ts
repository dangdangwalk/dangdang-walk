export default function stripAnsi(text: string): string;
export declare function bold(text: string): string;
export declare function italic(text: string): string;
export type Color = 'Black' | 'Red' | 'Green' | 'Yellow' | 'Blue' | 'Magenta' | 'Cyan' | 'White';
export declare function color(text: string, color: Color): string;
