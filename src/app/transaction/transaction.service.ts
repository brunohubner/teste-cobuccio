/* eslint-disable no-restricted-syntax */
import * as crypto from 'crypto';

import { Inject, Injectable } from '@nestjs/common';
import { QueryTypes, Transaction as SequelizeTransaction } from 'sequelize';
import User from '@/shared/models/user.model';
import { HttpException } from '@/shared/errors/http/http-exception.error';
import Transaction from '@/shared/models/transaction.model';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { JwtUser } from '@/shared/types/jwt-user.type';
import { CreateTransactionSwaggerData } from './swagger/create-transaction.swagger';
import { toFixed2 } from '@/shared/functions/toFixed2';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(HttpException.name)
    private readonly httpException: typeof HttpException,
    @Inject(User.name)
    private readonly userRepository: typeof User,
    @Inject(Transaction.name)
    private readonly transactionRepository: typeof Transaction,
  ) { }

  async createTransaction(
    {
      receiver_cpf,
      amount,
    }: CreateTransactionDto,
    user: JwtUser,
  ): Promise<CreateTransactionSwaggerData> {
    return this.transactionRepository.sequelize.transaction(async (t) => {
      const sender = await this.userRepository.findOne({
        where: { id: user.user_id },
        transaction: t,
        raw: true,
      });

      const receiver = await this.userRepository.findOne({
        where: { cpf: receiver_cpf },
        transaction: t,
        raw: true,
      });

      if (!receiver) {
        throw this.httpException.badRequest('Nenhum usuário encontrado com o CPF informado');
      }

      if (sender.id === receiver.id) {
        throw this.httpException.badRequest('Não é possível realizar transferências para a mesma si mesmo');
      }

      const sender_id = user.user_id;

      const senderBalance = await this.getBalance(sender_id, t);

      if (senderBalance < amount) {
        throw this.httpException.badRequest('Seu saldo é insuficiente');
      }

      await this.validateTransactionHistory(sender_id, t);

      const lastSenderTransaction = await this.transactionRepository.findOne({
        where: { sender_id },
        order: [['created_at', 'DESC']],
        transaction: t,
        raw: true,
      });

      const transactionModel: Partial<Transaction> = {
        sender_id,
        receiver_id: receiver.id,
        amount,
        status: 'pending',
        hash: '0',
        previous_hash: lastSenderTransaction?.hash ? lastSenderTransaction.hash : '0',
      };

      let transaction = await this.transactionRepository
        .create(transactionModel, { transaction: t });

      transaction = transaction.toJSON();

      transaction.status = 'completed';
      transaction.hash = TransactionService.generateHash(transaction);

      await this.transactionRepository.update({
        status: 'completed',
        hash: transaction.hash,
      }, {
        where: { id: transaction.id },
        transaction: t,
      });

      return {
        transaction_id: transaction.id,
        transaction_hash: transaction.hash,
        transaction_amount: Number(transaction.amount),
        sender_name: user.person_name,
        sender_cpf: sender.cpf,
        sender_id: user.user_id,
        receiver_name: receiver.person_name,
        receiver_cpf: receiver.cpf,
        receiver_id: receiver.id,
      };
    });
  }

  async cancel(transaction_id: string, user: JwtUser) {
    return this.transactionRepository.sequelize.transaction(async (t) => {
      const transaction = await this.transactionRepository.findOne({
        where: { id: transaction_id },
        transaction: t,
        raw: true,
      });

      if (!transaction) {
        throw this.httpException.badRequest('Nenhuma transação encontrada com o ID informado');
      }

      if (transaction.status !== 'completed') {
        throw this.httpException.badRequest(`Essa transação não pode ser cancelada. status = ${transaction.status}`);
      }

      const lastTransaction = await this.transactionRepository.findOne({
        where: {
          sender_id: user.user_id,
          status: 'completed',
        },
        order: [['created_at', 'DESC']],
        transaction: t,
        raw: true,
      });

      if (lastTransaction?.id !== transaction_id) {
        throw this.httpException.badRequest('Você só pode solicitar cancelamento da última transação enviada por você');
      }

      const receiverBalance = await this.getBalance(transaction.receiver_id, t);

      if (receiverBalance < Number(transaction.amount)) {
        throw this.httpException.badRequest('O usuário que recebeu o dinheiro não tem saldo suficiente para reembolsar a transação');
      }

      const status = 'canceled';

      transaction.status = status;

      transaction.hash = TransactionService.generateHash(transaction);

      await this.transactionRepository.update({
        status,
        hash: transaction.hash,
      }, {
        where: { id: transaction_id },
        transaction: t,
      });

      return {
        transaction_id: transaction.id,
        transaction_hash: transaction.hash,
        transaction_amount: Number(transaction.amount),
        transaction_status: transaction.status,
        sender_name: user.person_name,
        sender_id: user.user_id,
      };
    });
  }

  async getBalance(user_id: string, t: SequelizeTransaction = null): Promise<number> {
    const sql = `--sql
      SELECT
        COALESCE(SUM(CASE WHEN tr.receiver_id = :user_id THEN tr.amount ELSE 0 END), 0)
        - COALESCE(SUM(CASE WHEN tr.sender_id = :user_id THEN tr.amount ELSE 0 END), 0)
      AS balance FROM cobuccio.transaction as tr WHERE tr.status = 'completed';`;

    const result: any[] = await this.transactionRepository.sequelize.query(sql, {
      replacements: { user_id },
      type: QueryTypes.SELECT,
      transaction: t,
    });

    return Number(result[0].balance);
  }

  private async validateTransactionHistory(
    user_id: string,
    t: SequelizeTransaction = null,
  ) {
    const transactions = await this.transactionRepository.findAll({
      where: {
        sender_id: user_id,
      },
      order: [['created_at', 'ASC']],
      transaction: t,
      raw: true,
    });

    let previousHash = '0';

    for (const transaction of transactions) {
      const expectedHash = TransactionService.generateHash(transaction);

      if (transaction.hash !== expectedHash || transaction.previous_hash !== previousHash) {
        throw this.httpException.badRequest(`Identificamos uma transação adulterada. id=${transaction.id}`);
      }

      previousHash = transaction.hash;
    }
  }

  private static generateHash(dto: Partial<Transaction>): string {
    const {
      id,
      sender_id,
      receiver_id,
      amount,
      previous_hash,
      status,
    } = dto;

    const secret = process.env.BANK_SECRET;

    const data = `${id}${sender_id}${receiver_id}${toFixed2(amount)}${previous_hash}${status}${secret}`;

    return crypto.createHash('sha256').update(data).digest('hex');
  }
}
