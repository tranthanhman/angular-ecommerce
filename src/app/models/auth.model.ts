export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface User {
  _id: string;
  __v: number;
  avatar: {
    _id: string;
    localPath: string;
    url: string;
  };
  createdAt: string;
  email: string;
  isEmailVerified: boolean;
  loginType: string;
  role: string;
  updatedAt: string;
  username: string;
}
