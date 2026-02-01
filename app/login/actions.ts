"use server"

import { createClient } from "@/lib/supabase/client"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import nodemailer from "nodemailer"
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function signup(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string

    const cookieStore = new Map<string, { value: string; options: CookieOptions }>()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    cookieStore.set(name, { value, options })
                },
                remove(name: string, options: CookieOptions) {
                    cookieStore.set(name, { value: "", options: { ...options, maxAge: 0 } })
                },
            },
        }
    )

    const origin = (await headers()).get("origin")

    // 1. Sign up user
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                display_name: name,
            },
            emailRedirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        return { error: error.message }
    }

    // 2. Send Admin Notification Email
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.BREVO_SMTP_USER,
                pass: process.env.BREVO_SMTP_PASS,
            },
        })

        // Use a default admin email or the sender email itself
        const adminEmail = process.env.ADMIN_EMAIL || "climateactionyouth10@gmail.com"

        await transporter.sendMail({
            from: `"Valentine App" <${process.env.BREVO_SENDER_EMAIL || adminEmail}>`, // sender address
            to: adminEmail, // list of receivers
            subject: "New User Signed Up! 💘", // Subject line
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2>New User Registration</h2>
                    <p>A new user has just signed up for the Valentine app.</p>
                    <ul>
                        <li><strong>Name:</strong> ${name}</li>
                        <li><strong>Email:</strong> ${email}</li>
                        <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
                    </ul>
                </div>
            `,
        })
    } catch (emailError) {
        console.error("Failed to send admin notification:", emailError)
        // We don't want to fail the signup if the email fails, just log it.
    }

    return { success: true }
}
