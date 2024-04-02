import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor() { }

  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, 'secret-key').toString();
  }

  decrypt(value: string): string {
    const bytes = CryptoJS.AES.decrypt(value, 'secret-key');
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
