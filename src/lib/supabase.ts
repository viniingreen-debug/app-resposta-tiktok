import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface User {
  id: string
  email: string
  name: string
  plan: 'free' | 'premium' | 'enterprise'
  subscription_status: 'active' | 'expired' | 'trial' | 'cancelled'
  subscription_expires_at?: string
  created_at: string
  updated_at: string
  google_id?: string
  avatar_url?: string
  settings: any
}

export interface TikTokAccount {
  id: string
  user_id: string
  username: string
  display_name?: string
  access_token?: string
  refresh_token?: string
  account_id?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  user_id: string
  tiktok_account_id?: string
  name: string
  username: string
  message: string
  status: 'new' | 'in_progress' | 'converted' | 'lost'
  category?: string
  priority: 'low' | 'medium' | 'high'
  score: number
  source: string
  tags: string[]
  metadata: any
  last_activity: string
  created_at: string
  updated_at: string
}

export interface Template {
  id: string
  user_id: string
  name: string
  content: string
  category?: string
  tone: 'professional' | 'casual' | 'sales'
  auto_trigger: string[]
  usage_count: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AutoResponse {
  id: string
  user_id: string
  trigger_keyword: string
  response_text: string
  category?: string
  is_active: boolean
  usage_count: number
  created_at: string
  updated_at: string
}

export interface Conversation {
  id: string
  lead_id: string
  user_id: string
  message_type?: string
  message_content: string
  sender?: string
  template_id?: string
  is_automated: boolean
  created_at: string
}

export interface Integration {
  id: string
  user_id: string
  integration_type: string
  integration_name: string
  status: 'connected' | 'disconnected'
  config: any
  credentials: any
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: string
  is_read: boolean
  metadata: any
  created_at: string
}

export interface Analytics {
  id: string
  user_id: string
  metric_name: string
  metric_value: number
  metric_data: any
  date_recorded: string
  created_at: string
}