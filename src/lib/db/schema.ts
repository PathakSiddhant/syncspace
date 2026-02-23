import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Users Table (Synced with Clerk Auth)
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk User ID
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2. Workspaces Table (For team collaboration)
export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  ownerId: text("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 3. Boards Table (The actual whiteboards)
export const boards = pgTable("boards", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull().default("Untitled Board"),
  workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  creatorId: text("creator_id").notNull().references(() => users.id),
  isFavorite: boolean("is_favorite").default(false).notNull(),
  
  // 🔥 NEW: Public link sharing status!
  linkAccess: text("link_access").notNull().default("private"), // 'private', 'view', or 'edit'
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Database Relations (For easy querying later)
export const usersRelations = relations(users, ({ many }) => ({
  workspaces: many(workspaces),
  boards: many(boards),
}));

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  owner: one(users, {
    fields: [workspaces.ownerId],
    references: [users.id],
  }),
  boards: many(boards),
}));

export const boardsRelations = relations(boards, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [boards.workspaceId],
    references: [workspaces.id],
  }),
  creator: one(users, {
    fields: [boards.creatorId],
    references: [users.id],
  }),
}));

// 🔥 NEW: The Collaborators Table for Host Controls & Permissions
export const collaborators = pgTable("collaborators", {
  id: uuid("id").defaultRandom().primaryKey(),
  
  // Jis board ka access diya jaa raha hai (If board is deleted, delete collaborators too)
  boardId: uuid("board_id")
    .references(() => boards.id, { onDelete: "cascade" })
    .notNull(),
  
  // Jisko invite kiya jaa raha hai (Email use kar rahe hain taaki bina account wale ko bhi invite bhej sakein)
  email: text("email").notNull(),
  
  // Permission Level: 'view' ya 'edit'
  accessType: text("access_type").notNull().default("view"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});