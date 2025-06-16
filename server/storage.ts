import { users, photos, type User, type InsertUser, type Photo, type InsertPhoto, type UpdatePhoto } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private photos: Map<number, Photo>;
  private currentUserId: number;
  private currentPhotoId: number;

  constructor() {
    this.users = new Map();
    this.photos = new Map();
    this.currentUserId = 1;
    this.currentPhotoId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllPhotos(): Promise<Photo[]> {
    return Array.from(this.photos.values()).sort((a, b) => b.id - a.id);
  }

  async getPhoto(id: number): Promise<Photo | undefined> {
    return this.photos.get(id);
  }

  async createPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    const id = this.currentPhotoId++;
    const photo: Photo = { ...insertPhoto, id };
    this.photos.set(id, photo);
    return photo;
  }

  async updatePhoto(id: number, updatePhoto: UpdatePhoto): Promise<Photo | undefined> {
    const existingPhoto = this.photos.get(id);
    if (!existingPhoto) return undefined;

    const updatedPhoto: Photo = { ...existingPhoto, ...updatePhoto };
    this.photos.set(id, updatedPhoto);
    return updatedPhoto;
  }

  async deletePhoto(id: number): Promise<boolean> {
    return this.photos.delete(id);
  }

  async searchPhotos(query: string, tag?: string): Promise<Photo[]> {
    const allPhotos = await this.getAllPhotos();
    const searchTerm = query.toLowerCase();

    return allPhotos.filter(photo => {
      const matchesQuery = !query || 
        photo.title.toLowerCase().includes(searchTerm) ||
        photo.description.toLowerCase().includes(searchTerm);

      const matchesTag = !tag || photo.tags.includes(tag);

      return matchesQuery && matchesTag;
    });
  }
}

export const storage = new MemStorage();
