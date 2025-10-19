// /api/create-checkout-session.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { name, email, phone, origin, destination, amountPreviewEUR } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Transfer from ${origin} to ${destination}`,
              description: `Client: ${name} (${phone})`,
            },
            unit_amount: Math.round(amountPreviewEUR * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://tu-proyecto.vercel.app/success.html",
      cancel_url: "https://tu-proyecto.vercel.app/cancel.html",
      customer_email: email,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
}
