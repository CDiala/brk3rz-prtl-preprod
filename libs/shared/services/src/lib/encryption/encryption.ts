import { APP_CONFIG } from '@insurFlow/core';
import { inject, Injectable, signal } from '@angular/core';
import nacl from 'tweetnacl';
import util from 'tweetnacl-util';
/**
 * Generates a random 32-byte secret key.
 */
export const generateKey = (): Uint8Array => {
  return nacl.randomBytes(nacl.secretbox.keyLength);
};

@Injectable({
  providedIn: 'root',
})
export class Encryption {
  private config = inject(APP_CONFIG);

  secret = signal(this.config.encryptIV);
  // private key = signal<Uint8Array>(util.decodeUTF8(this.secret().padEnd(32).slice(0, 32)));
  private key = signal<Uint8Array>(
    util.decodeUTF8(
      this.secret()
        .padEnd(24) // Pad with null bytes instead of spaces
        .slice(0, 24),
    ),
  );

  encrypt(data: any): string {
    const message = util.decodeUTF8(JSON.stringify(data));
    const nonce = nacl.randomBytes(24);

    const encrypted = nacl.secretbox(message, nonce, this.key());

    return util.encodeBase64(Uint8Array.from([...nonce, ...encrypted]));
  }

  decrypt(payload: string): any {
    console.log('payload', payload);

    const bytes = util.decodeUTF8(payload);

    console.log('bytes', bytes);

    const nonce = bytes.slice(0, 24);
    const message = bytes.slice(24);

    // console.log('Key length:', this.key().length, 'Key:', Array.from(this.key()));
    // console.log('Nonce length:', nonce.length, 'Nonce:', Array.from(nonce));
    // console.log('Message length:', message.length);
    // console.log('Secret:', this.secret());

    const decrypted = nacl.secretbox.open(message, nonce, this.key());

    if (!decrypted) {
      const errorMsg = `Failed to decrypt message. Key length: ${this.key().length}, Nonce length: ${nonce.length}, Message length: ${message.length}, Secret: ${this.secret()}, payload: ${payload}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    // console.log('decrypted', util.encodeUTF8(decrypted));

    return JSON.parse(util.encodeUTF8(decrypted));
  }
}
