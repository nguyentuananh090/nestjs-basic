import { Injectable, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schemas';
import { Model } from 'mongoose';
import {compareSync, genSaltSync,hashSync} from "bcryptjs";
import { ResponseDto } from 'src/common/dto/response.dto';


@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  hashPassword=(password:string)=>{
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash
  }
  async findByEmail(email: string){
    return await this.UserModel.findOne({ email }).exec();
     
  }
  
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      return {
        statusCode:400,
        error:  "Bad Request",
        message: 'Email already exists',
      };
    }

    const createdUser = new this.UserModel(createUserDto); // chỉ tạo instance, chưa lưu

    // Ví dụ: mã hóa mật khẩu hoặc xử lý dữ liệu
    createdUser.password = this.hashPassword(createdUser.password);

    const savedUser = await createdUser.save();
    return {
      statusCode:201,
      error: null,
      message: 'User created successfully',
      data: savedUser,
    };
  }

  async findAll() {
      const dataUser= await this.UserModel.find().exec();
      return {
        'status':'Lấy danh sách users',
        'error':false,
        'data':dataUser
      };
  }

  async findOne(id: string) {
    try{
      const userDetail= await this.UserModel.findOne({ _id:id }).exec();
      return ResponseDto.success(userDetail,'Thông tin user');

    }catch(error){
       return ResponseDto.success(null,'Không lấy được thông tin');
    }
  }

  findOneByUserName(username: string) {
    return this.UserModel.findOne({ email:username }).exec();
  }

  checkUserPassword(password:string,hash:string){
    return compareSync(password,hash);
  }

  async update(updateUserDto: UpdateUserDto) {
    try{
      const update= await this.UserModel.updateOne({_id: updateUserDto._id},{...CreateUserDto});
      return ResponseDto.success(null,"Cập nhật thông tin thành công")
    }catch(error){
       return ResponseDto.success(null,"Cập nhật thông tin thất bại")
    }
   
  }

  async remove(id: string) {
    try{
      const deleteUser= await this.UserModel.deleteOne({_id:id});
      return ResponseDto.success(null,`Xóa user thành công`)
    }catch(error){
       return ResponseDto.success(null,"Xóa user thất bại")
    }
  }
}
