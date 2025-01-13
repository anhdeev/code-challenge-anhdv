import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import httpStatus from 'http-status';
import config from '../config/config';
import userService from './user.service';
import ApiError from '../utils/ApiError';
import prisma from '../clients/prisma';
import { AuthTokensResponse } from '../types/auth';
import { TokenType } from '../constants/common.const';
import { Token } from '@prisma/client'

/**
 * Generate token
 * @param {number} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (
    userId: number,
    expires: Moment,
    type: TokenType,
    secret = config.jwt.secret
): string => {
    const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type
    };
    return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {string} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (
    userId: number,
    token: string,
    expires: Moment,
    type: TokenType
): Promise<Token> => {
    await prisma.token.deleteMany({
        where: {
            userId,
            type
        }
    });

    return prisma.token.create({
        data: {
            userId,
            token,
            type,
            expires: expires.toDate()
        }
    });
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token: string, type: TokenType): Promise<Token> => {
    const payload = jwt.verify(token, config.jwt.secret);
    const userId = Number(payload.sub);
    const where: { [key: string]: any } = {
        userId,
        token,
        type
    };
    const tokenData = await prisma.token.findFirst({
        where
    });
    if (!tokenData) {
        throw new Error('Token not found');
    }
    return tokenData;
};

const decodeJwt = async <T extends object>(token: string): Promise<T> => {
    const payload = jwt.verify(token, config.jwt.secret);
    if (!payload) {
        throw new Error('Token could not be extracted');
    }
    return payload as T;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<AuthTokensResponse>}
 */
const generateAuthTokens = async (user: { id: number }): Promise<AuthTokensResponse> => {
    const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = generateToken(user.id, accessTokenExpires, TokenType.ACCESS);
    await saveToken(user.id, accessToken, accessTokenExpires, TokenType.ACCESS);

    const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = generateToken(user.id, refreshTokenExpires, TokenType.REFRESH);
    await saveToken(user.id, refreshToken, refreshTokenExpires, TokenType.REFRESH);

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate()
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate()
        }
    };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email: string): Promise<string> => {
    const user = await userService.getUserByEmail(email);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
    }
    const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
    const resetPasswordToken = generateToken(user.id, expires, TokenType.RESET_PASSWORD);
    await saveToken(user.id, resetPasswordToken, expires, TokenType.RESET_PASSWORD);
    return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (user: { id: number }): Promise<string> => {
    const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
    const verifyEmailToken = generateToken(user.id, expires, TokenType.VERIFY_EMAIL);
    await saveToken(user.id, verifyEmailToken, expires, TokenType.VERIFY_EMAIL);
    return verifyEmailToken;
};

const getLastSession = async (userIds: number[]) => {
    const matchedSession = await prisma.token.findMany({
        where: {
            userId: {
                in: userIds
            },
            type: TokenType.ACCESS
        }
    });

    return matchedSession.map((session: { userId: any; createdAt: any; updatedAt: any }) => ({
        userId: session.userId,
        iat: session.createdAt,
        updatedAt: session.updatedAt
    }));
};

const deleteToken = async(refreshToken: string) => {
    const refreshTokenData = await prisma.token.findFirst({
        where: {
          token: refreshToken,
          type: TokenType.REFRESH
        }
      });
      if (!refreshTokenData) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
      }
      await prisma.token.deleteMany({ where: { userId: refreshTokenData.userId } });
}

export default {
    generateToken,
    saveToken,
    verifyToken,
    generateAuthTokens,
    generateResetPasswordToken,
    generateVerifyEmailToken,
    decodeJwt,
    getLastSession,
    deleteToken
};
