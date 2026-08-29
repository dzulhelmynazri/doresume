import { auth } from "@doresume/auth";
import { autumnHandler } from "autumn-js/next";

export const { GET, POST } = autumnHandler({
  identify: async (request) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return null;
    }

    return {
      customerData: {
        email: session.user.email,
        name: session.user.name,
      },
      customerId: session.user.id,
    };
  },
});
