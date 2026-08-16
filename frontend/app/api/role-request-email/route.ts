import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
      recipients, 
      requesterName, 
      requesterEmail, 
      projectName, 
      currentRole, 
      requestedRole, 
      reason 
    } = body

    if (!requesterEmail || !projectName || !requestedRole) {
      return NextResponse.json({ error: "Missing required role request details" }, { status: 400 })
    }

    const emailList = Array.isArray(recipients) && recipients.length > 0
      ? recipients.filter(Boolean)
      : ["dev@impactiq.dev"]

    // Configure Nodemailer Transport
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com"
    const smtpPort = parseInt(process.env.SMTP_PORT || "587")
    const smtpUser = process.env.SMTP_USER || ""
    const smtpPass = process.env.SMTP_PASS || ""
    const fromEmail = process.env.SMTP_FROM || `"ImpactIQ Security & Access" <access@impactiq.dev>`

    let transporter: any

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
      // Create Ethereal test SMTP transporter for instant development testing
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

    const reviewLink = `http://localhost:3000/dashboard/settings?tab=project`

    // Compose HTML Email Content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 30px; }
          .container { max-width: 580px; background: #ffffff; border-radius: 16px; margin: 0 auto; padding: 32px; border: 1px solid #e2e8f0; box-shadow: 0 4px 16px rgba(0,0,0,0.05); }
          .logo-badge { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; background: #4f46e5; border-radius: 12px; color: white; font-size: 22px; text-align: center; line-height: 44px; margin-bottom: 20px; }
          h2 { color: #0f172a; margin-top: 0; font-size: 20px; font-weight: 700; }
          p { color: #475569; font-size: 14px; line-height: 1.6; }
          .card { background: #f8fafc; border-radius: 12px; padding: 16px 20px; margin: 20px 0; border: 1px solid #e2e8f0; }
          .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
          .label { color: #64748b; font-weight: 600; }
          .val { color: #0f172a; font-weight: bold; }
          .role-tag { display: inline-block; padding: 3px 8px; border-radius: 6px; font-weight: bold; font-size: 12px; }
          .role-current { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; }
          .role-target { background: #e0e7ff; color: #4338ca; border: 1px solid #c7d2fe; }
          .reason-box { background: #ffffff; border-radius: 8px; padding: 12px; margin-top: 10px; border-left: 3px solid #4f46e5; font-size: 13px; color: #334155; font-style: italic; }
          .btn { display: inline-block; background: #4f46e5; color: #ffffff !important; font-weight: bold; font-size: 14px; text-decoration: none; padding: 12px 28px; border-radius: 10px; margin-top: 15px; text-align: center; }
          .footer { margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 16px; font-size: 11px; color: #94a3b8; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo-badge">🔑</div>
          <h2>Role Change Request for ${projectName}</h2>
          <p>Hello Project Owner &amp; Admins,</p>
          <p><strong>${requesterName || "A team member"}</strong> (<code>${requesterEmail}</code>) has submitted an authorization request to change their role tier on <strong>ImpactIQ</strong>.</p>
          
          <div class="card">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr style="border-bottom: 1px solid #e2e8f0; padding: 6px 0;">
                <td style="color: #64748b; padding: 6px 0;">Project:</td>
                <td style="text-align: right; font-weight: bold; color: #0f172a;">${projectName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="color: #64748b; padding: 6px 0;">Current Tier:</td>
                <td style="text-align: right; font-weight: bold; color: #475569;">${currentRole}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="color: #64748b; padding: 6px 0;">Requested Tier:</td>
                <td style="text-align: right; font-weight: bold; color: #4338ca;">${requestedRole}</td>
              </tr>
            </table>

            ${reason ? `
              <div class="reason-box">
                &ldquo;${reason}&rdquo;
              </div>
            ` : ""}
          </div>

          <p>You can review, approve, or decline this promotion directly from the Project Settings dashboard:</p>

          <a href="${reviewLink}" class="btn" target="_blank">Review &amp; Approve Role Change</a>

          <div class="footer">
            ImpactIQ RBAC Security System &bull; Automated Access Delegation Notification
          </div>
        </div>
      </body>
      </html>
    `

    const info = await transporter.sendMail({
      from: fromEmail,
      to: emailList.join(", "),
      subject: `🔑 Action Required: Role Change Request for ${projectName} (${requesterName} -> ${requestedRole})`,
      text: `Role Change Request: ${requesterName} (${requesterEmail}) requested an upgrade to ${requestedRole} for ${projectName}. Review here: ${reviewLink}`,
      html: htmlContent,
    })

    const previewUrl = nodemailer.getTestMessageUrl(info)

    return NextResponse.json({
      success: true,
      message: `Role request email dispatched to ${emailList.join(", ")}!`,
      messageId: info.messageId,
      previewUrl: previewUrl || null
    })

  } catch (error: any) {
    console.error("Nodemailer error sending role request email:", error)
    return NextResponse.json(
      { error: error.message || "Failed to send role request email via Nodemailer" },
      { status: 500 }
    )
  }
}
