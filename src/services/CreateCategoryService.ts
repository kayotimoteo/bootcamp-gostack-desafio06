import { getRepository } from 'typeorm';

// import AppError from '../errors/AppError';

import Category from '../models/Category';

interface Request {
  title: string;
}

class CreateTransactionService {
  public async execute({ title }: Request): Promise<Category> {
    const categoryRepository = getRepository(Category);

    const findCategory = await categoryRepository.findOne({
      where: { title },
    });

    if (findCategory) {
      return findCategory;
    }

    const createCategory = categoryRepository.create({
      title,
    });
    await categoryRepository.save(createCategory);

    return createCategory;
  }
}

export default CreateTransactionService;
