export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            posts: {
                Row: {
                    id: string
                    title: string
                    slug: string
                    content: string
                    thumbnail_url: string | null
                    category: string | null
                    is_published: boolean
                    published_at: string | null
                    created_at: string
                    views: number
                }
                Insert: {
                    id?: string
                    title: string
                    slug: string
                    content: string
                    thumbnail_url?: string | null
                    category?: string | null
                    is_published?: boolean
                    published_at?: string | null
                    created_at?: string
                    views?: number
                }
                Update: {
                    id?: string
                    title?: string
                    slug?: string
                    content?: string
                    thumbnail_url?: string | null
                    category?: string | null
                    is_published?: boolean
                    published_at?: string | null
                    created_at?: string
                    views?: number
                }
            }
            services: {
                Row: {
                    id: string
                    name: string
                    description: string
                    type: "Online" | "Offline"
                    link_url: string | null
                    location: string | null
                    icon_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description: string
                    type: "Online" | "Offline"
                    link_url?: string | null
                    location?: string | null
                    icon_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string
                    type?: "Online" | "Offline"
                    link_url?: string | null
                    location?: string | null
                    icon_url?: string | null
                    created_at?: string
                }
            }
            navigation_menus: {
                Row: {
                    id: string
                    title: string
                    href: string
                    parent_id: string | null
                    order: number
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    href: string
                    parent_id?: string | null
                    order?: number
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    href?: string
                    parent_id?: string | null
                    order?: number
                    is_active?: boolean
                    created_at?: string
                }
            }
        }
    }
}
