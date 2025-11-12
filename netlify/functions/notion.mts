import type { Context, Config } from "@netlify/functions";

interface NotionPage {
  id: string;
  title: string;
  created_time: string;
  last_edited_time: string;
  url: string;
}

interface NotionMemory {
  id?: string;
  title: string;
  content: string;
  tags?: string[];
  category?: string;
  importance?: 'low' | 'medium' | 'high';
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

    const notionToken = Netlify.env.NOTION_API_TOKEN;
    const notionDatabaseId = Netlify.env.NOTION_DATABASE_ID;

    if (!notionToken) {
      return new Response(JSON.stringify({ error: 'Notion integration not configured' }), {
        status: 500,
        headers
      });
    }

    const notionHeaders = {
      'Authorization': `Bearer ${notionToken}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    };

    switch (action) {
      case 'setup':
        // Create the AELI Memory Bank database
        if (method !== 'POST') {
          return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers
          });
        }

        const setupResponse = await fetch('https://api.notion.com/v1/databases', {
          method: 'POST',
          headers: notionHeaders,
          body: JSON.stringify({
            parent: {
              type: 'page_id',
              page_id: Netlify.env.NOTION_PARENT_PAGE_ID || ''
            },
            title: [
              {
                type: 'text',
                text: {
                  content: 'AELI Memory Bank'
                }
              }
            ],
            properties: {
              'Title': {
                title: {}
              },
              'Content': {
                rich_text: {}
              },
              'Category': {
                select: {
                  options: [
                    { name: 'Personal', color: 'blue' },
                    { name: 'Work', color: 'green' },
                    { name: 'Health', color: 'red' },
                    { name: 'Ideas', color: 'purple' },
                    { name: 'Tasks', color: 'orange' },
                    { name: 'General', color: 'gray' }
                  ]
                }
              },
              'Importance': {
                select: {
                  options: [
                    { name: 'Low', color: 'gray' },
                    { name: 'Medium', color: 'yellow' },
                    { name: 'High', color: 'red' }
                  ]
                }
              },
              'Tags': {
                multi_select: {
                  options: []
                }
              },
              'Created': {
                created_time: {}
              }
            }
          })
        });

        if (!setupResponse.ok) {
          const error = await setupResponse.json();
          return new Response(JSON.stringify({ error: 'Failed to create database', details: error }), {
            status: setupResponse.status,
            headers
          });
        }

        const newDatabase = await setupResponse.json();
        return new Response(JSON.stringify({
          message: 'AELI Memory Bank database created successfully',
          database_id: newDatabase.id
        }), {
          status: 200,
          headers
        });

      case 'add-memory':
        // Add a new memory to the database
        if (method !== 'POST') {
          return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers
          });
        }

        if (!notionDatabaseId) {
          return new Response(JSON.stringify({ error: 'Notion database not configured' }), {
            status: 500,
            headers
          });
        }

        const { title, content, category, importance, tags } = await req.json();
        
        if (!title || !content) {
          return new Response(JSON.stringify({ error: 'Title and content are required' }), {
            status: 400,
            headers
          });
        }

        const addResponse = await fetch('https://api.notion.com/v1/pages', {
          method: 'POST',
          headers: notionHeaders,
          body: JSON.stringify({
            parent: {
              database_id: notionDatabaseId
            },
            properties: {
              'Title': {
                title: [
                  {
                    text: {
                      content: title
                    }
                  }
                ]
              },
              'Content': {
                rich_text: [
                  {
                    text: {
                      content: content
                    }
                  }
                ]
              },
              'Category': category ? {
                select: {
                  name: category
                }
              } : undefined,
              'Importance': importance ? {
                select: {
                  name: importance.charAt(0).toUpperCase() + importance.slice(1)
                }
              } : undefined,
              'Tags': tags && tags.length > 0 ? {
                multi_select: tags.map((tag: string) => ({ name: tag }))
              } : undefined
            }
          })
        });

        if (!addResponse.ok) {
          const error = await addResponse.json();
          return new Response(JSON.stringify({ error: 'Failed to add memory', details: error }), {
            status: addResponse.status,
            headers
          });
        }

        const newPage = await addResponse.json();
        return new Response(JSON.stringify({
          message: 'Memory added successfully',
          page_id: newPage.id
        }), {
          status: 200,
          headers
        });

      case 'get-memories':
        // Retrieve memories from the database
        if (method !== 'GET') {
          return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers
          });
        }

        if (!notionDatabaseId) {
          return new Response(JSON.stringify({ error: 'Notion database not configured' }), {
            status: 500,
            headers
          });
        }

        const queryParams = url.searchParams;
        const limit = parseInt(queryParams.get('limit') || '10');
        const category = queryParams.get('category');

        let filter = {};
        if (category) {
          filter = {
            property: 'Category',
            select: {
              equals: category
            }
          };
        }

        const getResponse = await fetch(`https://api.notion.com/v1/databases/${notionDatabaseId}/query`, {
          method: 'POST',
          headers: notionHeaders,
          body: JSON.stringify({
            filter: Object.keys(filter).length > 0 ? filter : undefined,
            sorts: [
              {
                property: 'Created',
                direction: 'descending'
              }
            ],
            page_size: limit
          })
        });

        if (!getResponse.ok) {
          const error = await getResponse.json();
          return new Response(JSON.stringify({ error: 'Failed to retrieve memories', details: error }), {
            status: getResponse.status,
            headers
          });
        }

        const queryResult = await getResponse.json();
        const memories = queryResult.results.map((page: any) => ({
          id: page.id,
          title: page.properties.Title?.title?.[0]?.text?.content || 'Untitled',
          content: page.properties.Content?.rich_text?.[0]?.text?.content || '',
          category: page.properties.Category?.select?.name || null,
          importance: page.properties.Importance?.select?.name?.toLowerCase() || null,
          tags: page.properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
          created_time: page.created_time,
          url: page.url
        }));

        return new Response(JSON.stringify({
          memories,
          total: queryResult.results.length
        }), {
          status: 200,
          headers
        });

      case 'search':
        // Search memories
        if (method !== 'GET') {
          return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers
          });
        }

        const searchQuery = url.searchParams.get('q');
        if (!searchQuery) {
          return new Response(JSON.stringify({ error: 'Search query required' }), {
            status: 400,
            headers
          });
        }

        const searchResponse = await fetch('https://api.notion.com/v1/search', {
          method: 'POST',
          headers: notionHeaders,
          body: JSON.stringify({
            query: searchQuery,
            filter: {
              value: 'database',
              property: 'object'
            }
          })
        });

        if (!searchResponse.ok) {
          const error = await searchResponse.json();
          return new Response(JSON.stringify({ error: 'Search failed', details: error }), {
            status: searchResponse.status,
            headers
          });
        }

        const searchResult = await searchResponse.json();
        return new Response(JSON.stringify(searchResult), {
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
    console.error('Notion API error:', error);
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
  path: "/api/notion"
};