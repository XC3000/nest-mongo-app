// todos.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

describe('TodosController', () => {
  let controller: TodosController;

  // We'll provide and use this mock directly so its jest.Mock types
  // don't need to conform to the real service's Mongoose types.

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [{ provide: TodosService, useValue: mockService }],
    }).compile();

    controller = module.get(TodosController);

    jest.clearAllMocks();
  });

  it('should call create', async () => {
    const dto = { title: 'test' };
    const result = { id: '1', ...dto };
    mockService.create.mockResolvedValue(result);

    expect(await controller.create(dto)).toEqual(result);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('should call findAll', async () => {
    const result = [{ id: '1' }];
    mockService.findAll.mockResolvedValue(result);

    expect(await controller.findAll()).toEqual(result);
    expect(mockService.findAll).toHaveBeenCalled();
  });

  it('should call findOne', async () => {
    const result = { id: '1' };
    mockService.findOne.mockResolvedValue(result);

    expect(await controller.findOne('1')).toEqual(result);
    expect(mockService.findOne).toHaveBeenCalledWith('1');
  });

  it('should call update', async () => {
    const result = { id: '1', title: 'updated' };
    mockService.update.mockResolvedValue(result);

    expect(await controller.update('1', { title: 'updated' })).toEqual(result);
    expect(mockService.update).toHaveBeenCalledWith('1', { title: 'updated' });
  });

  it('should call remove', async () => {
    const result = { deleted: true };
    mockService.remove.mockResolvedValue(result);

    expect(await controller.remove('1')).toEqual(result);
    expect(mockService.remove).toHaveBeenCalledWith('1');
  });
});
