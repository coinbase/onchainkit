type TextInputReact = {
    'aria-label'?: string;
    className: string;
    delayMs: number;
    disabled?: boolean;
    onBlur?: () => void;
    onChange: (s: string) => void;
    placeholder: string;
    setValue: (s: string) => void;
    value: string;
    inputValidator?: (s: string) => boolean;
};
export declare function TextInput({ 'aria-label': ariaLabel, className, delayMs, disabled, onBlur, onChange, placeholder, setValue, value, inputValidator, }: TextInputReact): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=TextInput.d.ts.map