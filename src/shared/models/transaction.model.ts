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
  schema: 'cobuccio',
  tableName: 'transaction',
  updatedAt: 'updated_at',
  createdAt: 'created_at',
  timestamps: true,
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
  @Column({
    allowNull: false,
  })
  readonly created_at: Date;

  @UpdatedAt
  @Column({
    allowNull: false,
  })
    updated_at: Date;
}
