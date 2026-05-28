import { getUserIdError } from './auth.actions';
/**
 * Interface for the 'Auth' data
 */
export interface AuthEntity {
  id: string | number; // Primary ID
  name: string;
}

export interface userAuthId {
  userId: string | null;
}

export interface userSuccessResponse {
  code: string;
  message: string;
  data: userNameData;
}

export interface userNameData {
  companyName: string;
}

export interface uploadLicenceSuccessResponse {
  code: string;
  message: string;
  data: null;
}

export interface getUserMeSuccessResponse {
  code: string;
  message: string;
  data: getUserMeResData;
}

export interface getUserMeResData {
   id: string;
    companyName: string;
    registrationNumber: string;
    userName: string;
    emailAddress: string;
    address: string;
    state: string;
    lga: string;
    directorName: string;
    contactNumbers: string;
    tin: string;
}