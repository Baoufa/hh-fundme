const fs = require("fs-extra");
const path = require("path");
const prompt = require("prompt");

async function decryptKey() {
    const promptSchema = {
        properties: {
            password: {
                message: "Enter your password to decrypt the private key",
                hidden: true,
                required: true,
            },
        },
    };

    
    // Check if key is encrypted
    const keysPath = path.join(
        __dirname,
        "..",
        "encryptedKeys",
        ".encryptedKey.json"
    );

    if (!fs.existsSync(keysPath)) {
        throw new Error("❌ - Please run 'npm run encrypt' first");
    }

    const promptResult = await new Promise((resolve, reject) => {
        prompt.start();
        prompt.get(promptSchema, function (err, result) {
            resolve(result);
            reject(err);
        });
    });

    const PASSWORD = promptResult.password;

    try {
        let wallet;
        const keyPath = path.join(
            __dirname,
            "..",
            "encryptedKeys",
            ".encryptedKey.json"
        );
        const encryptedJson = fs.readFileSync(keyPath, "utf8");
        wallet = new ethers.Wallet.fromEncryptedJsonSync(
            encryptedJson,
            PASSWORD
        );
        wallet = wallet.connect(ethers.provider);
        return wallet;
    } catch (err) {
        throw new Error(`❌ - Error message: ${err}`);
    }
}

module.exports = decryptKey;
