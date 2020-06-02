import * as Crypto from 'crypto-js';
// @ts-ignore
import { _app_config } from '@app-config/app.config';
import { isJson } from './function.helper';
/*
 * Class Function
 * =====
 */
export class AppHelper {
}

/*
 * Direct Function Without class
 * =====
 */

export function dataEncryption(data: any) {
  const obj = (typeof data === 'object') ? JSON.stringify(data) : data ;
  const result = Crypto.Rabbit.encrypt(obj, _app_config.security_encription_pass).toString();
  return result;
}

export function dataDecryption(data: any) {
  const predicate = Crypto.Rabbit.decrypt(data, _app_config.security_encription_pass);
  const decrypted = predicate.toString(Crypto.enc.Utf8);
  const result = (isJson(decrypted)) ? JSON.parse(decrypted) : decrypted;
  return result;
}


