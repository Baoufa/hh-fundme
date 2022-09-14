const { ethers } = require("hardhat");
const fs = require("fs-extra");
const path = require("path");
const prompt = require("prompt");
require("dotenv").config();

async function main() {
    let publicAddress; 

    const promptSchema = {
        properties: {
            privateKey: {
                before: function (v) {
                    try {
                        publicAddress = ethers.utils.computeAddress(v);
                        if(ethers.utils.isAddress(publicAddress))
                        return v;
                    } catch (e) {
                        throw new Error("Invalid Private Key");
                    }
                },
                message: "Enter your ETH Private Key",
                required: true,
                hidden: true,
            },
            password: {
                message: "Choose a strong password",
                hidden: true,
                required: true,
            },
        },
    };

    const promptResult = await new Promise((resolve, reject) => {
        prompt.start();
        prompt.get(promptSchema, function (err, result) {
            resolve(result);
            reject(err);
        });
    });

    const SECRET_KEY = promptResult.privateKey;
    const PASSWORD = promptResult.password;

    const wallet = new ethers.Wallet(SECRET_KEY);
    const encryptedJsonKey = await wallet.encrypt(PASSWORD, SECRET_KEY);

    const keysDir = path.join(__dirname, "..", "encryptedKeys");

    if (!fs.existsSync(keysDir)) {
        fs.mkdirSync(keysDir);
    }

    const keysPath = path.join(keysDir, ".encryptedKey.json");

    fs.writeFileSync(
        keysPath,
        encryptedJsonKey
    );
    
    console.log('');
    console.log(`🌈 - Success your Private key has been encrypted at: ${keysPath}`);
    console.log(`👤 - For the following public addres: ${publicAddress}`);
    console.log('');
}

main().then(() =>
    process.exit(0).catch((err) => {
        console.error(err);
        process.exit(1);
    })
);