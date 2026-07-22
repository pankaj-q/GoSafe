import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/password'

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password } = await req.json()

    if (!name?.trim() || !phone?.trim() || !password?.trim()) {
      return NextResponse.json({ error: 'Name, phone, and password are required' }, { status: 400 })
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ phone }, ...(email ? [{ email }] : [])] },
    })
    if (existing) {
      return NextResponse.json({ error: 'Phone or email already registered' }, { status: 409 })
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email?.trim() || null,
        phone,
        password: hashPassword(password),
      },
      select: { id: true, name: true, email: true, phone: true },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }
}
