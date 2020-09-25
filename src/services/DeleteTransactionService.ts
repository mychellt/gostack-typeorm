import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const repository = getCustomRepository(TransactionsRepository);
    const foundTransaction = await repository.findOne(id);
    if (!foundTransaction) {
      throw new AppError("Transaction doesn't not exist");
    }
    await repository.remove(foundTransaction);
  }
}

export default DeleteTransactionService;
