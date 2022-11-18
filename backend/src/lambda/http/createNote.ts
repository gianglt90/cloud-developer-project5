import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateRequest } from '../../requests/CreateRequest'
import { getUserId } from '../utils';
import { createNote } from '../../helpers/notes'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newNote: CreateRequest = JSON.parse(event.body)
    let userId = getUserId(event)
    const { name, noteId, note } = await createNote(userId, newNote)
    return {
      statusCode: 201,
      body: JSON.stringify({
        item: {name, noteId, note }
      })
    };
  }
)

handler.use(
  cors({
    credentials: true
  })
)