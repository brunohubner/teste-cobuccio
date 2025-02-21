import * as crypto from 'crypto';

import { Inject, Injectable } from '@nestjs/common';
import { QueryTypes, Transaction as SequelizeTransaction } from 'sequelize';
import User from '@/shared/models/user.model';
import { HttpException } from '@/shared/errors/http/http-exception.error';
import Transaction from '@/shared/models/transaction.model';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { JwtUser } from '@/shared/types/jwt-user.type';
import { CreateTransactionSwaggerData } from './swagger/create-transaction.swagger';

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
  ): Promise<CreateTransactionSwaggerData> {
    const result = await this.transactionRepository.sequelize.transaction(async (t) => {
      const sender = await User.findOne({
        where: { id: user.user_id },
        transaction: t,
        raw: true,
      });

      const receiver = await User.findOne({
        where: { cpf: receiver_cpf },
        transaction: t,
        raw: true,
      });

      if (!receiver) {
        throw this.httpException.badRequest('Receiver não encontrado');
      }

      if (sender.id === receiver.id) {
        throw this.httpException.badRequest('Não é possível realizar transferência para a mesma si mesmo');
      }

      const sender_id = user.user_id;

      const senderBalance = await this.getBalance(sender_id, t);

      if (senderBalance < amount) {
        throw this.httpException.badRequest('Saldo insuficiente');
      }

      const lastSenderTransaction = await Transaction.findOne({
        where: { sender_id },
        order: [['created_at', 'DESC']],
        transaction: t,
        raw: true,
      });

      if (lastSenderTransaction) {
        const previousTransaction = await Transaction.findOne({
          where: { sender_id },
          order: [['created_at', 'DESC']],
          offset: 1,
          transaction: t,
          raw: true,
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
        transaction_hash: transactionJson.hash,
        transaction_amount: Number(transactionJson.amount),
        sender_name: user.person_name,
        sender_cpf: sender.cpf,
        sender_id: user.user_id,
        receiver_name: receiver.person_name,
        receiver_cpf: receiver.cpf,
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

    return Number(result[0].balance);
  }

  static generateHash({
    id,
    sender_id,
    receiver_id,
    amount,
    previoushash,
    created_at,
    status,
  }: Partial<Transaction>): string {
    const { BANK_SECRET } = process.env;

    if (!BANK_SECRET) {
      throw new Error('BANK_SECRET não configurado no ambiente');
    }

    const data = `${id}${sender_id}${receiver_id}${amount}${previoushash}${created_at}${status}${BANK_SECRET}`;

    return crypto.createHash('sha256').update(data).digest('hex');
  }
}
