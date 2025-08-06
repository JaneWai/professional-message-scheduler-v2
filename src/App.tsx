import React, { useState } from 'react'
import { Clock, MessageSquare, Mail, Plus, Settings, Calendar, Send, Trash2, Edit3, Brain } from 'lucide-react'
import { MessageAnalysis } from './components/MessageAnalysis'

interface Message {
  id: string
  type: 'whatsapp' | 'email'
  recipient: string
  subject?: string
  content: string
  scheduledTime: string
  timezone: string
  status: 'pending' | 'sent' | 'failed'
  analysisScore?: number
  mentalHealthScore?: number
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'whatsapp',
      recipient: '+1234567890',
      content: 'Good morning! Hope you have a great day ahead.',
      scheduledTime: '2024-01-15T07:00',
      timezone: 'America/New_York',
      status: 'pending',
      analysisScore: 95,
      mentalHealthScore: 90
    },
    {
      id: '2',
      type: 'email',
      recipient: 'colleague@company.com',
      subject: 'Project Update',
      content: 'Hi there, I wanted to share the latest updates on our project...',
      scheduledTime: '2024-01-15T09:00',
      timezone: 'America/New_York',
      status: 'pending',
      analysisScore: 85,
      mentalHealthScore: 80
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingMessage, setEditingMessage] = useState<Message | null>(null)
  const [showAnalysis, setShowAnalysis] = useState(true)

  const [formData, setFormData] = useState({
    type: 'whatsapp' as 'whatsapp' | 'email',
    recipient: '',
    subject: '',
    content: '',
    scheduledTime: '',
    timezone: 'America/New_York'
  })

  const timezones = [
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingMessage) {
      setMessages(messages.map(msg => 
        msg.id === editingMessage.id 
          ? { ...msg, ...formData, id: editingMessage.id, status: 'pending' as const }
          : msg
      ))
      setEditingMessage(null)
    } else {
      const newMessage: Message = {
        id: Date.now().toString(),
        ...formData,
        status: 'pending'
      }
      setMessages([...messages, newMessage])
    }

    setFormData({
      type: 'whatsapp',
      recipient: '',
      subject: '',
      content: '',
      scheduledTime: '',
      timezone: 'America/New_York'
    })
    setShowForm(false)
  }

  const handleEdit = (message: Message) => {
    setFormData({
      type: message.type,
      recipient: message.recipient,
      subject: message.subject || '',
      content: message.content,
      scheduledTime: message.scheduledTime,
      timezone: message.timezone
    })
    setEditingMessage(message)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setMessages(messages.filter(msg => msg.id !== id))
  }

  const handleSuggestionApply = (newContent: string) => {
    setFormData({ ...formData, content: newContent })
  }

  const formatDateTime = (dateTime: string, timezone: string) => {
    const date = new Date(dateTime)
    return date.toLocaleString('en-US', {
      timeZone: timezone,
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const averageAnalysisScore = messages.length > 0 
    ? Math.round(messages.reduce((sum, msg) => sum + (msg.analysisScore || 0), 0) / messages.length)
    : 0

  const averageMentalHealthScore = messages.length > 0
    ? Math.round(messages.reduce((sum, msg) => sum + (msg.mentalHealthScore || 0), 0) / messages.length)
    : 0

  return (
    <div className="min-h-screen bg-gray-200" style={{ backgroundColor: '#E0E5EC' }}>
      {/* Header */}
      <header className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-200 rounded-3xl p-6 shadow-neumorphism">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-200 rounded-2xl p-4 shadow-neumorphism-inset">
                  <Clock className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-700">MessageQueue</h1>
                  <p className="text-gray-500">Schedule messages for the perfect time with AI-powered communication analysis</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowAnalysis(!showAnalysis)}
                  className={`bg-gray-200 rounded-2xl px-4 py-2 shadow-neumorphism hover:shadow-neumorphism-pressed transition-all duration-200 flex items-center space-x-2 text-gray-700 font-medium ${
                    showAnalysis ? 'shadow-neumorphism-pressed' : ''
                  }`}
                >
                  <Brain className="w-4 h-4" />
                  <span>AI Analysis</span>
                </button>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-gray-200 rounded-2xl px-6 py-3 shadow-neumorphism hover:shadow-neumorphism-pressed transition-all duration-200 flex items-center space-x-2 text-gray-700 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  <span>New Message</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 pb-6">
        <div className="max-w-6xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-gray-200 rounded-3xl p-6 shadow-neumorphism">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-200 rounded-xl p-3 shadow-neumorphism-inset">
                  <MessageSquare className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-700">{messages.filter(m => m.type === 'whatsapp').length}</p>
                  <p className="text-gray-500">WhatsApp</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-200 rounded-3xl p-6 shadow-neumorphism">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-200 rounded-xl p-3 shadow-neumorphism-inset">
                  <Mail className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-700">{messages.filter(m => m.type === 'email').length}</p>
                  <p className="text-gray-500">Email</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-200 rounded-3xl p-6 shadow-neumorphism">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-200 rounded-xl p-3 shadow-neumorphism-inset">
                  <Calendar className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-700">{messages.filter(m => m.status === 'pending').length}</p>
                  <p className="text-gray-500">Pending</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-200 rounded-3xl p-6 shadow-neumorphism">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-200 rounded-xl p-3 shadow-neumorphism-inset">
                  <Brain className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-700">{averageAnalysisScore}%</p>
                  <p className="text-gray-500">Respectfulness</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-200 rounded-3xl p-6 shadow-neumorphism">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-200 rounded-xl p-3 shadow-neumorphism-inset">
                  <div className="w-6 h-6 text-pink-500 flex items-center justify-center">❤️</div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-700">{averageMentalHealthScore}%</p>
                  <p className="text-gray-500">Mental Health</p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages List */}
          <div className="bg-gray-200 rounded-3xl p-6 shadow-neumorphism">
            <h2 className="text-xl font-bold text-gray-700 mb-6">Scheduled Messages</h2>
            
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-200 rounded-2xl p-8 shadow-neumorphism-inset inline-block mb-4">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto" />
                </div>
                <p className="text-gray-500 text-lg">No messages scheduled yet</p>
                <p className="text-gray-400">Create your first scheduled message to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="bg-gray-200 rounded-2xl p-6 shadow-neumorphism-inset">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="bg-gray-200 rounded-xl p-3 shadow-neumorphism">
                          {message.type === 'whatsapp' ? (
                            <MessageSquare className="w-5 h-5 text-green-500" />
                          ) : (
                            <Mail className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="font-medium text-gray-700">{message.recipient}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              message.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              message.status === 'sent' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {message.status}
                            </span>
                            {message.analysisScore && (
                              <div className="flex items-center space-x-2">
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  message.analysisScore >= 80 ? 'bg-green-100 text-green-700' :
                                  message.analysisScore >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {message.analysisScore}% respectful
                                </div>
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  (message.mentalHealthScore || 0) >= 80 ? 'bg-green-100 text-green-700' :
                                  (message.mentalHealthScore || 0) >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  ❤️ {message.mentalHealthScore}%
                                </div>
                              </div>
                            )}
                          </div>
                          {message.subject && (
                            <p className="font-medium text-gray-600 mb-1">{message.subject}</p>
                          )}
                          <p className="text-gray-500 mb-3 line-clamp-2">{message.content}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatDateTime(message.scheduledTime, message.timezone)}</span>
                            </span>
                            <span>{message.timezone}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(message)}
                          className="bg-gray-200 rounded-xl p-2 shadow-neumorphism hover:shadow-neumorphism-pressed transition-all duration-200"
                        >
                          <Edit3 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(message.id)}
                          className="bg-gray-200 rounded-xl p-2 shadow-neumorphism hover:shadow-neumorphism-pressed transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-200 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-neumorphism">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-700">
                {editingMessage ? 'Edit Message' : 'Schedule New Message'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingMessage(null)
                  setFormData({
                    type: 'whatsapp',
                    recipient: '',
                    subject: '',
                    content: '',
                    scheduledTime: '',
                    timezone: 'America/New_York'
                  })
                }}
                className="bg-gray-200 rounded-xl p-2 shadow-neumorphism hover:shadow-neumorphism-pressed transition-all duration-200"
              >
                <Plus className="w-5 h-5 text-gray-600 rotate-45" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Message Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Message Type</label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'whatsapp' })}
                      className={`flex-1 bg-gray-200 rounded-2xl p-4 shadow-neumorphism transition-all duration-200 ${
                        formData.type === 'whatsapp' ? 'shadow-neumorphism-pressed' : 'hover:shadow-neumorphism-pressed'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <MessageSquare className="w-5 h-5 text-green-500" />
                        <span className="font-medium text-gray-700">WhatsApp</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'email' })}
                      className={`flex-1 bg-gray-200 rounded-2xl p-4 shadow-neumorphism transition-all duration-200 ${
                        formData.type === 'email' ? 'shadow-neumorphism-pressed' : 'hover:shadow-neumorphism-pressed'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Mail className="w-5 h-5 text-blue-500" />
                        <span className="font-medium text-gray-700">Email</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Recipient */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {formData.type === 'whatsapp' ? 'Phone Number' : 'Email Address'}
                  </label>
                  <input
                    type={formData.type === 'whatsapp' ? 'tel' : 'email'}
                    value={formData.recipient}
                    onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                    placeholder={formData.type === 'whatsapp' ? '+1234567890' : 'recipient@example.com'}
                    className="w-full bg-gray-200 rounded-2xl px-4 py-3 shadow-neumorphism-inset text-gray-700 placeholder-gray-400 focus:outline-none focus:shadow-neumorphism-pressed transition-all duration-200"
                    required
                  />
                </div>

                {/* Subject (Email only) */}
                {formData.type === 'email' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Enter email subject"
                      className="w-full bg-gray-200 rounded-2xl px-4 py-3 shadow-neumorphism-inset text-gray-700 placeholder-gray-400 focus:outline-none focus:shadow-neumorphism-pressed transition-all duration-200"
                    />
                  </div>
                )}

                {/* Message Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Message</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Type your message here..."
                    rows={6}
                    className="w-full bg-gray-200 rounded-2xl px-4 py-3 shadow-neumorphism-inset text-gray-700 placeholder-gray-400 focus:outline-none focus:shadow-neumorphism-pressed transition-all duration-200 resize-none"
                    required
                  />
                </div>

                {/* Scheduled Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Scheduled Time</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full bg-gray-200 rounded-2xl px-4 py-3 shadow-neumorphism-inset text-gray-700 focus:outline-none focus:shadow-neumorphism-pressed transition-all duration-200"
                    required
                  />
                </div>

                {/* Timezone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Timezone</label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full bg-gray-200 rounded-2xl px-4 py-3 shadow-neumorphism-inset text-gray-700 focus:outline-none focus:shadow-neumorphism-pressed transition-all duration-200"
                  >
                    {timezones.map((tz) => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gray-200 rounded-2xl py-4 shadow-neumorphism hover:shadow-neumorphism-pressed transition-all duration-200 flex items-center justify-center space-x-2 text-gray-700 font-medium"
                >
                  <Send className="w-5 h-5" />
                  <span>{editingMessage ? 'Update Message' : 'Schedule Message'}</span>
                </button>
              </form>

              {/* AI Analysis Panel */}
              {showAnalysis && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-700 flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-indigo-500" />
                    <span>AI Communication Analysis</span>
                  </h3>
                  <MessageAnalysis 
                    content={formData.content} 
                    onSuggestionApply={handleSuggestionApply}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
