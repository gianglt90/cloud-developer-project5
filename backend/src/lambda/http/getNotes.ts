import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getAllNotes} from '../../helpers/notes'
import { getUserId } from '../utils';
const logger = createLogger('getNotes')
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    logger.info('start getting note item')
    const userId = getUserId(event)
    const notes = await getAllNotes(userId)
    return {
      statusCode: 200,
      body: JSON.stringify({
        items: notes
      })
    }
  }
);

handler.use(
  cors({
    credentials: true
  })
)
