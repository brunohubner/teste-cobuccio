import * as crypto from 'crypto';

import { Inject, Injectable } from '@nestjs/common';
import { QueryTypes, Transaction as SequelizeTransaction } from 'sequelize';
import User from '@/shared/models/user.model';
import { HttpException } from '@/shared/errors/http/http-exception.error';
import Transaction from '@/shared/models/transaction.model';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { JwtUser } from '@/shared/types/jwt-user.type';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(HttpException.name)
    private readonly httpException: typeof HttpException,
    @Inject(User.name)
    private readonly transactionRepository: typeof Transaction,
  ) { }

  async createTransaction(
    {
      receiver_cpf,
      amount,
    }: CreateTransactionDto,
    user: JwtUser,
  ) {
    const result = await this.transactionRepository.sequelize.transaction(async (t) => {
      const receiver = await User.findOne({
        where: { cpf: receiver_cpf },
        transaction: t,
      });

      if (!receiver) {
        throw this.httpException.badRequest('Receiver não encontrado');
      }

      const sender_id = user.userId;

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
        receiver_id: receiver.id,
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
        sender_name: user.person_name,
        sender_id: user.userId,
        receiver_name: receiver.person_name,
        receiver_id: receiver.id,
      };
    });

    return result;
  }

  async getBalance(user_id: string, t: SequelizeTransaction = null): Promise<number> {
    const sql = `--sql
      SELECT
        COALESCE(SUM(CASE WHEN receiver_id = :user_id THEN amount ELSE 0 END), 0)
        - COALESCE(SUM(CASE WHEN sender_id = :user_id THEN amount ELSE 0 END), 0)
      AS balance FROM transaction WHERE status = 'completed';`;

    const result: any[] = await this.transactionRepository.sequelize.query(sql, {
      replacements: { user_id },
      type: QueryTypes.SELECT,
      transaction: t,
    });

    return Number(result[0].balance) as number;
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
