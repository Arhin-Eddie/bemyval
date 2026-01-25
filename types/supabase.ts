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
            profiles: {
                Row: {
                    id: string
                    display_name: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    display_name?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    display_name?: string | null
                    created_at?: string
                }
            }
            invites: {
                Row: {
                    id: string
                    creator_id: string
                    short_code: string
                    message: string
                    recipient_name: string
                    responded: boolean
                    first_device_token: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    creator_id: string
                    short_code: string
                    message: string
                    recipient_name: string
                    responded?: boolean
                    first_device_token?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    creator_id?: string
                    short_code?: string
                    message?: string
                    recipient_name?: string
                    responded?: boolean
                    first_device_token?: string | null
                    created_at?: string
                }
            }
            responses: {
                Row: {
                    id: string
                    invite_id: string
                    anon_id: string
                    answer: 'yes' | 'no' | 'maybe' | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    invite_id: string
                    anon_id: string
                    answer?: 'yes' | 'no' | 'maybe' | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    invite_id?: string
                    anon_id?: string
                    answer?: 'yes' | 'no' | 'maybe' | null
                    created_at?: string
                }
            }
        }
    }
}
