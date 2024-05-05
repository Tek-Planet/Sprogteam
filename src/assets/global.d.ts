import '@react-navigation/native';

// Override the theme in react native navigation to accept our custom theme props.
declare module '@react-navigation/native' {
  export type ExtendedTheme = {
    dark: boolean;
    colors: {
      primary: string;
      background: string;
      card: string;
      text: string;
      border: string;
      notification: string;
      main: string;
      white: string;
      black: string;
      pink: string;
      red: string;
      green: string;
      gray: string;
      lightGray: string;
      ash: string;
      gold: string;
    };
  };
  export function useTheme(): ExtendedTheme;
}
