import { getCustomRepository, getRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionRepository);
    const categoriesRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();
    if (type === 'outcome' && total < value) {
      throw new AppError('You do not have enough balance');
    }

    let transationCategory = await categoriesRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!transationCategory) {
      transationCategory = categoriesRepository.create({
        title: category,
      });
      await categoriesRepository.save(transationCategory);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: transationCategory,
    });
    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
