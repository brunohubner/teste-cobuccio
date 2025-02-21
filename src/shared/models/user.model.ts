import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Scopes,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Scopes(() => ({}))
@Table({
  schema: 'public', tableName: 'user', updatedAt: false, createdAt: false,
})
export default class User extends Model<User> {
  @Column({
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    type: DataType.UUID,
  })
  declare id: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    person_name: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    email: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    cpf: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    hashed_password: string;

  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
    birth_date: Date;

  @CreatedAt
  @Column
    created_at: Date;

  @UpdatedAt
  @Column
    updated_at: Date;
}
