import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, name, teamName, role, inviterName } = body

    if (!email) {
      return NextResponse.json({ error: "Email address is required" }, { status: 400 })
    }

    // Configure Nodemailer Transport
    // Uses environment variables if set, or Ethereal SMTP test account fallback
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com"
    const smtpPort = parseInt(process.env.SMTP_PORT || "587")
    const smtpUser = process.env.SMTP_USER || ""
    const smtpPass = process.env.SMTP_PASS || ""
    const fromEmail = process.env.SMTP_FROM || `"ImpactIQ Security" <noreply@impactiq.dev>`

    let transporter: nodemailer.Transporter

    if (smtpUser && smtpPass) {
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })
    } else {
      // Create Ethereal test SMTP transporter for instant testing
      const testAccount = await nodemailer.createTestAccount()
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      })
    }

    const inviteLink = `http://localhost:3000/dashboard/team?action=accept&email=${encodeURIComponent(email)}`

    // Compose HTML Email Content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 30px; }
          .container { max-width: 560px; background: #ffffff; border-radius: 16px; margin: 0 auto; padding: 32px; border: 1px solid #e2e8f0; shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .logo-badge { display: inline-flex; align-items: center; justify-center; width: 44px; height: 44px; background: #4f46e5; border-radius: 12px; color: white; font-weight: bold; font-size: 20px; text-align: center; line-height: 44px; margin-bottom: 20px; }
          h2 { color: #0f172a; margin-top: 0; font-size: 20px; font-weight: 700; }
          p { color: #475569; font-size: 14px; line-height: 1.6; }
          .role-box { background: #f1f5f9; border-radius: 8px; padding: 12px 16px; margin: 20px 0; border-left: 4px solid #4f46e5; }
          .role-title { font-weight: bold; color: #1e293b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
          .role-desc { color: #64748b; font-size: 13px; margin-top: 4px; }
          .btn { display: inline-block; background: #4f46e5; color: #ffffff !important; font-weight: bold; font-size: 14px; text-decoration: none; padding: 12px 28px; border-radius: 10px; margin-top: 15px; text-align: center; }
          .footer { margin-top: 30px; border-t: 1px solid #f1f5f9; pt: 16px; font-size: 11px; color: #94a3b8; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo-badge">🛡️</div>
          <h2>You've been invited to join ${teamName || "Engineering Team"}</h2>
          <p>Hi <strong>${name || email.split("@")[0]}</strong>,</p>
          <p><strong>${inviterName || "Riyan Shah"}</strong> has invited you to join the <strong>${teamName || "Platform Engineering"}</strong> team on <strong>ImpactIQ</strong> — AI-Powered Cloud-Native Deployment & Engineering Analysis Platform.</p>
          
          <div class="role-box">
            <div class="role-title">Assigned RBAC Role: ${role || "Developer"}</div>
            <div class="role-desc">You will have access to pull request risk reports, deployment checklists, and analysis metrics for this team.</div>
          </div>

          <a href="${inviteLink}" class="btn" target="_blank">Accept Invitation &amp; Join Team</a>

          <p style="margin-top: 25px; font-size: 12px; color: #94a3b8;">If you did not expect this invitation, you can safely ignore this email.</p>
          
          <div class="footer">
            &copy; 2026 ImpactIQ Platform. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `

    const info = await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: `🛡️ Invitation to join ${teamName || "Engineering Team"} on ImpactIQ`,
      text: `Hi ${name || email}, ${inviterName || "Riyan Shah"} has invited you to join the ${teamName || "Platform Engineering"} team on ImpactIQ as a ${role || "Developer"}. Join here: ${inviteLink}`,
      html: htmlContent,
    })

    const previewUrl = nodemailer.getTestMessageUrl(info)

    return NextResponse.json({
      success: true,
      message: `Invitation email sent successfully to ${email}!`,
      messageId: info.messageId,
      previewUrl: previewUrl || null
    })

  } catch (error: any) {
    console.error("Nodemailer error sending invite email:", error)
    return NextResponse.json(
      { error: error.message || "Failed to send invitation email via Nodemailer" },
      { status: 500 }
    )
  }
}
