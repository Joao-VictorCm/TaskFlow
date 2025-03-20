class ITask {
  id: number;
  name: string;
  description: string;
  completed: boolean;
  createdAt?: Date;
  userId: number;
}

export class ResponseFindOneUserDto {
  id: number;
  name: string;
  email: string;
  avatar: string;
  Task: ITask[];
}

export class ResponseCreateUserDto {
  id: number;
  name: string;
  email: string;
}
