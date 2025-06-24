export const colors = {
  white: '#ffffff',
  black: '#000000',
  purple: '#7a36ff',
  gray100: '#d1d5db',
  gray300: '#999999',
} as const;

export type ColorsType = typeof colors;
export type ColorsKeysType = keyof ColorsType;
