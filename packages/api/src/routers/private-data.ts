import { protectedProcedure } from "../index";

export const privateData = protectedProcedure.handler(({ context }) => ({
  message: "This is private",
  user: context.session?.user,
}));
