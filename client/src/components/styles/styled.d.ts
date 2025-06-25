import 'styled-components';
import { ThemeType } from '../styles/theme';

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {
    // eslint 오류 회피용 더미
    _dummy?: string;
  }
}
