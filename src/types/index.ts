import {ImageSourcePropType} from 'react-native';

export interface AccountType {
  id: string;
  title: string;
  body: string;
  image: ImageSourcePropType;
  role: 'Admin' | 'user' | 'interpreter';
}

export interface SelectOptionType {
  label: string;
  labeldk?: string;
  value: string;
  image?: ImageSourcePropType;
  sub_category?: SelectOptionType[];
  LanguageRequire?: false;
}

export interface OrderUpdateType {
  Id: string;
  Status?: 'Active' | 'Cancelled' | 'Completed' | 'Reviewed' | 'Pending';
}

export interface LanguageType {
  label: string;
  code: string;
  image?: ImageSourcePropType;
}

export interface TabItem {
  title: string;
  total?: number;
  value: string;
}

export interface RatingType {
  Id: string;
  CompanyId: string;
  UserId: string;
  OrderId: string;
  Created: Date;
  Review: string;
  Rating: number;
}

export interface UserModel {
  Id: string;
  Email: string;
  FirstName: string;
  Role: 'Admin' | 'user' | 'interpreter' | 'PrivateCustomer';
  About?: string;
  Address?: string;
  Zipcode?: string;
  City: string;
  State?: number;
  Adresse?: string;
  GenderId?: number;
  LastName?: string;
  interpreter?: boolean;
  MunicipalTasks?: boolean;
  PhoneNumber?: string;
  CVR?: string;
  Rating?: number;
  RatingNumber?: number;
  Country?: string;
  CategoryId?: number;
  DeparmentId?: number;
  Phonevideo?: number;
  Attendance?: number;
  KmPrice?: number;
  InboxId?: string;
  CreateAt: Date;
  ProfilePicture?: string;
  AttendancePrice?: number;
  VideoPhoneprice: number;
  CompanyName: string;
  ContractID?: number;
  lastMsg?: any;
  userId?: any;
  DOB?: any;
  EAN?: any;
  languages: SelectOptionType[];
  CompanyStatus?: 'Public' | 'Private' | 'Person';
}

export interface RegisterModel {
  Email?: string;
  PhoneNumber?: string;
  Role?: 'Admin' | 'user' | 'interpreter';
  FirstName?: string;
  ZipCode?: string;
  categoryId?: number;
  CompanyName?: string;
  CompanyDescription?: string;
  User_Type?: string;
  Education?: string;
  Gender?: string;
  CV?: string;
  CVR?: string;
  Att?: string;
  CVExtension?: string;
  Experiences?: string;
  Ind_Category?: number;
  Ind_Sub_Category?: number;
  Password?: string;
  title?: string;
  ConfirmPassword?: string;
  DOB?: Date;
  AttPerson?: string;
  code?: string;
}

export interface TokenModel {
  secret: string;
  token: string;
}

export interface CompanyFavourites {
  Id: number;
  User: UserModel;
}
export interface CompanyFavouritesModel {
  Id?: number;
  UserId: string;
  CompanyId: string;
}

export interface ENVIRONMENT {
  local: string;
  development: string;
  production: string;
}

export interface ChatModel {
  Id: string;
  ChannelId: string;
  SenderId: string;
  Message: string;
  SentTime: string;
  read?: boolean;
  isOffer: boolean | null;
  image: string | null;
  media?: string | null;
}

export interface BookingModel {
  Address?: string;
  Attachment?: null | string;
  BellStatus?: number;
  BookingForSelf?: boolean;
  BookingID: number;
  BookingtimeEndID?: null | string;
  ChangeInterpreter?: null | string;
  CitizenName?: string;
  CitizonPhone?: string;
  CompanyName?: string;
  CreateBy: string;
  CreateByApp: boolean;
  CreateDate: string;
  CustomerApprove?: null | string;
  DateTimeEnd: string;
  DateTimeStart: string;
  DepartmentID: number;
  DepartmentName?: string;
  DeptAdresse?: string;
  DeptCity?: string;
  DeptZipcode?: number;
  Duration: string;
  FromLanguageID: number;
  InterpreterID: string;
  InterpreterSalary: number;
  InterpreterSalaryPending?: null | string;
  IsBookingCompleted: number | null;
  MessageToCitizen?: null | string;
  NewEndTime?: null | string;
  OfferStage?: null | string;
  OrdreNumber?: null | string;
  OtherAdress?: null | string;
  PricesCustomer: number;
  RateStatus?: boolean;
  RekvirantID?: string;
  Remark?: string;
  RequirePolice?: boolean;
  ServiceId?: null | number;
  StatusName: number;
  TaskTypeId: number;
  Tfare: number;
  TfareCustomer: number;
  ToLanguageID?: number;
  ToLanguageName?: string;
  VideoApi?: null | string;
  kmTilTask: null | number;
}

export interface currency {
  dkk: string;
  usd: string;
}

// Create a TypeScript interface for the "Quotes" model
export interface QuoteType {
  QuoteID: number;
  ClientId: string;
  TranslatorId?: string;
  Title: string;
  DeadlineDate: string;
  ServiceId: number;
  EstimatedBudget: number;
  Descriptions: string;
  QuoteFile?: string;
  FromLanguageId: number;
  ToLanguageId: number;
  TaskId: number;
  QuoteStatusId: number;
  IsActive: boolean;
  CreateBy: string;
  CreateDate: Date;
  UpdateBy?: string;
  UpdateDate?: string;
  GID?: number;
  TranslatorServiceChargePer?: number;
  TranslatorServiceChargeAmount?: number;
  TranslatorAmount?: number;
  TotalAmount?: number;
  IsPaymentPaid?: boolean;
  PaymentTransactionId?: string;
  DeadlineNewDate?: Date;
  VerificationFile?: string;
  CustomerServiceChargePer?: number;
  CustomerServiceChargeAmount?: number;
  CustomerAmount?: number;
  AcceptAmount?: number;
  DeadlineTime: string;
  DeadlineNewTime?: Date;
  CurrencyId: number;
  FirstName?: string;
  LastName?: string;
  FromLanguageName?: string;
  ToLanguageName?: string;
  ServiceName: string;
  ServiceNameDK: string;
}

export interface GigType {
  ID: number;
  title: string;
  languageID: number;
  description: string;
  faq: string;
  imgOne: string;
  imgTwo: string;
  imgThree: string;
  status: null | string;
  userId: string;
  checkPhone?: boolean;
  checkVideo?: boolean;
  checkAttendance?: boolean;
  checkWritten?: boolean;
  service: string;
  serviceId: number;
  languageName: string;
  toLanguageName: string;
  toLanguageID: number;
  ActualCost: number;
  CreateDate: Date;
  isActive?: boolean;
  isDelete?: boolean;
  TaskId: number;
  CurrencyId: number;
  ToLanguage: any;
  FromLanguage: any;
  Service: any;
  SubService: any;
}

export interface QuoteDetail {
  QuoteDetailId: number;
  QuoteId: number;
  Comment: string;
  Price: number;
  UserId: string;
  DeadlineDate: Date;
  DeadlineTime: Date;
  CurrencyId: number;
  CreateDate: Date;
  user: UserModel;
}

export interface OTPModel {
  recipient: string;
  code: string;
  userName?: string;
}

export interface WrittenBooking {
  Id: number;
  OrderNumber: string;
  CreateDate: Date;
  CreateByUser: string;
  Deadline: string;
  LanguageFrom: number;
  LanguageTo: number;
  InterpreterId: string;
  CompanyName: string;
  Salaryinterpreter: number;
  PriceCustomer: number;
  Files: string;
  interpreterPay: boolean;
  InvoiceNumber: number;
  CustomerPay: boolean;
  BellaStatus: boolean;
  Status: number;
  FromLanguageName: string;
  ToLanguageName: string;
}
