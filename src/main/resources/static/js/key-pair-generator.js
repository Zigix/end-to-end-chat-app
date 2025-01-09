async function generateKeys() {

    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 4096,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"],
    );

    return keyPair;
}

async function exportPublicKeyToBase64(publicKey) {
    const exportedKey = await window.crypto.subtle.exportKey("spki", publicKey);
    return btoa(String.fromCharCode(...new Uint8Array(exportedKey)));
}

async function exportPrivateKeyToBase64(privateKey) {
    const exportedKey = await window.crypto.subtle.exportKey("pkcs8", privateKey);
    return btoa(String.fromCharCode(...new Uint8Array(exportedKey)));
}

async function importPublicKey(base64PublicKey) {
    const binaryKey = Uint8Array.from(atob(base64PublicKey), char => char.charCodeAt(0));
    return await window.crypto.subtle.importKey(
        "spki",
        binaryKey.buffer,
        {
            name: "RSA-OAEP",
            hash: "SHA-256",
        },
        true,
        ["encrypt"]
    );
}

async function importPrivateKey(base64PrivateKey) {
    const binaryKey = Uint8Array.from(atob(base64PrivateKey), char => char.charCodeAt(0));
    return await window.crypto.subtle.importKey(
        "pkcs8",
        binaryKey.buffer,
        {
            name: "RSA-OAEP",
            hash: "SHA-256",
        },
        true,
        ["decrypt"]
    );
}

async function encryptMessage(publicKey, message) {
    const binaryMessage = new TextEncoder().encode(message);

    const encryptedMessage = await window.crypto.subtle.encrypt(
        {
            name: "RSA-OAEP",
        },
        publicKey,
        binaryMessage
    )

    return btoa(String.fromCharCode(...new Uint8Array(encryptedMessage)));
}

async function decryptMessage(privateKey, encryptedMessage) {
    const binaryEncryptedMessage = Uint8Array.from(atob(encryptedMessage), char => char.charCodeAt(0));

    const decryptedMessage = await window.crypto.subtle.decrypt(
        {
            name: "RSA-OAEP",
        },
        privateKey,
        binaryEncryptedMessage.buffer
    );

    return new TextDecoder().decode(decryptedMessage);
}





async function encryptPrivateKey(privateKey, password) {
    // 1. Zamiana hasła na klucz symetryczny
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    const salt = window.crypto.getRandomValues(new Uint8Array(16)); // Losowa sól

    const derivedKey = await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000, // Liczba iteracji
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 }, // Algorytm klucza symetrycznego
        false,
        ["encrypt"]
    );

    // 2. Eksportowanie klucza prywatnego do formatu binarnego
    const privateKeyBinary = await window.crypto.subtle.exportKey("pkcs8", privateKey);

    // 3. Szyfrowanie klucza prywatnego
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Wektor inicjalizacyjny
    const encryptedKey = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        derivedKey,
        privateKeyBinary
    );

    // 4. Zwracamy zaszyfrowany klucz jako obiekt z informacjami potrzebnymi do deszyfrowania
    return {
        encryptedKey: btoa(String.fromCharCode(...new Uint8Array(encryptedKey))),
        salt: btoa(String.fromCharCode(...salt)),
        iv: btoa(String.fromCharCode(...iv))
    };
}

async function decryptPrivateKey(encryptedData, password) {
    // 1. Zamiana hasła na klucz symetryczny
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    const salt = Uint8Array.from(atob(encryptedData.salt), c => c.charCodeAt(0));
    const iv = Uint8Array.from(atob(encryptedData.iv), c => c.charCodeAt(0));

    const derivedKey = await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"]
    );

    // 2. Dekodowanie zaszyfrowanego klucza z Base64
    const encryptedKeyBinary = Uint8Array.from(atob(encryptedData.encryptedKey), c => c.charCodeAt(0));

    // 3. Deszyfrowanie klucza prywatnego
    const privateKeyBinary = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        derivedKey,
        encryptedKeyBinary.buffer
    );

    // 4. Import odszyfrowanego klucza prywatnego
    return await window.crypto.subtle.importKey(
        "pkcs8",
        privateKeyBinary,
        {
            name: "RSA-OAEP",
            hash: "SHA-256"
        },
        true,
        ["decrypt"]
    );
}

// Testowanie funkcji
async function test() {
    // Generowanie pary kluczy
    const keyPair = await crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256"
        },
        true,
        ["encrypt", "decrypt"]
    );

    const password = "my-strong-password";
    console.log("Original Private Key:", keyPair.privateKey);

    // Szyfrowanie klucza prywatnego
    const encryptedData = await encryptPrivateKey(keyPair.privateKey, password);
    console.log("Encrypted Data:", encryptedData);

    // Odszyfrowanie klucza prywatnego
    const decryptedKey = await decryptPrivateKey(encryptedData, password);
    console.log("Decrypted Private Key:", decryptedKey);
}

async function onSignUp() {
    const keyPair = await generateKeys();
    const exportedPublicKey = await exportPublicKeyToBase64(keyPair.publicKey);

    const password = document.getElementById('password').value;
    const encryptedPrivateKeyData = await encryptPrivateKey(keyPair.privateKey, password);

    const publicKeyInput = document.getElementById('public-key');
    const saltInput = document.getElementById('salt');
    const ivInput = document.getElementById('iv');
    const encryptedPrivateKeyInput = document.getElementById('encrypted-private-key');

    publicKeyInput.value = exportedPublicKey;
    saltInput.value = encryptedPrivateKeyData.salt;
    ivInput.value = encryptedPrivateKeyData.iv;
    encryptedPrivateKeyInput.value = encryptedPrivateKeyData.encryptedKey;
}