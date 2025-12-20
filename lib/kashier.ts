import crypto from 'crypto';
import queryString from 'query-string';

/**
 * Validates a Kashier webhook signature (for webhooks with x-kashier-signature header)
 * Based on official Kashier documentation
 * @param webhookData - The webhook data object with signatureKeys field
 * @param headerSignature - The signature from x-kashier-signature header
 * @param secret - The Kashier API key
 * @returns true if signature is valid, false otherwise
 */
export function validateKashierWebhook(
    webhookData: any,
    headerSignature: string,
    secret: string
): boolean {
    try {
        if (!webhookData.signatureKeys || !Array.isArray(webhookData.signatureKeys)) {
            console.error('Missing signatureKeys in webhook data');
            return false;
        }

        // Sort the signature keys alphabetically (as per Kashier docs)
        webhookData.signatureKeys.sort();

        // Pick only the keys specified in signatureKeys from the data object
        const objectSignaturePayload: Record<string, any> = {};
        webhookData.signatureKeys.forEach((key: string) => {
            if (webhookData[key] !== undefined) {
                objectSignaturePayload[key] = webhookData[key];
            }
        });

        // Use query-string library (same as Kashier's example)
        const signaturePayload = queryString.stringify(objectSignaturePayload);

        console.log('=== SIGNATURE VALIDATION DEBUG ===');
        console.log('API Key (first 8 chars):', secret.substring(0, 8) + '...');
        console.log('Signature Payload:', signaturePayload);
        console.log('Sorted Keys:', webhookData.signatureKeys);
        console.log('Webhook Data:', JSON.stringify(objectSignaturePayload, null, 2));

        // Generate HMAC SHA256 signature
        const signature = crypto.createHmac('sha256', secret).update(signaturePayload).digest('hex');

        console.log('Calculated Signature:', signature);
        console.log('Received Signature:', headerSignature);
        console.log('Match:', headerSignature === signature);
        console.log('=================================');

        return headerSignature === signature;
    } catch (error) {
        console.error('Error validating webhook signature:', error);
        return false;
    }
}

/**
 * Validates a Kashier redirect/callback signature (URL parameters)
 * @param params - The URL parameters received
 * @param secret - The Kashier API key
 * @returns true if signature is valid, false otherwise
 */
export function validateKashierSignature(
    params: Record<string, any>,
    secret: string
): boolean {
    try {
        let queryString = '';
        for (const key in params) {
            if (key === 'signature' || key === 'mode') continue;
            queryString += '&' + key + '=' + params[key];
        }
        const finalUrl = queryString.substr(1);
        const signature = crypto.createHmac('sha256', secret).update(finalUrl).digest('hex');

        return signature === params.signature;
    } catch (error) {
        console.error('Error validating signature:', error);
        return false;
    }
}

/**
 * Generates a Kashier payment hash
 * @param mid - Merchant ID
 * @param orderId - Order ID
 * @param amount - Payment amount
 * @param currency - Payment currency
 * @param secret - The Kashier API key
 * @returns The generated hash
 */
export function generateKashierHash(
    mid: string,
    orderId: string,
    amount: string,
    currency: string,
    secret: string
): string {
    const path = `/?payment=${mid}.${orderId}.${amount}.${currency}`;
    return crypto.createHmac('sha256', secret).update(path).digest('hex');
}
