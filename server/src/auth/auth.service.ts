import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto, LoginUserDto } from '../users/dto/user.dto';
import { UserRole } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      // Always set role to student for registration
      createUserDto.role = UserRole.STUDENT;

      // Log registration attempt
      console.log('Attempting to register user:', {
        ...createUserDto,
        password: '***',
      });

      // Check if email already exists
      const emailExists = await this.usersService.emailExists(
        createUserDto.email,
      );
      if (emailExists) {
        console.log(`Email already exists: ${createUserDto.email}`);
        throw new ConflictException('Email already exists');
      }

      // Create the user
      const user = await this.usersService.create(createUserDto);
      console.log('User registered successfully:', {
        id: (user as any).id,
        email: user.email,
      });
      return { message: 'User registered successfully', user };
    } catch (error) {
      if (
        error.code === 11000 ||
        (error.name === 'MongoServerError' && error.code === 11000)
      ) {
        // MongoDB duplicate key error
        console.log(
          'MongoDB duplicate key error for email:',
          createUserDto.email,
        );
        throw new ConflictException('Email already exists');
      }
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const user = await this.usersService.findByEmail(loginUserDto.email);

      // Check if password is valid
      const isPasswordValid = await user.validatePassword(
        loginUserDto.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate JWT token
      const payload = {
        email: user.email,
        sub: (user as any)._id,
        role: user.role,
      };
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: (user as any)._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  // Method to update user role - only accessible to admins via guard
  async updateUserRole(userId: string, newRole: UserRole) {
    return this.usersService.update(userId, { role: newRole });
  }
}
