'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import {
  Sparkles, X, Send, Loader2, MessageCircle, Phone, Mail,
  Bot, ShieldCheck, BadgePercent, RotateCcw, Ticket,
} from 'lucide-react'

const SUGGESTIONS = [
  { icon: Ticket, label: 'My booking status', prompt: 'How do I check my booking status?' },
  { icon: RotateCcw, label: 'Cancel & refund', prompt: 'How do I cancel my ticket and get a refund?' },
  { icon: BadgePercent, label: 'Offers', prompt: 'What offers are currently available?' },
  { icon: ShieldCheck, label: 'Insurance', prompt: 'What does bus travel insurance cover?' },
]

function renderText(text: string) {
  const blocks = text.split(/\n{2,}/).map(b => b.trim()).filter(Boolean)
  if (blocks.length === 0) return null
  return (
    <div className="space-y-2.5">
      {blocks.map((block, i) => {
        if (/^\s*[-•*]/.test(block)) {
          const items = block.split(/\n/).map(l => l.trim()).filter(l => /^[-•*]/.test(l))
          return (
            <ul key={i} className="list-disc pl-4 space-y-1">
              {items.map((it, j) => (
                <li key={j}>{it.replace(/^[-•*]\s*/, '')}</li>
              ))}
            </ul>
          )
        }
        const numbered = block.split(/\n/).filter(l => /^\d+\./.test(l.trim()))
        if (numbered.length > 1) {
          return (
            <ol key={i} className="list-decimal pl-4 space-y-1">
              {numbered.map((l, j) => <li key={j}>{l.replace(/^\d+\.\s*/, '')}</li>)}
            </ol>
          )
        }
        return <p key={i}>{block}</p>
      })}
    </div>
  )
}

export default function AIWidget() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close GoSafe Assistant' : 'Open GoSafe Assistant'}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full shadow-lg transition-all duration-300 ${
          open
            ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 scale-90'
            : 'bg-gradient-to-br from-blue-700 to-indigo-900 text-white hover:scale-105 hover:shadow-xl'
        }`}
      >
        {open ? (
          <X className="w-6 h-6 m-2.5" />
        ) : (
          <span className="flex items-center gap-2 px-4 py-3">
            <Bot className="w-5 h-5" />
            <span className="text-sm font-semibold hidden sm:inline">GoSafe Assistant</span>
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[28rem] max-h-[70vh] flex flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl animate-fade-in">
          <ChatPanel onClose={() => setOpen(false)} />
        </div>
      )}
    </>
  )
}

export function ChatPanel({ onClose }: { onClose?: () => void }) {
  const [input, setInput] = useState('')
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  const busy = status !== 'ready' && status !== 'error'

  const loadHistory = useCallback(() => {
    fetch('/api/chat')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.messages) && data.messages.length > 0) {
          setMessages(data.messages)
        }
      })
      .catch(() => { /* ignore */ })
      .finally(() => setHistoryLoaded(true))
  }, [setMessages])

  useEffect(() => {
    if (!historyLoaded) void loadHistory()
  }, [historyLoaded, loadHistory])
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, status])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function submit(text: string) {
    const value = text.trim()
    if (!value || busy) return
    setInput('')
    void sendMessage({ text: value })
  }

  const lastMessage = messages[messages.length - 1]
  const streaming = lastMessage?.role === 'assistant' && lastMessage.parts?.some(p => p.type === 'text' && p.state === 'streaming')

  return (
    <>
      {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-900 px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm flex items-center gap-1.5">
                  GoSafe Assistant
                  <span className="text-[9px] font-semibold bg-emerald-400/90 text-emerald-950 rounded-full px-1.5 py-0.5">ONLINE</span>
                </p>
                <p className="text-[11px] text-blue-200 truncate">24×7 support · booking, refunds, tickets</p>
              </div>
              <button
                onClick={() => onClose?.()}
                aria-label="Close"
                className="ml-auto w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 space-y-3 bg-gray-50 dark:bg-gray-950/50">
            {(messages.length === 0 && status !== 'streaming') && (
              <div className="text-center pt-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Hi, how can I help?</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[20rem] mx-auto">
                  Ask about booking, cancellation, refunds, seat selection, offers, or your ticket status.
                </p>
              </div>
            )}

            {messages.map(m => (
              <div
                key={m.id}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-md shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {m.role === 'assistant' ? (
                      <Bot className="w-3.5 h-3.5 text-blue-500" />
                    ) : null}
                    <span className="text-[10px] font-semibold uppercase tracking-wide opacity-60">
                      {m.role === 'user' ? 'You' : 'GoSafe Assistant'}
                    </span>
                  </div>
                  {m.role === 'assistant' && m.parts?.some(p => p.type === 'tool-invocation') ? (
                    <div className="space-y-1 mb-2">
                      {m.parts.filter(p => p.type === 'tool-invocation').map((p, i) => {
                        const inv = (p as unknown as { toolInvocation: { toolName: string; state: string } }).toolInvocation
                        return (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] text-blue-600 dark:text-blue-400">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            {inv.state === 'result' ? 'Done' : 'Working'} · {inv.toolName.replace(/_/g, ' ')}
                          </div>
                        )
                      })}
                    </div>
                  ) : null}
                  {m.parts?.map((part, i) => {
                    if (part.type === 'text') {
                      return <div key={i}>{renderText(part.text)}</div>
                    }
                    return null
                  })}
                  {m.role === 'assistant' && streaming && (
                    <span className="inline-flex gap-0.5 ml-0.5">
                      <span className="w-1 h-1 rounded-full bg-current animate-bounce" />
                      <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:100ms]" />
                      <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:200ms]" />
                    </span>
                  )}
                </div>
              </div>
            ))}

            {error && (
              <div className="flex justify-center">
                <p className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg px-3 py-2">
                  Something went wrong. Please try again.
                </p>
              </div>
            )}
          </div>

          {/* Suggestions (only when empty) */}
          {messages.length === 0 && !busy && (
            <div className="px-4 pb-2 grid grid-cols-2 gap-2">
              {SUGGESTIONS.map(s => {
                const Icon = s.icon
                return (
                  <button
                    key={s.label}
                    onClick={() => submit(s.prompt)}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors text-left"
                  >
                    <Icon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    {s.label}
                  </button>
                )
              })}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-100 dark:border-gray-800 p-3 bg-white dark:bg-gray-900">
            <div className="flex items-end gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') submit(input)
                }}
                placeholder="Type your question…"
                disabled={busy}
                className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
                aria-label="Message GoSafe Assistant"
              />
              <button
                onClick={() => submit(input)}
                disabled={busy || !input.trim()}
                aria-label="Send message"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shrink-0"
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center justify-center gap-3 mt-2.5 text-[10px] text-gray-400 dark:text-gray-500">
              <a href="tel:+918000123456" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                <Phone className="w-3 h-3" /> Call
              </a>
              <a href="https://wa.me/918000123456" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                <MessageCircle className="w-3 h-3" /> WhatsApp
              </a>
              <a href="mailto:support@gosafe.in" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                <Mail className="w-3 h-3" /> Email
              </a>
            </div>
          </div>
    </>
  )
}