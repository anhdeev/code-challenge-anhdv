import { Response, Request } from 'express';
import morgan from 'morgan';
import config from './config';
import logger from './logger';

morgan.token('message', (req, res: Response) => res.locals.errorMessage || '');

morgan.token('req-details', (req: Request, res) => {
  const { headers, params, body } = req;
  return `Headers: ${JSON.stringify(headers)} - Params: ${JSON.stringify(
    params
  )} - Body: ${JSON.stringify(body)}`;
});

const getIpFormat = () => (config.env === 'production' ? ':remote-addr - ' : '');
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message - request: :req-details`;

export const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) }
});

export const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) }
});

export default {
  successHandler,
  errorHandler
};
