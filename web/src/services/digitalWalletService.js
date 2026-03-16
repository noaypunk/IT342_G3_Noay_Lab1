// simulates wallet providers available in the ph
export const WALLET_PROVIDERS = [
    { id : "gcash", name: "GCash", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/GCash_Logo.png/1200px-GCash_Logo.png" },
        { id : "paymaya", name: "PayMaya", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4b/PayMaya_Logo.png/1200px-PayMaya_Logo.png" },  
        { id : "paypal", name: "PayPal", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/PayPal_logo_2023.svg" }
];

//simulate deposit initiation (can be replace with actual API calls)
export const initiateDeposit = async (amount, WALLET_PROVIDERS, user_id) => {
    if (!amount || amount <= 0) throw new Error("Invalid deposit amount");
    if (!WALLET_PROVIDERS.some(provider => provider.id === walletId)) throw new Error("Unsupported wallet provider");
    // in production call backend API to generate a payment link or token
    const mockPaymentUrl = 
    `https://${walleteId}.com/pay?amount=${amount}&user_id=${user_id}&ref=YOUR_APP__REF`;
    return {
        success: true, paymenturl: mockPaymentUrl, referenceId: `DEP-${Date.now()}`
    };
};