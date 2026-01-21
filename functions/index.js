const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Resend } = require('resend');

admin.initializeApp();

// Resend client (initialized lazily)
let resend = null;
function getResend() {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

// Email recipient from environment
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL;

// Send email helper
async function sendNotificationEmail(subject, htmlContent) {
  const client = getResend();
  if (!client) {
    console.error('Resend API key not configured');
    return;
  }
  if (!process.env.NOTIFY_EMAIL) {
    console.error('No notification email configured');
    return;
  }

  try {
    await client.emails.send({
      from: 'Local 478 Ideas <onboarding@resend.dev>',
      to: process.env.NOTIFY_EMAIL,
      subject: subject,
      html: htmlContent
    });
    console.log('Notification email sent:', subject);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

// Trigger when a new idea is created
exports.onNewIdea = functions.firestore
  .document('ideas/{ideaId}')
  .onCreate(async (snap, context) => {
    const idea = snap.data();
    const ideaId = context.params.ideaId;

    const subject = `New Idea: ${idea.title}`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">New Idea Submitted</h2>
        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 16px 0;">
          <h3 style="margin: 0 0 8px 0; color: #1e293b;">${idea.title}</h3>
          <p style="margin: 0; color: #475569;">${idea.description || 'No description provided'}</p>
        </div>
        <p style="color: #64748b; font-size: 14px;">
          Category: ${idea.category || 'Uncategorized'}<br>
          Submitted: ${new Date(idea.createdAt).toLocaleString()}
        </p>
        <a href="https://forgonetokens.github.io/local478-ideas/" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">View Ideas Pipeline</a>
      </div>
    `;

    await sendNotificationEmail(subject, html);
  });

// Trigger when a note is added to an idea
exports.onNewNote = functions.firestore
  .document('ideas/{ideaId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    const beforeNotes = before.notes || [];
    const afterNotes = after.notes || [];

    // Check if a new note was added
    if (afterNotes.length > beforeNotes.length) {
      const newNote = afterNotes[afterNotes.length - 1];

      const subject = `New Note on: ${after.title}`;
      const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8b5cf6;">New Note Added</h2>
          <p style="color: #64748b;">A note was added to the idea "<strong>${after.title}</strong>"</p>
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #8b5cf6;">
            <p style="margin: 0; color: #1e293b;">${newNote.text}</p>
            <p style="margin: 8px 0 0 0; color: #64748b; font-size: 12px;">${new Date(newNote.createdAt).toLocaleString()}</p>
          </div>
          <a href="https://forgonetokens.github.io/local478-ideas/" style="display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">View Ideas Pipeline</a>
        </div>
      `;

      await sendNotificationEmail(subject, html);
    }
  });

// Trigger when a new bug report is submitted
exports.onNewBug = functions.firestore
  .document('bugs/{bugId}')
  .onCreate(async (snap, context) => {
    const bug = snap.data();

    const subject = `Bug Report: ${bug.description.substring(0, 50)}...`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ef4444;">New Bug Report</h2>
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #ef4444;">
          <p style="margin: 0; color: #1e293b;">${bug.description}</p>
        </div>
        <p style="color: #64748b; font-size: 14px;">
          ${bug.contact ? `Contact: ${bug.contact}<br>` : ''}
          Submitted: ${new Date(bug.createdAt).toLocaleString()}<br>
          User Agent: <code style="font-size: 11px;">${bug.userAgent?.substring(0, 100) || 'Unknown'}</code>
        </p>
        <a href="https://forgonetokens.github.io/local478-ideas/" style="display: inline-block; background: #ef4444; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">View Bug Reports</a>
      </div>
    `;

    await sendNotificationEmail(subject, html);
  });
