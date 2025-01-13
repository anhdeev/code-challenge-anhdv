"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../src/clients/prisma"));
const globals_1 = require("@jest/globals");
const setupTestDB = () => {
    (0, globals_1.beforeAll)(async () => {
        await prisma_1.default.$connect();
    });
    (0, globals_1.beforeEach)(async () => {
        await prisma_1.default.user.deleteMany();
    });
    (0, globals_1.afterAll)(async () => {
        await prisma_1.default.user.deleteMany();
        await prisma_1.default.$disconnect();
    });
};
exports.default = setupTestDB;
