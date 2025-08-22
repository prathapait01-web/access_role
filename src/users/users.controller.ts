import { Controller, Get, Post, Body, Delete, Param, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Auth } from '../common/roles.decorator';
import { Role } from '../common/roles.enum';
import { RolesGuard } from 'src/common/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.usersService.login(body.email, body.password);
  }


@Auth(Role.Admin)
@Get()
async findAll() {
    return this.usersService.findAll();
}


@Auth(Role.Admin)
@Delete(':id')
async remove(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
@Auth(Role.Admin)
@Post('create')
async createUserByAdmin(@Body() dto: CreateUserDto) {
  return this.usersService.create(dto);
}
}
