import CryptoJS from 'crypto-js';

// Function to generate a consistent encryption key from title
const generateKeyFromTitle = (title: string): string => {
    // Create a consistent hash from the title
    return CryptoJS.SHA256(title).toString();
};

export const encrypt = (text: string, title: string): string => {
    const key = generateKeyFromTitle(title);
    return CryptoJS.AES.encrypt(text, key).toString();
};

export const decrypt = (ciphertext: string, title: string): string => {
    const key = generateKeyFromTitle(title);
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return bytes.toString(CryptoJS.enc.Utf8);
}; 