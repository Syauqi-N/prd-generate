export interface PakasirWebhookPayload {
  order_id: string;
  amount: number;
  project: string;
  status: string;
  payment_method?: string;
  completed_at?: string;
}

export interface PakasirTransactionDetail {
  transaction: {
    amount: number;
    order_id: string;
    project: string;
    status: string;
    payment_method?: string;
    completed_at?: string;
  };
}

// Generate payment URL (URL redirect method — no API call needed)
export function createPakasirPaymentUrl(params: {
  orderId: string;
  amount: number;
  returnUrl?: string;
}): string {
  const slug = process.env.PAKASIR_SLUG!;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002";
  const returnUrl = params.returnUrl || `${appUrl}/dashboard/billing?order=${params.orderId}`;

  const url = new URL(`https://app.pakasir.com/pay/${slug}/${params.amount}`);
  url.searchParams.set("order_id", params.orderId);
  url.searchParams.set("redirect", returnUrl);

  return url.toString();
}

// Verify transaction via Pakasir Transaction Detail API
export async function verifyPakasirTransaction(
  orderId: string,
  amount: number
): Promise<{ valid: boolean; status: string; paymentMethod?: string; completedAt?: string }> {
  const slug = process.env.PAKASIR_SLUG!;
  const apiKey = process.env.PAKASIR_API_KEY!;

  try {
    const url = `https://app.pakasir.com/api/transactiondetail?project=${slug}&amount=${amount}&order_id=${orderId}&api_key=${apiKey}`;
    const res = await fetch(url);

    if (!res.ok) {
      return { valid: false, status: "error" };
    }

    const data: PakasirTransactionDetail = await res.json();
    const tx = data.transaction;

    if (!tx) return { valid: false, status: "not_found" };

    return {
      valid: tx.status === "completed",
      status: tx.status,
      paymentMethod: tx.payment_method,
      completedAt: tx.completed_at,
    };
  } catch {
    return { valid: false, status: "error" };
  }
}
