import { NextResponse } from "next/server";

export async function GET() {
  // You'll need to set your VAPID public key as an environment variable
  // For now, I'll use a placeholder - you should replace this with your actual VAPID public key
  const publicKey =  "BAtOrdYR_0otzhq5EOO0VUqHvLtKPdCUmYeWBqU0k9ukhiWlSbbg5Hk4bLmHr3EUFm7ho0F76z4v7QnXCx_1i6o";

  return NextResponse.json({ publicKey });
}