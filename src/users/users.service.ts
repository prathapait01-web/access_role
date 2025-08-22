import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,  
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userModel.findOne({ email: createUserDto.email });
    if (existing) throw new ConflictException('User already exists');

    const hashed = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new this.userModel({ ...createUserDto, password: hashed });
    return newUser.save();
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('No User Found :(');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid Password :(');

    
    const payload = { sub: user._id, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful',
      token, 
      user: { id: user._id, email: user.email, role: user.role },
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }
async deleteUser(id: string) {
  try {
    const res = await this.userModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('User not found');
    return { message: 'User deleted successfully' };
  } catch (error) {
    console.error('Delete error:', error.message);
    throw error;
  }
}

}
