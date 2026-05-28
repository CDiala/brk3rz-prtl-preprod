export interface AuthRequest {
  email: string;
  password: string;
}

export interface BaseResponse<T> {
  code: string | null;
  message: string | null;
  data: T;
}

export interface PublicKeyResponse {
  publicKey: string | null;
}

export interface UserInfo {
  userId: string | null;
  accessExpiresAt: string | null;
  refreshExpiresAt: string | null;
}

export interface AuthResponse {
  code: string;
  message: string;
  data: UserInfo;
}

// export interface UserInfo {
//   id: number;
//   username: string | null;
//   userDept: string | null;
//   userBranch: string | null;
//   userEmail: string | null;
//   passwordChanged: string | null;
//   role: string[] | null;
//   token: string | null;
// }

export interface userMeResponse<userMeData> {
  code: string;
  message: string;
  data: userMeData | null;
}

export interface userMeData {
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

export interface RegisterRequest {
  email: string;
  defaultPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UpdatePasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ResetLinkInfo {
  email: string;
  isEmailSent: boolean | null;
}

// unused interfaces below
// unused interfaces below
// unused interfaces below
export interface LoggedInClient {
  isLoggedIn: boolean;
  user: string;
  id: string;
  accType: string;
  isERM: boolean;
  isInitiator: boolean;
  isApprover: boolean;
}

export interface User {
  email: string;
  phone: string;
}

export interface ResetPasswordResponse {
  code: number;
  message: string;
  data: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthRole {
  id: number;
  email: string;
  name: string | null;
  phoneNumber: string | null;
  credential: string;
  changed: boolean;
  lastLogin: string | null;
  createDate: string | null;
  otp: string | null;
  otP_Start: string | null;
  otP_Expiration: string | null;
  userType: number;
  ermGroup: boolean;
  qmsInitiator: boolean;
  qmsApprover: boolean;
}

import { AttachmentModel } from './attachment.model';

export interface UserModel {
  id: string;
  name: string;
  email: string;
  account: string;
}
export interface UserDetails extends UserModel {
  phone?: string;
  status: 'active' | 'inactive';
  attachments: AttachmentModel[];
}

export interface UserInfoModel extends UserInfo {
  active: boolean;
  otP_sent: string | null;
}

export interface RoleModel {
  id: number;
  roleName: string;
  createDate: string;
}

export interface sendResetLinkPayload {
  email: string;
}

export interface sendResetLinkResponse<T> {
  code: string;
  message: string;
  data: T;
}


export interface useCredForUpload {
  userId: string;
  companyName: string;
}
