declare module 'react' {
  export type PropsWithChildren<P = unknown> = P & { children?: any };
  export type ButtonHTMLAttributes<T> = Record<string, any>;
  export type InputHTMLAttributes<T> = Record<string, any>;
  export type TextareaHTMLAttributes<T> = Record<string, any>;
  export type ChangeEvent<T = any> = { target: T & { value: string; checked?: boolean; files?: FileList | null; type?: string } };
  export const StrictMode: any;
  export function useState<T>(initial: T): [T, (value: T | ((current: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void) | Promise<void>, deps?: unknown[]): void;
  export function useMemo<T>(factory: () => T, deps: unknown[]): T;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: unknown[]): T;
}

declare module 'react-dom/client' {
  export function createRoot(container: Element | DocumentFragment): {
    render(node: any): void;
  };
}

declare module 'react/jsx-runtime' {
  export const Fragment: any;
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
}

declare module '@mozilla/readability' {
  export class Readability {
    constructor(document: Document);
    parse(): { title?: string; textContent?: string; content?: string } | null;
  }
}

declare module 'uuid' {
  export function v4(): string;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare const chrome: any;

declare module 'node:path' {
  export function resolve(...parts: string[]): string;
}

declare module 'vite' {
  export function defineConfig(config: any): any;
}

declare module '@vitejs/plugin-react' {
  export default function react(): any;
}

declare const __dirname: string;
