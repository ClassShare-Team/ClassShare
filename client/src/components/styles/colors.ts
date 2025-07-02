export const colors = {
  white: '#ffffff',
  black: '#000000',
  purple: '#7a36ff',
  gray100: '#e0e0e0',
  gray200: '#d1d5db', //주로 쓰는 그레이
  gray300: '#cccccc',
  gray400: '#999999',
  gray500: '#6b7280',
} as const;

export type ColorsType = typeof colors;
export type ColorsKeysType = keyof ColorsType;
