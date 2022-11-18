import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/signIn",
  },
  secret: "KVmJsbHWfY9ngjHoN0oR",
});

export const config = { matcher: ["/search", "/discover"] };
