export interface AuthRequest {
  username: string;
  password: string;
}

export interface BaseResponse<T> {
  code: string | null;
  message: string | null;
  data: T;
}

export interface UserInfo {
  id: number;
  username: string | null;
  userDept: string | null;
  userBranch: string | null;
  userEmail: string | null;
  passwordChanged: string | null;
  role: string[] | null;
  token: string | null;
}

export interface UpdatePasswordRequest {
  username: string;
  otp: string;
  password: string;
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

export interface RegisterRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  credential: string;
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
