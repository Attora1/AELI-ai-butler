import type { Context, Config } from "@netlify/functions";
import { google } from 'googleapis';

interface DriveFile {
  id?: string;
  name?: string;
  mimeType?: string;
  modifiedTime?: string;
  webViewLink?: string;
  parents?: string[];
}

export default async (req: Request, context: Context) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers });
  }

  try {
    const { method } = req;
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    // Initialize Google OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      Netlify.env.GOOGLE_CLIENT_ID,
      Netlify.env.GOOGLE_CLIENT_SECRET,
      `${url.origin}/api/google-drive/callback`
    );

    switch (action) {
      case 'auth-url':
        // Generate OAuth URL for user authorization
        const authUrl = oauth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: [
            'https://www.googleapis.com/auth/drive.readonly',
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/documents.readonly'
          ],
          prompt: 'consent'
        });
        
        return new Response(JSON.stringify({ authUrl }), {
          status: 200,
          headers
        });

      case 'files':
        // Get Drive files
        if (method !== 'POST') {
          return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers
          });
        }

        const { access_token, refresh_token, query, fileType } = await req.json();
        if (!access_token) {
          return new Response(JSON.stringify({ error: 'Access token required' }), {
            status: 400,
            headers
          });
        }

        oauth2Client.setCredentials({
          access_token,
          refresh_token
        });

        const drive = google.drive({ version: 'v3', auth: oauth2Client });
        
        // Build search query
        let searchQuery = '';
        if (query) {
          searchQuery += `name contains '${query}'`;
        }
        
        if (fileType) {
          const mimeTypes = {
            'docs': 'application/vnd.google-apps.document',
            'sheets': 'application/vnd.google-apps.spreadsheet',
            'slides': 'application/vnd.google-apps.presentation',
            'folders': 'application/vnd.google-apps.folder'
          };
          
          if (mimeTypes[fileType]) {
            if (searchQuery) searchQuery += ' and ';
            searchQuery += `mimeType='${mimeTypes[fileType]}'`;
          }
        }

        const filesResponse = await drive.files.list({
          q: searchQuery || undefined,
          pageSize: 20,
          fields: 'nextPageToken, files(id, name, mimeType, modifiedTime, webViewLink, parents)',
          orderBy: 'modifiedTime desc'
        });

        const files: DriveFile[] = filesResponse.data.files || [];
        
        return new Response(JSON.stringify({
          files: files.map(file => ({
            id: file.id,
            name: file.name,
            mimeType: file.mimeType,
            modifiedTime: file.modifiedTime,
            webViewLink: file.webViewLink,
            parents: file.parents
          }))
        }), {
          status: 200,
          headers
        });

      case 'recent-docs':
        // Get recent Google Docs specifically
        if (method !== 'POST') {
          return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers
          });
        }

        const { access_token: recentToken, refresh_token: recentRefresh } = await req.json();
        if (!recentToken) {
          return new Response(JSON.stringify({ error: 'Access token required' }), {
            status: 400,
            headers
          });
        }

        oauth2Client.setCredentials({
          access_token: recentToken,
          refresh_token: recentRefresh
        });

        const driveRecent = google.drive({ version: 'v3', auth: oauth2Client });
        
        const recentDocsResponse = await driveRecent.files.list({
          q: "mimeType='application/vnd.google-apps.document' or mimeType='application/vnd.google-apps.spreadsheet'",
          pageSize: 10,
          fields: 'files(id, name, mimeType, modifiedTime, webViewLink)',
          orderBy: 'modifiedTime desc'
        });

        return new Response(JSON.stringify({
          recentDocs: recentDocsResponse.data.files || []
        }), {
          status: 200,
          headers
        });

      case 'create-doc':
        // Create a new Google Doc
        if (method !== 'POST') {
          return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers
          });
        }

        const body = await req.json();
        const { access_token: createToken, refresh_token: createRefresh, title, content } = body;
        
        if (!createToken || !title) {
          return new Response(JSON.stringify({ error: 'Access token and title required' }), {
            status: 400,
            headers
          });
        }

        oauth2Client.setCredentials({
          access_token: createToken,
          refresh_token: createRefresh
        });

        const driveCreate = google.drive({ version: 'v3', auth: oauth2Client });
        
        // Create the document
        const newDoc = await driveCreate.files.create({
          requestBody: {
            name: title,
            mimeType: 'application/vnd.google-apps.document'
          }
        });

        // If content is provided, add it to the document
        if (content && newDoc.data.id) {
          const docs = google.docs({ version: 'v1', auth: oauth2Client });
          await docs.documents.batchUpdate({
            documentId: newDoc.data.id,
            requestBody: {
              requests: [{
                insertText: {
                  location: { index: 1 },
                  text: content
                }
              }]
            }
          });
        }

        return new Response(JSON.stringify({
          message: 'Document created successfully',
          document: newDoc.data
        }), {
          status: 200,
          headers
        });

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers
        });
    }
  } catch (error) {
    console.error('Google Drive API error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers
    });
  }
};

export const config: Config = {
  path: "/api/google-drive"
};