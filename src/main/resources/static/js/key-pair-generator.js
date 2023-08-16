async function generateKeyPair() {
    const keyPair = await crypto.subtle.generateKey(
        {
            name: 'RSA-OAEP',
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: 'SHA-256',
        },
        true,
        ['encrypt', 'decrypt']
    );

    return keyPair;
}

// Konwertowanie klucza do formatu PEM
async function exportKeyToPem(key) {
    const exported = await crypto.subtle.exportKey('spki', key);
    const exportedPem = `-----BEGIN PUBLIC KEY-----\n${arrayBufferToBase64(exported)}\n-----END PUBLIC KEY-----`;
    return exportedPem;
}

// Konwersja ArrayBuffer na Base64
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
}

async function exportPrivateKeyToPem(key) {
    const exported = await crypto.subtle.exportKey('pkcs8', key);
    const exportedPem = `-----BEGIN PRIVATE KEY-----\n${arrayBufferToBase64(exported)}\n-----END PRIVATE KEY-----`;
    return exportedPem;
}