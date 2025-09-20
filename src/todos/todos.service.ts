import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoDocument } from './schemas/todo.schema';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todo.name) private readonly todoModel: Model<TodoDocument>,
  ) {}

  create(dto: CreateTodoDto) {
    return this.todoModel.create(dto);
  }

  findAll() {
    return this.todoModel.find().sort({ createdAt: -1 }).lean();
  }

  async findOne(id: string) {
    const doc = await this.todoModel.findById(id).lean();
    if (!doc) throw new NotFoundException('Todo not found');
    return doc;
  }

  async update(id: string, dto: UpdateTodoDto) {
    const doc = await this.todoModel
      .findByIdAndUpdate(id, dto, { new: true })
      .lean();
    if (!doc) throw new NotFoundException('Todo not found');
    return doc;
  }

  async remove(id: string) {
    const res = await this.todoModel.findByIdAndDelete(id).lean();
    if (!res) throw new NotFoundException('Todo not found');
    return { deleted: true };
  }
}
