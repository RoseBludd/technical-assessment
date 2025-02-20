import {
  BeforeInsert,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";

export const mockRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
  softDelete: jest.fn(),
  update: jest.fn(),
};

export const mockDataSource = {
  getRepository: jest.fn().mockReturnValue(mockRepository),
  initialize: jest.fn(),
  destroy: jest.fn(),
};

// Mock TypeORM imports
jest.mock("typeorm", () => ({
  DataSource: jest.fn(() => mockDataSource),
  Entity: () => () => {},
  PrimaryGeneratedColumn: () => () => {},
  Column: () => () => {},
  CreateDateColumn: () => () => {},
  UpdateDateColumn: () => () => {},
  DeleteDateColumn: () => () => {},
  BeforeInsert: () => () => {},
  ManyToOne: () => () => {},
  OneToMany: () => () => {},
  JoinColumn: () => () => {},
  Repository: jest.fn(),
}));
