import knex, { type Knex } from 'knex';

type PublishedNote = {
  id: string,
  content: string,
  author: string,
  client_id: string,
  modified: string,
}

const k: Knex = knex({
  client: 'pg',
  connection: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
  },
})

const table = 'published'

function decode(str: string) {
  return Buffer.from(str, 'base64url').toString('utf8');
}

export async function GET(req: Request) {
  return await getById(req);
}

async function getById(req) {
  const params = new URL(req.url).searchParams;
  const id = params.get('id');

  if (!id) {
    return new Response('ID is empty', {
      status: 400,
    })
  }

  const note = await getNote(id)

  if (!note) {
    return new Response('Note not found', {
      status: 404,
    })
  }

  return new Response(JSON.stringify({
    content: decode(note.content),
    clientId: note.client_id
  }), {
    status: 200, statusText: "Returning note",
  })
}

async function getNote(id: string): Promise<PublishedNote> {
  return (await k<PublishedNote>(table)
    .select()
    .where('id', id)
    .first())
}