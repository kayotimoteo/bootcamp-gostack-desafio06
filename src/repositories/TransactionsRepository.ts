import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const respositoryTransaction = getRepository(Transaction);

    const findTransactions = await respositoryTransaction.find();

    const income = findTransactions.reduce((acumulator, transaction) => {
      return transaction.type === 'income'
        ? acumulator + transaction.value
        : acumulator;
    }, 0);

    const outcome = findTransactions.reduce((acumulator, transaction) => {
      return transaction.type === 'outcome'
        ? acumulator + transaction.value
        : acumulator;
    }, 0);

    const total = income - outcome;

    const balance = {
      income,
      outcome,
      total,
    };
    return balance;
  }
}

export default TransactionsRepository;
