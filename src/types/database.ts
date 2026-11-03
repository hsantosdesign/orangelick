/**
 * Typed Supabase schema for the Orange Lick database.
 * Mirrors the existing `products` and `posts` tables exactly.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          category: string;
          price: number;
          short_description: string;
          full_description: string | null;
          ingredients: string[] | null;
          image_url: string;
          is_highlight: boolean | null;
          is_available: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          category: string;
          price: number;
          short_description: string;
          full_description?: string | null;
          ingredients?: string[] | null;
          image_url: string;
          is_highlight?: boolean | null;
          is_available?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          category?: string;
          price?: number;
          short_description?: string;
          full_description?: string | null;
          ingredients?: string[] | null;
          image_url?: string;
          is_highlight?: boolean | null;
          is_available?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          cover_image: string;
          author_name: string | null;
          category: string;
          read_time: string | null;
          published: boolean | null;
          published_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          cover_image: string;
          author_name?: string | null;
          category: string;
          read_time?: string | null;
          published?: boolean | null;
          published_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string;
          content?: string;
          cover_image?: string;
          author_name?: string | null;
          category?: string;
          read_time?: string | null;
          published?: boolean | null;
          published_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

type PublicTables = Database["public"]["Tables"];

export type TableName = keyof PublicTables;
export type Tables<T extends TableName> = PublicTables[T]["Row"];
export type TablesInsert<T extends TableName> = PublicTables[T]["Insert"];
export type TablesUpdate<T extends TableName> = PublicTables[T]["Update"];

export type Product = Tables<"products">;
export type ProductInsert = TablesInsert<"products">;
export type ProductUpdate = TablesUpdate<"products">;

export type Post = Tables<"posts">;
export type PostInsert = TablesInsert<"posts">;
export type PostUpdate = TablesUpdate<"posts">;
