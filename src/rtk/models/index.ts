import {
  GigType,
  LanguageType,
  TokenModel,
  UserModel,
  currency,
} from '../../types';

// category
export interface Category {
  id: string;
  title: String;
  icon: String;
}

export interface LoginModel {
  UserName: string;
  Password: String;
}

export interface UserState {
  user: UserModel;
  token: TokenModel;
  error: string | undefined;
  authenticated: Boolean;
  loading: Boolean;
  currency: currency;
  currentRoute: string;
  gigState: GigType | undefined;
  defaultLanguage: LanguageType | undefined;

  //orders
}
