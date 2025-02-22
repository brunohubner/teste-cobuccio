import { DataTypes } from 'sequelize';
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Scopes,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import User from './user.model';

export type TransactionStatus = 'pending' | 'completed' | 'canceled' | 'rejected';

@Scopes(() => ({}))
@Table({
  schema: 'public', tableName: 'transaction', updatedAt: false, createdAt: false,
})
export default class Transaction extends Model<Transaction> {
  @Column({
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    type: DataType.UUID,
  })
  declare id: string;

  @ForeignKey(() => User)
  @Column
    sender_id: string;

  @BelongsTo(() => User)
    sender: User;

  @ForeignKey(() => User)
  @Column
    receiver_id: string;

  @BelongsTo(() => User)
    receiver: User;

  @Column({
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false,
  })
    amount: number;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    status: TransactionStatus;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
    previous_hash: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
    hash: string;

  @CreatedAt
  @Column
    created_at: Date;

  @UpdatedAt
  @Column
    updated_at: Date;
}
