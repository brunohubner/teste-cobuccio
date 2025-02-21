import { Provider } from '@nestjs/common';
import Transaction from '@/shared/models/transaction.model';

export const TransactionProvider: Provider[] = [
  {
    provide: Transaction.name,
    useValue: Transaction,
  },
];
