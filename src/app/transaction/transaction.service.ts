import * as crypto from 'crypto';

import { Inject, Injectable } from '@nestjs/common';
import { QueryTypes, Transaction as SequelizeTransaction } from 'sequelize';
import User from '@/shared/models/user.model';
import { HttpException } from '@/shared/errors/http/http-exception.error';
import Transaction from '@/shared/models/transaction.model';
import { CreateTransactionDto } from './dtos/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(HttpException.name)
    private readonly httpException: typeof HttpException,
    @Inject(User.name)
    private readonly transactionRepository: typeof Transaction,
  ) { }

  async createTransaction({
    sender_id,
    receiver_id,
    amount,
  }: CreateTransactionDto) {
    const result = await this.transactionRepository.sequelize.transaction(async (t) => {
      const sender = await User.findByPk(sender_id, { transaction: t });
      const receiver = await User.findByPk(receiver_id, { transaction: t });

      if (!sender) {
        throw this.httpException.badRequest('Sender não encontrado');
      }

      if (!receiver) {
        throw this.httpException.badRequest('Receiver não encontrado');
      }

      const senderBalance = await this.getBalance(sender_id, t);

      if (senderBalance < amount) {
        throw this.httpException.badRequest('Saldo insuficiente');
      }

      const lastSenderTransaction = await Transaction.findOne({
        where: { sender_id },
        order: [['createdAt', 'DESC']],
        transaction: t,
      });

      if (lastSenderTransaction) {
        const previousTransaction = await Transaction.findOne({
          where: { sender_id },
          order: [['createdAt', 'DESC']],
          offset: 1,
          transaction: t,
        });

        if (previousTransaction) {
          const expectedHash = TransactionService.generateHash(previousTransaction);

          if (lastSenderTransaction.hash !== expectedHash) {
            throw this.httpException.badRequest('A última transação do sender foi comprometida');
          }
        }
      }

      const transactionModel: Partial<Transaction> = {
        sender_id,
        receiver_id,
        amount,
        status: 'completed',
        previoushash: lastSenderTransaction ? lastSenderTransaction.hash : '0',
      };

      transactionModel.hash = TransactionService.generateHash(transactionModel);

      const transaction = await Transaction.create(transactionModel, { transaction: t });

      const transactionJson = transaction.toJSON();

      return {
        transaction_id: transactionJson.id,
        hash: transactionJson.hash,
        transaction_amount: transactionJson.amount,
        sender_name: sender.person_name,
        sender_id: sender.id,
        receiver_name: receiver.person_name,
        receiver_id: receiver.id,
      };
    });

    return result;
  }

  async getBalance(user_id: string, t: SequelizeTransaction): Promise<number> {
    const sql = `--sql
      SELECT
        COALESCE(SUM(CASE WHEN receiver_id = :user_id THEN amount ELSE 0 END), 0)
        - COALESCE(SUM(CASE WHEN sender_id = :user_id THEN amount ELSE 0 END), 0)
      AS balance FROM transactions WHERE status = 'COMPLETED';`;

    const result: any[] = await this.transactionRepository.sequelize.query(sql, {
      replacements: { user_id },
      type: QueryTypes.SELECT,
      transaction: t,
    });

    return result[0].balance as number;
  }

  static generateHash(transaction: Partial<Transaction>): string {
    const { BANK_SECRET } = process.env;

    const data = {
      transaction_id: transaction.id,
      sender_id: transaction.sender_id,
      receiver_id: transaction.receiver_id,
      amount: transaction.amount,
      previousHash: transaction.previoushash,
      createdAt: transaction.created_at,
      BANK_SECRET,
    };

    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  }
}
