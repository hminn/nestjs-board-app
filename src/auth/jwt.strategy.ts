import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // The class extends the PassportStrategy class defined by @nestjs/passport package
  // you're passing the JWT Strategy defined by the passport-jwt Node.js Package.
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    // passes two important options
    super({
      secretOrKey: 'Secret1234',
      // This configures the secret key that JWT Strategy will use
      // to decrypt the JWT token in order to validate it
      // and access its payload
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // This configures the Strategy (imported from passport-jwt package)
      // to look for the JWT in the Authorization Header of the current Request
      // passed over as a Bearer token.
    });
  }

  async validate(payload): Promise<User> {
    const { username } = payload;
    const user: User = await this.userRepository.findOne({ username });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
