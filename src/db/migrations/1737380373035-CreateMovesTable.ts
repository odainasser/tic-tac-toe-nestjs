import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateMovesTable1737380373035 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'moves',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
            default: `uuid_generate_v4()`,
          },
          {
            name: 'game_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'player_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'row',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'col',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'mark',
            type: 'enum',
            enum: ['X', 'O'],
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'moves',
      new TableForeignKey({
        columnNames: ['game_id'],
        referencedTableName: 'games',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'moves',
      new TableForeignKey({
        columnNames: ['player_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('moves');
  }
}
