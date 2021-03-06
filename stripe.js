import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_KEY);


export default (app) => {
  app.post('/pay-downloaded-map', async (req, res) => {
    const {
      body: {
        origin,
        searchParameters
      }
    } = req;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Map',
            },
            unit_amount: 500,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/download-success${searchParameters}`,
      cancel_url: `${origin}/download-fail${searchParameters}`,
    });
    res.json({ id: session.id });
  });
}