import { User } from '@prisma/client';
import { compare, genSalt, hash } from 'bcrypt';
import {
  ERROR_FAILED_LOGIN_MESSAGE,
  ERROR_INVALID_CREDENTIALS_MESSAGE,
  ERROR_UNAUTHORIZED_MESSAGE,
  ERROR_USER_EXISTS_MESSAGE,
} from 'config/api/error_message';
import {
  JWT_EXPIRE_IN,
  JWT_SECRET_KEY,
  SALT_ROUND,
  SECRET_KEY,
} from 'config/environments';
import { prisma } from 'config/prisma/prisma_config';
import { PrismaErrorCode } from 'helpers/helper';
import { IncomingHttpHeaders } from 'http2';
import jwt from 'jsonwebtoken';

export class AuthService {
  user: User | null;
  email: string;
  password: string;

  /**
   * Creates an instance of AuthService.
   * @param {User | null} user - The user object retrieved from the database.
   * @param {string} email - The email address of the user.
   * @param {string} password - The password of the user.
   * @throws {Error} - If email or password is not provided.
   * @private
   */
  private constructor(user: User | null, email: string, password: string) {
    this.email = email;
    this.password = password;
    this.user = user;

    if (!this.email || !this.password) {
      throw new Error(ERROR_UNAUTHORIZED_MESSAGE);
    }
  }

  /**
   * Initializes an instance of AuthService.
   * @param {IncomingHttpHeaders} headers - The HTTP headers of the incoming request.
   * @param {string} email - The email address of the user.
   * @param {string} password - The password of the user.
   * @return {Promise<AuthService>} - An instance of AuthService.
   * @throws {Error} - If secret key is invalid or any other error occurs.
   */
  static async initialize(
    headers: IncomingHttpHeaders,
    email: string,
    password: string,
  ): Promise<AuthService> {
    try {
      const headerSecretKey: string = Array.isArray(headers['secret-key'])
        ? headers['secret-key'][0]
        : headers['secret-key'] ?? '';
      if (headerSecretKey !== SECRET_KEY) {
        throw new Error(ERROR_UNAUTHORIZED_MESSAGE);
      }

      const emailLowerCase = email.toLowerCase();

      const user: User | null = await prisma.user.findUnique({
        where: { email: emailLowerCase },
      });

      return new AuthService(user, emailLowerCase, password);
    } catch (error: any) {
      throw PrismaErrorCode(error);
    }
  }

  /**
   * Generates a salt and hashes the password.
   * @param {string} password - The password to hash.
   * @return {Promise<string>} - The hashed password.
   * @private
   */
  private async passwordSaltHash(password: string): Promise<string> {
    const salt = await genSalt(SALT_ROUND);
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
  }

  /**
   * Compares a password with the hashed password from the user.
   * @param {string} password - The password to compare.
   * @param {User} user - The user object containing the hashed password.
   * @return {Promise<boolean>} - True if the passwords match, false otherwise.
   * @private
   */
  private async comparePassword(
    password: string,
    user: User,
  ): Promise<boolean> {
    return await compare(password, user.password);
  }

  /**
   * Creates a new user.
   * @return {Promise<{id: number, email: string}>} - The created user object.
   * @throws {Error} - If the user already exists.
   */
  async createUser(): Promise<{ id: number; email: string }> {
    if (!this.user) {
      const password = await this.passwordSaltHash(this.password);
      const data = await prisma.user.create({
        select: {
          id: true,
          email: true,
        },
        data: {
          email: this.email,
          password,
        },
      });
      return data;
    }
    throw new Error(ERROR_USER_EXISTS_MESSAGE);
  }

  /**
   * Signs in a user.
   * @return {Promise<{id: number, email: string, token: string}>} - The signed-in user object with a JWT token.
   * @throws {Error} - If the credentials are invalid or login fails.
   */
  async signin(): Promise<{ id: number; email: string; token: string }> {
    if (!this.user) {
      throw new Error(ERROR_INVALID_CREDENTIALS_MESSAGE);
    }

    const passwordMatch = await this.comparePassword(this.password, this.user);
    if (!passwordMatch) {
      throw new Error(ERROR_INVALID_CREDENTIALS_MESSAGE);
    }

    const token = jwt.sign(
      { id: this.user.id, email: this.user.email },
      JWT_SECRET_KEY,
      {
        expiresIn: JWT_EXPIRE_IN,
      },
    );

    if (!token) {
      throw new Error(ERROR_FAILED_LOGIN_MESSAGE);
    }

    return { id: this.user.id, email: this.user.email, token };
  }

  /**
   * Resets the user's password.
   * @return {Promise<User>} - The updated user object.
   * @throws {Error} - If the user is not found or credentials are invalid.
   */
  async passwordReset(): Promise<User> {
    if (!this.user) {
      throw new Error(ERROR_INVALID_CREDENTIALS_MESSAGE);
    }

    const password = await this.passwordSaltHash(this.password);
    return await prisma.user.update({
      where: { email: this.email },
      data: { password },
    });
  }
}
