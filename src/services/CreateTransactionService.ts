import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

import TransactionsRepository from '../repositories/TransactionsRepository';

import CreateCategoryService from './CreateCategoryService';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getRepository(Transaction);

    const createCategory = new CreateCategoryService();

    const returnCategory = await createCategory.execute({ title: category });

    const transactionBalance = getCustomRepository(TransactionsRepository);

    const balance = transactionBalance.getBalance();

    if (type === 'outcome' && value > (await balance).total) {
      throw new AppError('insufficient funds', 400);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: returnCategory.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
