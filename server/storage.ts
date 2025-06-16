import { users, photos, type User, type InsertUser, type Photo, type InsertPhoto, type UpdatePhoto } from "@shared/schema";
import { db } from "./db";
import { eq, desc, or, like, arrayContains, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Photo operations
  getAllPhotos(): Promise<Photo[]>;
  getPhoto(id: number): Promise<Photo | undefined>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  updatePhoto(id: number, photo: UpdatePhoto): Promise<Photo | undefined>;
  deletePhoto(id: number): Promise<boolean>;
  searchPhotos(query: string, tag?: string): Promise<Photo[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllPhotos(): Promise<Photo[]> {
    return await db.select().from(photos).orderBy(desc(photos.id));
  }

  async getPhoto(id: number): Promise<Photo | undefined> {
    const [photo] = await db.select().from(photos).where(eq(photos.id, id));
    return photo || undefined;
  }

  async createPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    const [photo] = await db
      .insert(photos)
      .values(insertPhoto)
      .returning();
    return photo;
  }

  async updatePhoto(id: number, updatePhoto: UpdatePhoto): Promise<Photo | undefined> {
    const [photo] = await db
      .update(photos)
      .set(updatePhoto)
      .where(eq(photos.id, id))
      .returning();
    return photo || undefined;
  }

  async deletePhoto(id: number): Promise<boolean> {
    const result = await db.delete(photos).where(eq(photos.id, id));
    return (result.rowCount || 0) > 0;
  }

  async searchPhotos(query: string, tag?: string): Promise<Photo[]> {
    let conditions = [];

    if (query) {
      const searchTerm = `%${query.toLowerCase()}%`;
      conditions.push(
        or(
          like(photos.title, searchTerm),
          like(photos.description, searchTerm)
        )
      );
    }

    if (tag) {
      conditions.push(arrayContains(photos.tags, [tag]));
    }

    if (conditions.length === 0) {
      return this.getAllPhotos();
    }

    return await db
      .select()
      .from(photos)
      .where(conditions.length === 1 ? conditions[0] : conditions.reduce((acc, condition) => acc ? and(acc, condition) : condition, null))
      .orderBy(desc(photos.id));
  }
}

export const storage = new DatabaseStorage();
