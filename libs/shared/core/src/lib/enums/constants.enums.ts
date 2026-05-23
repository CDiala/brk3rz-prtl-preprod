// import { renewalURL, vehicleModelURL } from '../urls/url';

export enum BUSINESS_TYPES_ENUM {
  NEW = 'new',
  RENEW = 'renew',
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

export enum MaritalStatus {
  Single = 'Single',
  Married = 'Married',
  Divorced = 'Divorced',
  Widowed = 'Widowed',
}

export enum IdentificationMode {
  NIN = 'NIN',
  Passport = 'International Passport',
  DriversLicense = 'Drivers License',
}

export enum EmploymentMode {
  Employed = 'Employee',
  SelfEmployed = 'Self Employed',
  Unemployed = 'Unemployed',
}

export enum SearchOptions {
  PolicyNumber = 'Policy number',
  RegNumber = 'Reg number',
  Email = 'Email Address',
  // Phone = 'Phone number',
}

export enum PolicyTypes {
  ThirdPartyMotor = 'Third-Party Motor',
  PersonalAccident = 'Personal Accident',
}

export enum PaystackChannels {
  Card = 'card',
  Bank = 'bank',
  BankTransfer = 'bank_transfer',
}

export const bvnPattern = '\\d{11}$';

export const phoneNumberPattern = '^(0\\d{10}|(?:\\+[1-9]\\d{7,14}))$';

export const decryptPayloadsNoEncrypt = [];

export const qParamExclusion = [];

export const chassisLength = 17;

export const maxFileSize = 2;
