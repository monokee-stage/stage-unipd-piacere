export interface Decryptor {
    decrypt(enc_text: string, encoding?: string): string
}