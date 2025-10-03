"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { 
  MessageSquare, Users, Send, TrendingUp, Settings, Plus, Eye, Edit, Trash2, Filter, 
  Zap, Target, Clock, Bell, BellRing, Star, Calendar, BarChart3, Download, 
  MessageCircle, Smartphone, Mail, Globe, CreditCard, Shield, Bot, 
  CheckCircle, AlertCircle, XCircle, ArrowUp, ArrowDown, Sparkles,
  LogIn, UserPlus, Key, RefreshCw, Search, FileText, Share2
} from 'lucide-react'
import { showSuccessToast, showInfoToast, showErrorToast } from '@/lib/toast'

interface Lead {
  id: string
  name: string
  username: string
  message: string
  timestamp: string
  status: 'new' | 'in_progress' | 'converted' | 'lost'
  category: string
  priority: 'low' | 'medium' | 'high'
  score: number
  lastActivity: string
  source: string
  tags: string[]
}

interface Template {
  id: string
  name: string
  content: string
  category: string
  tone: 'professional' | 'casual' | 'sales'
  autoTrigger?: string[]
}

interface AutoResponse {
  id: string
  trigger: string
  response: string
  active: boolean
  category: string
}

interface Integration {
  id: string
  name: string
  type: 'whatsapp' | 'email' | 'sheets' | 'crm'
  status: 'connected' | 'disconnected'
  config: any
}

interface User {
  id: string
  name: string
  email: string
  plan: 'free' | 'premium' | 'enterprise'
  subscription: {
    status: 'active' | 'expired' | 'trial'
    expiresAt: string
  }
}

export default function TikTokLeadManager() {
  // Estados principais
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: '1',
    name: 'João Silva',
    email: 'joao@exemplo.com',
    plan: 'premium',
    subscription: {
      status: 'active',
      expiresAt: '2024-02-15'
    }
  })
  
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'Ana Silva',
      username: '@anasilva123',
      message: 'Oi! Vi seu vídeo sobre marketing digital. Pode me ajudar com meu negócio?',
      timestamp: '2024-01-15 14:30',
      status: 'new',
      category: 'marketing',
      priority: 'high',
      score: 85,
      lastActivity: '2024-01-15 14:30',
      source: 'TikTok DM',
      tags: ['interessado', 'negócio']
    },
    {
      id: '2',
      name: 'Carlos Santos',
      username: '@carlossantos',
      message: 'Interessado nos seus serviços de consultoria. Como funciona?',
      timestamp: '2024-01-15 13:45',
      status: 'in_progress',
      category: 'consultoria',
      priority: 'high',
      score: 92,
      lastActivity: '2024-01-15 15:20',
      source: 'TikTok Comment',
      tags: ['consultoria', 'quente']
    },
    {
      id: '3',
      name: 'Maria Oliveira',
      username: '@mariaoliveira',
      message: 'Preciso de ajuda com tráfego orgânico para minha loja online',
      timestamp: '2024-01-15 12:20',
      status: 'converted',
      category: 'ecommerce',
      priority: 'medium',
      score: 78,
      lastActivity: '2024-01-15 16:45',
      source: 'TikTok DM',
      tags: ['ecommerce', 'convertido']
    },
    {
      id: '4',
      name: 'João Pereira',
      username: '@joaopereira',
      message: 'Quero saber mais sobre seus cursos de marketing digital',
      timestamp: '2024-01-15 11:15',
      status: 'new',
      category: 'educacao',
      priority: 'medium',
      score: 65,
      lastActivity: '2024-01-15 11:15',
      source: 'TikTok DM',
      tags: ['curso', 'educação']
    },
    {
      id: '5',
      name: 'Fernanda Costa',
      username: '@fernandacosta',
      message: 'Posso agendar uma consultoria? Tenho uma startup',
      timestamp: '2024-01-15 10:30',
      status: 'new',
      category: 'startup',
      priority: 'high',
      score: 88,
      lastActivity: '2024-01-15 10:30',
      source: 'TikTok DM',
      tags: ['startup', 'agendamento']
    }
  ])

  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: 'Resposta Inicial - Marketing',
      content: 'Olá {nome}! 👋 Obrigado pelo interesse! Trabalho com estratégias de marketing digital personalizadas. Vou te enviar mais detalhes no privado!',
      category: 'marketing',
      tone: 'professional',
      autoTrigger: ['marketing', 'digital', 'estratégia']
    },
    {
      id: '2',
      name: 'Consultoria - Primeira Resposta',
      content: 'Oi {nome}! 😊 Que bom saber do seu interesse! Ofereço consultoria personalizada para acelerar resultados. Te chamo no privado para conversarmos melhor!',
      category: 'consultoria',
      tone: 'casual',
      autoTrigger: ['consultoria', 'ajuda', 'orientação']
    }
  ])

  const [autoResponses, setAutoResponses] = useState<AutoResponse[]>([
    {
      id: '1',
      trigger: 'preço',
      response: 'Olá! Os valores variam conforme o projeto. Vou te mandar uma tabela completa no privado! 💰',
      active: true,
      category: 'pricing'
    },
    {
      id: '2',
      trigger: 'whatsapp',
      response: 'Claro! Aqui está meu WhatsApp: (11) 99999-9999. Vamos conversar por lá! 📱',
      active: true,
      category: 'contact'
    }
  ])

  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: '1', name: 'WhatsApp Business', type: 'whatsapp', status: 'connected', config: {} },
    { id: '2', name: 'Google Sheets', type: 'sheets', status: 'connected', config: {} },
    { id: '3', name: 'Email Marketing', type: 'email', status: 'disconnected', config: {} }
  ])

  const [notifications, setNotifications] = useState([
    { id: '1', message: 'Novo lead de alta prioridade: Ana Silva', time: '2 min atrás', read: false },
    { id: '2', message: 'Carlos Santos mencionou "quero comprar"', time: '5 min atrás', read: false },
    { id: '3', message: '3 leads convertidos hoje', time: '1 hora atrás', read: true }
  ])

  // Estados de controle
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  // Formulários
  const [newTemplate, setNewTemplate] = useState({ 
    name: '', 
    content: '', 
    category: '', 
    tone: 'professional' as const,
    autoTrigger: [] as string[]
  })
  const [newAutoResponse, setNewAutoResponse] = useState({
    trigger: '',
    response: '',
    category: ''
  })

  // Login/Cadastro
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' })
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  // Efeitos
  useEffect(() => {
    // Simular notificações em tempo real
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const newNotification = {
          id: Date.now().toString(),
          message: 'Novo lead recebido!',
          time: 'agora',
          read: false
        }
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)])
        showInfoToast('🔔 Novo lead recebido!')
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Funções principais
  const handleLogin = async () => {
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoggedIn(true)
    setShowLogin(false)
    setIsProcessing(false)
    showSuccessToast('Login realizado com sucesso!')
  }

  const handleRegister = async () => {
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoggedIn(true)
    setShowRegister(false)
    setIsProcessing(false)
    showSuccessToast('Conta criada com sucesso!')
  }

  const handleSelectLead = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    )
  }

  const handleSelectAll = () => {
    const filteredLeads = getFilteredLeads()
    const allSelected = filteredLeads.every(lead => selectedLeads.includes(lead.id))
    
    if (allSelected) {
      setSelectedLeads([])
      showInfoToast('Todos os leads foram desmarcados')
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id))
      showInfoToast(`${filteredLeads.length} leads selecionados`)
    }
  }

  const handleSendBulkResponse = async () => {
    if (!selectedTemplate || selectedLeads.length === 0) return

    const template = templates.find(t => t.id === selectedTemplate)
    if (!template) return

    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))

    setLeads(prev => prev.map(lead => 
      selectedLeads.includes(lead.id) 
        ? { ...lead, status: 'in_progress' as const, lastActivity: new Date().toISOString() }
        : lead
    ))

    setSelectedLeads([])
    setIsProcessing(false)
    showSuccessToast(`✅ Resposta enviada para ${selectedLeads.length} leads com sucesso!`)
  }

  const getFilteredLeads = () => {
    return leads.filter(lead => {
      const statusMatch = filterStatus === 'all' || lead.status === filterStatus
      const categoryMatch = filterCategory === 'all' || lead.category === filterCategory
      const priorityMatch = filterPriority === 'all' || lead.priority === filterPriority
      const searchMatch = searchTerm === '' || 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.username.toLowerCase().includes(searchTerm.toLowerCase())
      
      return statusMatch && categoryMatch && priorityMatch && searchMatch
    })
  }

  const addTemplate = () => {
    if (!newTemplate.name || !newTemplate.content) return

    const template: Template = {
      id: Date.now().toString(),
      ...newTemplate
    }

    setTemplates(prev => [...prev, template])
    setNewTemplate({ name: '', content: '', category: '', tone: 'professional', autoTrigger: [] })
    showSuccessToast('Template criado com sucesso!')
  }

  const addAutoResponse = () => {
    if (!newAutoResponse.trigger || !newAutoResponse.response) return

    const autoResponse: AutoResponse = {
      id: Date.now().toString(),
      ...newAutoResponse,
      active: true
    }

    setAutoResponses(prev => [...prev, autoResponse])
    setNewAutoResponse({ trigger: '', response: '', category: '' })
    showSuccessToast('Resposta automática criada!')
  }

  const exportLeads = () => {
    const csvContent = leads.map(lead => 
      `${lead.name},${lead.username},${lead.message},${lead.status},${lead.score}`
    ).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'leads.csv'
    a.click()
    
    showSuccessToast('Leads exportados com sucesso!')
  }

  const getStats = () => {
    const total = leads.length
    const newLeads = leads.filter(l => l.status === 'new').length
    const inProgress = leads.filter(l => l.status === 'in_progress').length
    const converted = leads.filter(l => l.status === 'converted').length
    const lost = leads.filter(l => l.status === 'lost').length
    const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0
    const avgScore = total > 0 ? Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / total) : 0
    
    return { total, newLeads, inProgress, converted, lost, conversionRate, avgScore }
  }

  const stats = getStats()

  // Tela de Login/Cadastro
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                TikTok Lead Manager
              </h1>
            </div>
            <p className="text-gray-600">Gerencie seus leads do TikTok de forma inteligente</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Cadastro</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="seu@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input 
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                  />
                </div>
                <Button 
                  onClick={handleLogin}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <LogIn className="h-4 w-4 mr-2" />}
                  {isProcessing ? 'Entrando...' : 'Entrar'}
                </Button>
                <Button variant="outline" className="w-full">
                  <Globe className="h-4 w-4 mr-2" />
                  Entrar com Google
                </Button>
                <Button variant="link" className="w-full text-sm">
                  <Key className="h-4 w-4 mr-2" />
                  Esqueci minha senha
                </Button>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input 
                    id="name"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Seu nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">E-mail</Label>
                  <Input 
                    id="reg-email"
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="seu@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Senha</Label>
                  <Input 
                    id="reg-password"
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                  />
                </div>
                <Button 
                  onClick={handleRegister}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
                  {isProcessing ? 'Criando conta...' : 'Criar conta'}
                </Button>
                <Button variant="outline" className="w-full">
                  <Globe className="h-4 w-4 mr-2" />
                  Cadastrar com Google
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  TikTok Lead Manager
                </h1>
                <p className="text-xs text-gray-500">Plano {currentUser?.plan.toUpperCase()}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative"
                >
                  <Bell className="h-4 w-4" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
                  )}
                </Button>
                
                {showNotifications && (
                  <Card className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto z-50 shadow-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Notificações</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {notifications.map(notification => (
                        <div key={notification.id} className={`p-2 rounded text-sm ${notification.read ? 'bg-gray-50' : 'bg-blue-50'}`}>
                          <p className="font-medium">{notification.message}</p>
                          <p className="text-xs text-gray-500">{notification.time}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">{currentUser?.name}</span>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsLoggedIn(false)}
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="leads" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Leads
            </TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              <MessageSquare className="h-4 w-4 mr-2" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="automation" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              <Bot className="h-4 w-4 mr-2" />
              Automação
            </TabsTrigger>
            <TabsTrigger value="integrations" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              <Share2 className="h-4 w-4 mr-2" />
              Integrações
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                      <p className="text-sm text-gray-600">Total de Leads</p>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-100">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600">+12% vs mês anterior</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stats.newLeads}</p>
                      <p className="text-sm text-gray-600">Novos Leads</p>
                    </div>
                    <div className="p-3 rounded-lg bg-orange-100">
                      <BellRing className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600">+8% hoje</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stats.converted}</p>
                      <p className="text-sm text-gray-600">Convertidos</p>
                    </div>
                    <div className="p-3 rounded-lg bg-green-100">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600">+15% esta semana</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
                      <p className="text-sm text-gray-600">Taxa de Conversão</p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-100">
                      <TrendingUp className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600">+3% vs média</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Ações Rápidas
                </CardTitle>
                <CardDescription>
                  Acesse rapidamente as funcionalidades mais utilizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => setActiveTab('leads')}
                    className="h-20 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex-col gap-2"
                  >
                    <MessageCircle className="h-6 w-6" />
                    Responder Leads
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('automation')}
                    variant="outline"
                    className="h-20 flex-col gap-2 hover:bg-purple-50"
                  >
                    <Bot className="h-6 w-6" />
                    Configurar IA
                  </Button>
                  <Button 
                    onClick={exportLeads}
                    variant="outline"
                    className="h-20 flex-col gap-2 hover:bg-purple-50"
                  >
                    <Download className="h-6 w-6" />
                    Exportar Dados
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>Últimas interações com seus leads</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leads.slice(0, 5).map(lead => (
                    <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          lead.status === 'new' ? 'bg-orange-500' :
                          lead.status === 'in_progress' ? 'bg-blue-500' :
                          lead.status === 'converted' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-sm text-gray-600">{lead.message.substring(0, 50)}...</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-1">
                          Score: {lead.score}
                        </Badge>
                        <p className="text-xs text-gray-500">{lead.lastActivity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leads Management */}
          <TabsContent value="leads" className="space-y-6">
            {/* Search and Filters */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Buscar por nome, username ou mensagem..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os Status</SelectItem>
                        <SelectItem value="new">🟢 Novos</SelectItem>
                        <SelectItem value="in_progress">🟡 Em Andamento</SelectItem>
                        <SelectItem value="converted">🔵 Convertidos</SelectItem>
                        <SelectItem value="lost">🔴 Perdidos</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterPriority} onValueChange={setFilterPriority}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="low">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bulk Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Resposta em Massa
                </CardTitle>
                <CardDescription>
                  Selecione leads e envie respostas personalizadas em lote
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha um template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSelectAll}
                      variant="outline"
                      className="border-purple-200 hover:bg-purple-50"
                    >
                      {getFilteredLeads().every(lead => selectedLeads.includes(lead.id)) ? 'Desmarcar Todos' : 'Selecionar Todos'}
                    </Button>
                    <Button 
                      onClick={handleSendBulkResponse}
                      disabled={selectedLeads.length === 0 || !selectedTemplate || isProcessing}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {isProcessing ? 'Enviando...' : `Enviar para ${selectedLeads.length} leads`}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leads List */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Lista de Leads</CardTitle>
                    <CardDescription>
                      {getFilteredLeads().length} leads encontrados
                    </CardDescription>
                  </div>
                  <Button onClick={exportLeads} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getFilteredLeads().map(lead => (
                    <div 
                      key={lead.id}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                        selectedLeads.includes(lead.id) 
                          ? 'border-purple-300 bg-purple-50 shadow-md' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleSelectLead(lead.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                            <span className="text-sm text-gray-500">{lead.username}</span>
                            <Badge 
                              variant="outline"
                              className={
                                lead.status === 'new' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                                lead.status === 'in_progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                lead.status === 'converted' ? 'bg-green-100 text-green-800 border-green-200' :
                                'bg-red-100 text-red-800 border-red-200'
                              }
                            >
                              {lead.status === 'new' ? '🟢 Novo' : 
                               lead.status === 'in_progress' ? '🟡 Em Andamento' :
                               lead.status === 'converted' ? '🔵 Convertido' : '🔴 Perdido'}
                            </Badge>
                            <Badge 
                              variant="outline"
                              className={
                                lead.priority === 'high' ? 'bg-red-100 text-red-800 border-red-200' :
                                lead.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                'bg-gray-100 text-gray-800 border-gray-200'
                              }
                            >
                              {lead.priority === 'high' ? '🔥 Alta' :
                               lead.priority === 'medium' ? '⚡ Média' : '📝 Baixa'}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-700 leading-relaxed">{lead.message}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                            <span>{lead.timestamp}</span>
                            <Badge variant="outline" className="text-xs">
                              {lead.category}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span>Score: {lead.score}</span>
                            </div>
                            <span>Fonte: {lead.source}</span>
                          </div>
                          
                          <div className="flex gap-1">
                            {lead.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 ml-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">{lead.score}</div>
                            <div className="text-xs text-gray-500">Score IA</div>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={selectedLeads.includes(lead.id)}
                            onChange={() => handleSelectLead(lead.id)}
                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates */}
          <TabsContent value="templates" className="space-y-6">
            {/* Add Template */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Criar Novo Template
                </CardTitle>
                <CardDescription>
                  Crie templates personalizados para diferentes tipos de leads
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="template-name">Nome do Template</Label>
                    <Input 
                      id="template-name"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Resposta Inicial - Marketing"
                    />
                  </div>
                  <div>
                    <Label htmlFor="template-category">Categoria</Label>
                    <Input 
                      id="template-category"
                      value={newTemplate.category}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="Ex: marketing, consultoria"
                    />
                  </div>
                  <div>
                    <Label htmlFor="template-tone">Tom da Mensagem</Label>
                    <Select value={newTemplate.tone} onValueChange={(value: 'professional' | 'casual' | 'sales') => setNewTemplate(prev => ({ ...prev, tone: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Profissional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="sales">Vendedor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="template-content">Conteúdo do Template</Label>
                  <Textarea 
                    id="template-content"
                    value={newTemplate.content}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Use {nome} para personalizar. Ex: Olá {nome}! Obrigado pelo interesse..."
                    rows={4}
                  />
                </div>
                <Button 
                  onClick={addTemplate}
                  disabled={!newTemplate.name || !newTemplate.content}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Criar Template
                </Button>
              </CardContent>
            </Card>

            {/* Templates List */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Templates Salvos</CardTitle>
                <CardDescription>
                  {templates.length} templates disponíveis para uso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map(template => (
                    <Card key={template.id} className="border-2 border-gray-200 hover:border-purple-300 transition-all duration-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              {template.category}
                            </Badge>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {template.tone}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-gray-700 text-sm mb-4 leading-relaxed">{template.content}</p>
                        {template.autoTrigger && template.autoTrigger.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-2">Gatilhos automáticos:</p>
                            <div className="flex gap-1 flex-wrap">
                              {template.autoTrigger.map(trigger => (
                                <Badge key={trigger} variant="secondary" className="text-xs">
                                  {trigger}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 hover:bg-purple-50">
                            <Eye className="h-4 w-4 mr-1" />
                            Visualizar
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 hover:bg-purple-50">
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Automation */}
          <TabsContent value="automation" className="space-y-6">
            {/* Auto Response Settings */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Respostas Automáticas com IA
                </CardTitle>
                <CardDescription>
                  Configure respostas automáticas baseadas em palavras-chave
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="auto-trigger">Palavra-chave</Label>
                    <Input 
                      id="auto-trigger"
                      value={newAutoResponse.trigger}
                      onChange={(e) => setNewAutoResponse(prev => ({ ...prev, trigger: e.target.value }))}
                      placeholder="Ex: preço, whatsapp, comprar"
                    />
                  </div>
                  <div>
                    <Label htmlFor="auto-category">Categoria</Label>
                    <Input 
                      id="auto-category"
                      value={newAutoResponse.category}
                      onChange={(e) => setNewAutoResponse(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="Ex: pricing, contact"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={addAutoResponse}
                      disabled={!newAutoResponse.trigger || !newAutoResponse.response}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Adicionar
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="auto-response">Resposta Automática</Label>
                  <Textarea 
                    id="auto-response"
                    value={newAutoResponse.response}
                    onChange={(e) => setNewAutoResponse(prev => ({ ...prev, response: e.target.value }))}
                    placeholder="Resposta que será enviada automaticamente..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Auto Responses List */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Respostas Automáticas Ativas</CardTitle>
                <CardDescription>
                  {autoResponses.filter(ar => ar.active).length} respostas automáticas configuradas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {autoResponses.map(autoResponse => (
                    <div key={autoResponse.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="bg-purple-50 text-purple-700">
                            {autoResponse.trigger}
                          </Badge>
                          <Badge variant="secondary">
                            {autoResponse.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700">{autoResponse.response}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Switch 
                          checked={autoResponse.active}
                          onCheckedChange={(checked) => {
                            setAutoResponses(prev => prev.map(ar => 
                              ar.id === autoResponse.id ? { ...ar, active: checked } : ar
                            ))
                          }}
                        />
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Settings */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Configurações de IA
                </CardTitle>
                <CardDescription>
                  Configure como a IA analisa e pontua seus leads
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Score automático de leads</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Detecção de intenção de compra</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Categorização automática</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Sugestão de templates</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Palavras-chave de alta intenção</Label>
                      <Input placeholder="comprar, contratar, agendar, orçamento" />
                    </div>
                    <div>
                      <Label>Tempo para resposta automática</Label>
                      <Select defaultValue="immediate">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Imediato</SelectItem>
                          <SelectItem value="5min">5 minutos</SelectItem>
                          <SelectItem value="15min">15 minutos</SelectItem>
                          <SelectItem value="1hour">1 hora</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Integrações Disponíveis
                </CardTitle>
                <CardDescription>
                  Conecte suas ferramentas favoritas para automatizar seu fluxo de trabalho
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {integrations.map(integration => (
                    <Card key={integration.id} className="border-2 border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              integration.type === 'whatsapp' ? 'bg-green-100' :
                              integration.type === 'sheets' ? 'bg-blue-100' :
                              integration.type === 'email' ? 'bg-purple-100' : 'bg-gray-100'
                            }`}>
                              {integration.type === 'whatsapp' ? <Smartphone className="h-6 w-6 text-green-600" /> :
                               integration.type === 'sheets' ? <FileText className="h-6 w-6 text-blue-600" /> :
                               integration.type === 'email' ? <Mail className="h-6 w-6 text-purple-600" /> :
                               <Globe className="h-6 w-6 text-gray-600" />}
                            </div>
                            <div>
                              <h3 className="font-semibold">{integration.name}</h3>
                              <p className="text-sm text-gray-600">
                                {integration.type === 'whatsapp' ? 'Encaminhe leads direto para WhatsApp' :
                                 integration.type === 'sheets' ? 'Exporte dados para planilhas' :
                                 integration.type === 'email' ? 'Integre com email marketing' :
                                 'Conecte com CRM'}
                              </p>
                            </div>
                          </div>
                          <Badge 
                            variant={integration.status === 'connected' ? 'default' : 'secondary'}
                            className={integration.status === 'connected' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {integration.status === 'connected' ? 'Conectado' : 'Desconectado'}
                          </Badge>
                        </div>
                        <Button 
                          variant={integration.status === 'connected' ? 'outline' : 'default'}
                          className={integration.status === 'disconnected' ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' : ''}
                          size="sm"
                        >
                          {integration.status === 'connected' ? 'Configurar' : 'Conectar'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            {/* Account Settings */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configurações da Conta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Nome</Label>
                      <Input defaultValue={currentUser?.name} />
                    </div>
                    <div>
                      <Label>E-mail</Label>
                      <Input defaultValue={currentUser?.email} />
                    </div>
                    <div>
                      <Label>Idioma</Label>
                      <Select defaultValue="pt">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt">Português</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Plano Atual</Label>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">
                          {currentUser?.plan.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          Expira em {currentUser?.subscription.expiresAt}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label>Contas TikTok Conectadas</Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 rounded border">
                          <span>@meucanal</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Ativo
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Conta
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Assinatura e Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                  <div>
                    <h3 className="font-semibold">Plano Premium</h3>
                    <p className="text-sm text-gray-600">R$ 97/mês • Renovação automática</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-800 mb-2">
                      Ativo
                    </Badge>
                    <p className="text-sm text-gray-600">Próxima cobrança: 15/02/2024</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    Alterar Plano
                  </Button>
                  <Button variant="outline">
                    Histórico de Pagamentos
                  </Button>
                  <Button variant="outline">
                    Cancelar Assinatura
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notifications Settings */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Novos leads</Label>
                      <p className="text-sm text-gray-600">Receba notificação quando um novo lead chegar</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Palavras-chave importantes</Label>
                      <p className="text-sm text-gray-600">Alerta quando lead mencionar "comprar", "contratar", etc.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Relatórios diários</Label>
                      <p className="text-sm text-gray-600">Resumo diário por e-mail</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Follow-up automático</Label>
                      <p className="text-sm text-gray-600">Lembrete para recontatar leads</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}