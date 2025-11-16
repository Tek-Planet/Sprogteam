interface fontsModel {
  bold: string;
  medium: string;
  light: string;
  regular: string;
}

type fontsSizeModel = {
  bold: number;
  medium: number;
  light: number;
  regular: number;
  intermediate: number;
};

export const fonts: fontsModel = {
  bold: 'Poppins-Bold',
  medium: 'Poppins-Medium',
  light: 'Poppins-Light',
  regular: 'Poppins-Regular',
};

export const fontSize: fontsSizeModel = {
  bold: 22,
  medium: 20,
  regular: 18,
  light: 16,
  intermediate: 15,
};
