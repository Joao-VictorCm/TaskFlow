import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingServiceProtocol } from './hash/hash.service';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly hashingService: HashingServiceProtocol,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}
  async authenticate(signInDto: SignInDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: signInDto.email, //verificando se o email ta cadastrado
        active: true,
      },
    });

    if (!user) {
      //se não tiver
      throw new HttpException(
        'Falha ao autenticar o usuario',
        HttpStatus.UNAUTHORIZED,
      );
    }

    //Validando/comparando a senha
    const passwordIsValid = await this.hashingService.compare(
      signInDto.password,
      user.passwordHash,
    );

    if (!passwordIsValid) {
      //se não for valida
      throw new HttpException(
        'Senha/usuario incorretos',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      {
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.jwtTtl,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      },
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token: token,
      avatar: user.avatar,
    };
  }
}
