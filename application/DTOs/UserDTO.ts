export interface SaveUserDTO {
  username: string;
  typeId: number;
  password: string;
  email: string;
  active?: boolean;
}

export interface UpdateUserDTO {
  userId: number;
  username?: string;
  userTypeId?: number;
  password?: string;
  email?: string;
  active?: boolean;
}

export interface UserResponseDTO {
  userId: number;
  username: string;
  userTypeId: number;
  email: string;
  active: boolean;
  userType?: {
    userTypeId: number;
    name: string;
  };
}

export interface SaveUserTypeDTO {
  name: string;
  permissionLevel:number;
}

export interface UserTypeResponseDTO{
    userTypeId:number;
    name:string;
    permissionLevel:number;

}