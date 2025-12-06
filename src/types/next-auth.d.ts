import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      tenantId: string;
      tenantName: string;
      role: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    tenantId: string;
    tenantName: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    tenantId: string;
    tenantName: string;
    role: string;
  }
}
