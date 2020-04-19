import { getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

import AppError from '../errors/AppError';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRepository = getRepository(Transaction);

    const transactionExist = await transactionRepository.find({
      where: { id },
    });

    if (!transactionExist) {
      throw new AppError('ID is incorrect or not exist', 401);
    }

    await transactionRepository.remove(transactionExist);
  }
}

export default DeleteTransactionService;
