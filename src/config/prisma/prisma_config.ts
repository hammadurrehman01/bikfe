import { PrismaClient } from '@prisma/client';
import { PRISMA_MODEL_EXTENSION } from './models';

export const prisma = new PrismaClient().$extends(PRISMA_MODEL_EXTENSION);
