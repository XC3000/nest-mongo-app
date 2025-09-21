import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { getModelToken } from '@nestjs/mongoose';
import { Todo } from './schemas/todo.schema';
import { NotFoundException } from '@nestjs/common';

const createMockModel = () => {
  return {
    create: jest.fn(),
    find: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    lean: jest.fn(),
    findById: jest.fn().mockReturnThis(),
    findByIdAndUpdate: jest.fn().mockReturnThis(),
    findByIdAndDelete: jest.fn().mockReturnThis(),
  };
};

describe('TodosService', () => {
  let service: TodosService;
  let model: ReturnType<typeof createMockModel>;

  beforeEach(async () => {
    model = createMockModel();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        { provide: getModelToken(Todo.name), useValue: model },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
  });

  it('should create a todo', async () => {
    const dto = { title: 'Test', description: 'desc' };
    const created = { _id: '1', ...dto, done: false };
    model.create.mockResolvedValue(created);

    const res = await service.create(dto);
    expect(model.create).toHaveBeenCalledWith(dto);
    expect(res).toEqual(created);
  });

  it('should list todos (findAll)', async () => {
    const data = [
      { _id: '1', title: 'A' },
      { _id: '2', title: 'B' },
    ];
    model.lean.mockResolvedValue(data);

    const res = await service.findAll();
    expect(model.find).toHaveBeenCalled();
    expect(model.sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(model.lean).toHaveBeenCalled();
    expect(res).toEqual(data);
  });

  it('should get a todo by id', async () => {
    const data = { _id: '1', title: 'A' };
    model.lean.mockResolvedValueOnce(data);

    const res = await service.findOne('1');
    expect(model.findById).toHaveBeenCalledWith('1');
    expect(res).toEqual(data);
  });

  it('should throw NotFound on get by id', async () => {
    model.lean.mockResolvedValueOnce(null);
    await expect(service.findOne('x')).rejects.toThrow(NotFoundException);
  });

  it('should update a todo', async () => {
    const updated = { _id: '1', title: 'U' };
    model.lean.mockResolvedValueOnce(updated);

    const res = await service.update('1', { title: 'U' });
    expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
      '1',
      { title: 'U' },
      { new: true },
    );
    expect(res).toEqual(updated);
  });

  it('should throw NotFound on update', async () => {
    model.lean.mockResolvedValueOnce(null);
    await expect(service.update('x', { title: 'U' })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should remove a todo', async () => {
    const removed = { _id: '1', title: 'A' };
    model.lean.mockResolvedValueOnce(removed);

    const res = await service.remove('1');
    expect(model.findByIdAndDelete).toHaveBeenCalledWith('1');
    expect(res).toEqual({ deleted: true });
  });

  it('should throw NotFound on remove', async () => {
    model.lean.mockResolvedValueOnce(null);
    await expect(service.remove('x')).rejects.toThrow(NotFoundException);
  });
});
