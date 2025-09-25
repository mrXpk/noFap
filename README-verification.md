# NoFap Email Verification Landing Page

This repository hosts the email verification success page for the NoFap mobile app.

## Purpose

When users create an account in the NoFap app, they receive an email verification link. Instead of showing a broken localhost page, this hosted page provides:

- ✅ Clear confirmation that verification was successful
- 🎨 Branded design matching the app's sacred theme
- 📱 Instructions to return to the mobile app
- 🔗 Attempt to deep-link back to the app

## Setup Instructions

1. **Host this page**: Upload `verification-success.html` to any web hosting service
2. **Get the URL**: Copy the public URL where the page is hosted
3. **Update Supabase**: Configure the email redirect URL in your Supabase dashboard
4. **Test**: Create a test account to verify the flow works

## Hosting Options

- **GitHub Pages**: Free and easy (recommended)
- **Netlify**: Free with instant deploy
- **Vercel**: Free for static sites
- **Your own hosting**: Any web server

## Configuration

Update the `emailRedirectTo` URL in your app's AuthContext to point to your hosted page.

```typescript
emailRedirectTo: 'https://yourdomain.com/verification-success.html'
```

## Customization

You can customize the page by editing:
- Colors to match your branding
- Text content and instructions
- Logo and icons
- Deep-link URL scheme