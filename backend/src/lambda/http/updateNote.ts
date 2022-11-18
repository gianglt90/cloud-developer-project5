import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateNote } from '../../helpers/notes'
import { UpdateNoteRequest } from '../../requests/UpdateNoteRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const noteId = event.pathParameters.noteId
    const updatedNote: UpdateNoteRequest = JSON.parse(event.body)
    // TODO: Update a TODO item with the provided id using values in the "updatedNote" object
    let userId = getUserId(event)
    let updatedNoteItem = await updateNote(noteId, userId, updatedNote);

    return {
      statusCode: 200,
      body: JSON.stringify({
        updatedNoteItem
      })
    };
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )