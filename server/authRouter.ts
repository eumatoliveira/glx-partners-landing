import { z } from "zod";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { 
  getUserByEmail, 
  createUserWithPassword, 
  updateUserPassword, 
  updateUserLastSignIn,
  getAllUsers,
  updateUser,
  deleteUser,
  updateUserStatus,
  createAuditLog
} from "./db";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { SignJWT } from "jose";
import { ENV } from "./_core/env";

const ADMIN_EMAIL = "dev.glxpartners@gmail.com";
const ADMIN_PASSWORD = "Dev.glxpartners!311";

// Initialize admin user on first load
async function initializeAdminUser() {
  const existingAdmin = await getUserByEmail(ADMIN_EMAIL);
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await createUserWithPassword({
      email: ADMIN_EMAIL,
      passwordHash,
      name: "GLX Admin",
      role: "admin",
    });
    console.log("[Auth] Admin user created:", ADMIN_EMAIL);
  }
}

// Call initialization
initializeAdminUser().catch(console.error);

export const authRouter = router({
  // Login with email/password
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
    }))
    .mutation(async ({ input, ctx }) => {
      const user = await getUserByEmail(input.email);
      
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Email ou senha inválidos",
        });
      }

      if (!user.passwordHash) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Este usuário não possui senha configurada. Use outro método de login.",
        });
      }

      if (!user.isActive) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Conta desativada. Entre em contato com o administrador.",
        });
      }

      const isValidPassword = await bcrypt.compare(input.password, user.passwordHash);
      
      if (!isValidPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Email ou senha inválidos",
        });
      }

      // Update last sign in
      await updateUserLastSignIn(user.id);

      // Create JWT token
      const secret = new TextEncoder().encode(ENV.cookieSecret);
      const token = await new SignJWT({
        sub: user.openId,
        email: user.email,
        role: user.role,
        name: user.name,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);

      // Set cookie
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, token, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Create audit log
      await createAuditLog({
        userId: user.id,
        action: "login",
        entity: "user",
        entityId: user.id.toString(),
        ipAddress: ctx.req.ip || ctx.req.headers["x-forwarded-for"]?.toString(),
        userAgent: ctx.req.headers["user-agent"],
      });

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    }),

  // Register new user (admin only or self-registration if enabled)
  register: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const existingUser = await getUserByEmail(input.email);
      
      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Este email já está cadastrado",
        });
      }

      const passwordHash = await bcrypt.hash(input.password, 12);
      
      const user = await createUserWithPassword({
        email: input.email,
        passwordHash,
        name: input.name,
        role: "user",
      });

      return {
        success: true,
        message: "Usuário criado com sucesso",
      };
    }),

  // Change password (authenticated user)
  changePassword: protectedProcedure
    .input(z.object({
      currentPassword: z.string(),
      newPassword: z.string().min(6),
    }))
    .mutation(async ({ input, ctx }) => {
      const user = await getUserByEmail(ctx.user.email || "");
      
      if (!user || !user.passwordHash) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Usuário não encontrado ou sem senha configurada",
        });
      }

      const isValidPassword = await bcrypt.compare(input.currentPassword, user.passwordHash);
      
      if (!isValidPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Senha atual incorreta",
        });
      }

      const newPasswordHash = await bcrypt.hash(input.newPassword, 12);
      await updateUserPassword(user.id, newPasswordHash);

      await createAuditLog({
        userId: user.id,
        action: "change_password",
        entity: "user",
        entityId: user.id.toString(),
      });

      return { success: true, message: "Senha alterada com sucesso" };
    }),

  // Admin: Create user
  createUser: protectedProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().optional(),
      role: z.enum(["user", "admin"]).default("user"),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem criar usuários",
        });
      }

      const existingUser = await getUserByEmail(input.email);
      
      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Este email já está cadastrado",
        });
      }

      const passwordHash = await bcrypt.hash(input.password, 12);
      
      const user = await createUserWithPassword({
        email: input.email,
        passwordHash,
        name: input.name,
        role: input.role,
      });

      await createAuditLog({
        userId: ctx.user.id,
        action: "create_user",
        entity: "user",
        entityId: user?.id.toString(),
        newValue: { email: input.email, role: input.role },
      });

      return { success: true, message: "Usuário criado com sucesso" };
    }),

  // Admin: Update user
  updateUser: protectedProcedure
    .input(z.object({
      userId: z.number(),
      name: z.string().optional(),
      email: z.string().email().optional(),
      role: z.enum(["user", "admin"]).optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem editar usuários",
        });
      }

      const { userId, ...updates } = input;
      await updateUser(userId, updates);

      await createAuditLog({
        userId: ctx.user.id,
        action: "update_user",
        entity: "user",
        entityId: userId.toString(),
        newValue: updates,
      });

      return { success: true, message: "Usuário atualizado com sucesso" };
    }),

  // Admin: Delete user
  deleteUser: protectedProcedure
    .input(z.object({
      userId: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem excluir usuários",
        });
      }

      // Prevent deleting self
      if (input.userId === ctx.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Você não pode excluir sua própria conta",
        });
      }

      await deleteUser(input.userId);

      await createAuditLog({
        userId: ctx.user.id,
        action: "delete_user",
        entity: "user",
        entityId: input.userId.toString(),
      });

      return { success: true, message: "Usuário excluído com sucesso" };
    }),

  // Admin: Reset user password
  resetPassword: protectedProcedure
    .input(z.object({
      userId: z.number(),
      newPassword: z.string().min(6),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem resetar senhas",
        });
      }

      const passwordHash = await bcrypt.hash(input.newPassword, 12);
      await updateUserPassword(input.userId, passwordHash);

      await createAuditLog({
        userId: ctx.user.id,
        action: "reset_password",
        entity: "user",
        entityId: input.userId.toString(),
      });

      return { success: true, message: "Senha resetada com sucesso" };
    }),

  // Admin: Toggle user status
  toggleUserStatus: protectedProcedure
    .input(z.object({
      userId: z.number(),
      isActive: z.boolean(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem alterar status de usuários",
        });
      }

      await updateUserStatus(input.userId, input.isActive);

      await createAuditLog({
        userId: ctx.user.id,
        action: input.isActive ? "activate_user" : "deactivate_user",
        entity: "user",
        entityId: input.userId.toString(),
      });

      return { success: true, message: `Usuário ${input.isActive ? "ativado" : "desativado"} com sucesso` };
    }),

  // Get all users (admin only)
  getAllUsers: protectedProcedure
    .input(z.object({
      limit: z.number().default(100),
      offset: z.number().default(0),
    }).optional())
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem listar usuários",
        });
      }

      const users = await getAllUsers(input?.limit || 100, input?.offset || 0);
      return users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        isActive: u.isActive,
        mfaEnabled: u.mfaEnabled,
        loginMethod: u.loginMethod,
        createdAt: u.createdAt,
        lastSignedIn: u.lastSignedIn,
      }));
    }),
});
