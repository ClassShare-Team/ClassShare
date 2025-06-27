export const colors = {
  white: '#ffffff',
  black: '#000000',
  purple: '#7a36ff',
  gray100: '#e0e0e0',
  gray200: '#d1d5db',
  gray300: '#cccccc',
  gray400: '#999999',
  gray500: '#6b7280',
} as const;

export type ColorsType = typeof colors;
export type ColorsKeysType = keyof ColorsType;
