import { type NextRequest, NextResponse } from "next/server"
import { 
  getUserByUsername, 
  validatePassword, 
  createSession, 
  updateLastLogin 
} from "@/lib/db/user-service"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // 1. Basic input validation
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    // 2. Fetch user from DB
    const user = await getUserByUsername(username)
    if (!user || !user._id) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // ✅ FIX: Match the signature validatePassword(plain, hash)
    // Your service uses 'passwordHash' as the field name
    const isValid = await validatePassword(password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // ✅ FIX: Convert ObjectId to string for service functions
    const userIdStr = user._id.toString()
    
    // 3. Create session and update login timestamp
    const session = await createSession(userIdStr)
    await updateLastLogin(userIdStr)

    // 4. Secure Cookie Configuration
    const cookieStore = await cookies()
    cookieStore.set("session_token", session.token, {
      httpOnly: true, // Prevents XSS access to the token
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "lax", // CSRF protection
      expires: session.expiresAt,
      path: "/",
    })

    // 5. Return safe user data
    return NextResponse.json({
      user: {
        id: userIdStr,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      // Note: Token is in cookie, but returning it here is fine for some client states
      token: session.token, 
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}