import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class StatePersistenceService {
  private storageKey = 'authState';
  private encryptionKey = '0tyut-atyCV-uxQdHtryHsF+HADfidfdgf'; // Replace with a secure key

  saveStateToSessionStorage(state: Record<string, unknown>): void {
    //console.log('about ot save 2 session', state);
    const serializedState = JSON.stringify(state);
    const encryptedState = CryptoJS.AES.encrypt(
      serializedState,
      this.encryptionKey
    ).toString();
    sessionStorage.setItem(this.storageKey, encryptedState);
  }

  loadStateFromSessionStorage(): Record<string, unknown> | null {
    const encryptedState = sessionStorage.getItem(this.storageKey);
    if (!encryptedState) {
      return null;
    }

    try {
      const bytes = CryptoJS.AES.decrypt(encryptedState, this.encryptionKey);
      const serializedState = bytes.toString(CryptoJS.enc.Utf8);

      // view
      //console.log('decrptyed sstorage', JSON.parse(serializedState));

      return JSON.parse(serializedState);
    } catch (error) {
      console.error('Error decrypting state:', error);
      return null;
    }
  }

  clearState(): void {
    sessionStorage.removeItem(this.storageKey);
  }
}
