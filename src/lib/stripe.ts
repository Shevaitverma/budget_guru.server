import stripe from "../config/stripe";
import { IUser } from "../types/schema";

export const createOrRetrieveStripeAccount = async (
  user: IUser
): Promise<string> => {
  try {
    if (!user) {
      throw new Error("User not found");
    }

    if (user.stripeAccountId) {
      return user.stripeAccountId;
    }

    const account = await stripe.accounts.create({
      type: "express",
      email: user.email,
      business_type: "individual",
      business_profile: {
        name: `${user.name}`,
      },
      individual: {
        email: user.email,
        first_name: user.name,
      },
      capabilities: {
        card_payments: {
          requested: true,
        },
        transfers: {
          requested: true,
        },
      },
    });

    user.stripeAccountId = account.id;
    await user.save();

    return account.id;
  } catch (error: any) {
    throw new Error(
      `Failed to create or retrieve Stripe account: ${error.message}`
    );
  }
};

export const createOrRetrieveStripeCustomer = async (
  user: IUser
): Promise<string> => {
  try {
    if (!user) {
      throw new Error("User not found");
    }

    if (user.stripeCustomerId) {
      return user.stripeCustomerId;
    }

    const customer = await stripe.customers.create({
      email: user.email,
      name: `${user.name}`,
      metadata: {
        userId: user._id.toString(),
      },
    });

    user.stripeCustomerId = customer.id;
    await user.save();

    return customer.id;
  } catch (error: any) {
    throw new Error(
      `Failed to create or retrieve Stripe customer: ${error.message}`
    );
  }
};
