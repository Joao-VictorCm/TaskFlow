import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersController } from './users.controller';

describe('Users Controller', () => {
  let controller: UsersController;

  const userServiceMock = {
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    uploadAvatarImage: jest.fn(),
  };

  beforeEach(() => {
    controller = new UsersController(userServiceMock as any);
  });

  it('should find One user', async () => {
    const userId = 1;

    await controller.findOneUser(userId);

    expect(userServiceMock.findOne).toHaveBeenCalledWith(userId);
  });

  it('should create new user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'teste',
      email: 'teste@gmail.com',
      password: '123456',
    };
    await controller.createUser(createUserDto);

    expect(userServiceMock.create).toHaveBeenCalledWith(createUserDto);
  });

  it('should update user', async () => {
    const userId = 1;
    const updateUserDto: UpdateUserDto = {
      name: 'Teste novo',
    };

    const tokenPayLoad: PayloadTokenDto = {
      sub: userId,
      aud: 1,
      email: '',
      exp: 1,
      iat: 1,
      iss: 1,
    };

    const updateUser = {
      id: userId,
      name: 'Teste novo',
      email: 'teste@gmail.com',
    };

    await controller.updateUser(userId, updateUserDto, tokenPayLoad);

    expect(userServiceMock.update).toHaveBeenCalledWith(
      userId,
      updateUserDto,
      tokenPayLoad,
    );
  });
});
