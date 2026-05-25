import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private currentAesKeyRaw: Uint8Array | null = null;
  private currentNonce: Uint8Array | null = null;
  private currentTs: number | null = null;

  private toB64(buf: ArrayBuffer): string {
    return btoa(
      Array.from(new Uint8Array(buf), (b) => String.fromCharCode(b)).join(''),
    );
  }

  private fromB64(b64: string): Uint8Array {
    return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  }

  encryptRequest(plaintextObj: any, publicKeyPem: string): Observable<any> {
    const plaintextJson = JSON.stringify(plaintextObj);

    const encryptionPromise = (async () => {
      const enc = new TextEncoder();
      const pemBody = publicKeyPem
        .replace(/-----BEGIN PUBLIC KEY-----/g, '')
        .replace(/-----END PUBLIC KEY-----/g, '')
        .replace(/\s+/g, '');

      const derBuffer = this.fromB64(pemBody);
      const rsaKey = await crypto.subtle.importKey(
        'spki',
        derBuffer.buffer as ArrayBuffer,
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        false,
        ['encrypt'],
      );

      const aesKeyRaw = crypto.getRandomValues(new Uint8Array(32));
      const aesKey = await crypto.subtle.importKey(
        'raw',
        aesKeyRaw.buffer as ArrayBuffer,
        { name: 'AES-GCM' },
        false,
        ['encrypt'],
      );

      const iv = crypto.getRandomValues(new Uint8Array(12));
      const nonce = crypto.getRandomValues(new Uint8Array(16));
      const ts = Date.now();

      const aad = new Uint8Array(24);
      const view = new DataView(aad.buffer);
      view.setUint32(0, Math.floor(ts / 0x100000000), false);
      view.setUint32(4, ts >>> 0, false);
      aad.set(nonce, 8);

      const ctWithTag = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv, additionalData: aad, tagLength: 128 },
        aesKey,
        enc.encode(plaintextJson),
      );

      const ct = new Uint8Array(ctWithTag);
      const data = new Uint8Array(12 + ct.length);
      data.set(iv, 0);
      data.set(ct, 12);

      const wrappedKey = await crypto.subtle.encrypt(
        { name: 'RSA-OAEP' },
        rsaKey,
        aesKeyRaw,
      );

      this.currentAesKeyRaw = aesKeyRaw;
      this.currentNonce = nonce;
      this.currentTs = ts;

      return {
        key: this.toB64(wrappedKey),
        data: this.toB64(data.buffer),
        nonce: this.toB64(nonce.buffer),
        ts,
      };
    })();

    return from(encryptionPromise);
  }

  decryptResponse(encryptedData: string): Observable<any> {
    // 1. Structural Guard Validation
    if (!this.currentAesKeyRaw || !this.currentNonce || !this.currentTs) {
      throw new Error('Cryptographic context missing. Decryption failed.');
    }

    // ✅ FIX: Capture the state in block-scoped local constants immediately.
    // TypeScript guarantees constants remain non-null throughout the async stream.
    const cachedKey = this.currentAesKeyRaw;
    const cachedNonce = this.currentNonce;
    const cachedTs = this.currentTs;

    const decryptionPromise = (async () => {
      const aesKey = await crypto.subtle.importKey(
        'raw',
        cachedKey.buffer as ArrayBuffer, // 👈 Used local constant
        { name: 'AES-GCM' },
        false,
        ['decrypt'],
      );

      const raw = this.fromB64(encryptedData);
      const iv = raw.slice(0, 12);
      const ciphertext = raw.slice(12);

      const aad = new Uint8Array(24);
      const view = new DataView(aad.buffer);
      view.setUint32(0, Math.floor(cachedTs / 0x100000000), false); // 👈 Used local constant
      view.setUint32(4, cachedTs >>> 0, false); // 👈 Used local constant
      aad.set(cachedNonce, 8); // 👈 Used local constant

      const plaintext = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv, additionalData: aad, tagLength: 128 },
        aesKey,
        ciphertext,
      );

      const decodedString = new TextDecoder().decode(plaintext);

      // Clear contextual state keys to avoid memory payload leaks
      this.currentAesKeyRaw = null;
      this.currentNonce = null;
      this.currentTs = null;

      return JSON.parse(decodedString);
    })();

    return from(decryptionPromise);
  }
}
