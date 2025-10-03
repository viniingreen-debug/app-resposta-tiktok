import { useState, useEffect } from 'react'
import { supabase, type User, type Lead, type Template, type AutoResponse, type Integration, type Notification } from '@/lib/supabase'
import { showSuccessToast, showErrorToast } from '@/lib/toast'

// Hook para autenticação
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUser(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUser(session.user.id)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUser = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setUser(data)
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      showSuccessToast('Login realizado com sucesso!')
      return true
    } catch (error: any) {
      showErrorToast(error.message)
      return false
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error

      if (data.user) {
        // Criar perfil do usuário
        await supabase.from('users').insert({
          id: data.user.id,
          email,
          name,
          plan: 'free',
          subscription_status: 'trial'
        })
      }

      showSuccessToast('Conta criada com sucesso!')
      return true
    } catch (error: any) {
      showErrorToast(error.message)
      return false
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      showSuccessToast('Logout realizado com sucesso!')
    } catch (error: any) {
      showErrorToast(error.message)
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (error: any) {
      showErrorToast(error.message)
    }
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle
  }
}

// Hook para gerenciar leads
export function useLeads(userId?: string) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      fetchLeads()
    }
  }, [userId])

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setLeads(data || [])
    } catch (error) {
      console.error('Erro ao buscar leads:', error)
      showErrorToast('Erro ao carregar leads')
    } finally {
      setLoading(false)
    }
  }

  const createLead = async (leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert(leadData)
        .select()
        .single()

      if (error) throw error
      setLeads(prev => [data, ...prev])
      showSuccessToast('Lead criado com sucesso!')
      return data
    } catch (error: any) {
      showErrorToast(error.message)
      return null
    }
  }

  const updateLead = async (leadId: string, updates: Partial<Lead>) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', leadId)
        .select()
        .single()

      if (error) throw error
      setLeads(prev => prev.map(lead => lead.id === leadId ? data : lead))
      return data
    } catch (error: any) {
      showErrorToast(error.message)
      return null
    }
  }

  const updateLeadsStatus = async (leadIds: string[], status: Lead['status']) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ 
          status, 
          last_activity: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .in('id', leadIds)

      if (error) throw error
      
      setLeads(prev => prev.map(lead => 
        leadIds.includes(lead.id) 
          ? { ...lead, status, last_activity: new Date().toISOString() }
          : lead
      ))
      
      showSuccessToast(`${leadIds.length} leads atualizados!`)
      return true
    } catch (error: any) {
      showErrorToast(error.message)
      return false
    }
  }

  return {
    leads,
    loading,
    fetchLeads,
    createLead,
    updateLead,
    updateLeadsStatus
  }
}

// Hook para gerenciar templates
export function useTemplates(userId?: string) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      fetchTemplates()
    }
  }, [userId])

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTemplates(data || [])
    } catch (error) {
      console.error('Erro ao buscar templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTemplate = async (templateData: Omit<Template, 'id' | 'created_at' | 'updated_at' | 'usage_count'>) => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .insert({ ...templateData, usage_count: 0 })
        .select()
        .single()

      if (error) throw error
      setTemplates(prev => [data, ...prev])
      showSuccessToast('Template criado com sucesso!')
      return data
    } catch (error: any) {
      showErrorToast(error.message)
      return null
    }
  }

  const updateTemplate = async (templateId: string, updates: Partial<Template>) => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', templateId)
        .select()
        .single()

      if (error) throw error
      setTemplates(prev => prev.map(template => template.id === templateId ? data : template))
      return data
    } catch (error: any) {
      showErrorToast(error.message)
      return null
    }
  }

  const incrementTemplateUsage = async (templateId: string) => {
    try {
      const { error } = await supabase.rpc('increment_template_usage', { template_id: templateId })
      if (error) throw error
    } catch (error) {
      console.error('Erro ao incrementar uso do template:', error)
    }
  }

  return {
    templates,
    loading,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    incrementTemplateUsage
  }
}

// Hook para gerenciar respostas automáticas
export function useAutoResponses(userId?: string) {
  const [autoResponses, setAutoResponses] = useState<AutoResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      fetchAutoResponses()
    }
  }, [userId])

  const fetchAutoResponses = async () => {
    try {
      const { data, error } = await supabase
        .from('auto_responses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setAutoResponses(data || [])
    } catch (error) {
      console.error('Erro ao buscar respostas automáticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const createAutoResponse = async (responseData: Omit<AutoResponse, 'id' | 'created_at' | 'updated_at' | 'usage_count'>) => {
    try {
      const { data, error } = await supabase
        .from('auto_responses')
        .insert({ ...responseData, usage_count: 0 })
        .select()
        .single()

      if (error) throw error
      setAutoResponses(prev => [data, ...prev])
      showSuccessToast('Resposta automática criada!')
      return data
    } catch (error: any) {
      showErrorToast(error.message)
      return null
    }
  }

  const updateAutoResponse = async (responseId: string, updates: Partial<AutoResponse>) => {
    try {
      const { data, error } = await supabase
        .from('auto_responses')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', responseId)
        .select()
        .single()

      if (error) throw error
      setAutoResponses(prev => prev.map(response => response.id === responseId ? data : response))
      return data
    } catch (error: any) {
      showErrorToast(error.message)
      return null
    }
  }

  return {
    autoResponses,
    loading,
    fetchAutoResponses,
    createAutoResponse,
    updateAutoResponse
  }
}

// Hook para gerenciar notificações
export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      fetchNotifications()
      
      // Configurar real-time para notificações
      const subscription = supabase
        .channel('notifications')
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'notifications',
            filter: `user_id=eq.${userId}`
          }, 
          (payload) => {
            setNotifications(prev => [payload.new as Notification, ...prev])
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [userId])

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setNotifications(data || [])
    } catch (error) {
      console.error('Erro ao buscar notificações:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)

      if (error) throw error
      setNotifications(prev => prev.map(notif => 
        notif.id === notificationId ? { ...notif, is_read: true } : notif
      ))
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false)

      if (error) throw error
      setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })))
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error)
    }
  }

  return {
    notifications,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  }
}