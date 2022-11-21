import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { NoteItem } from '../models/NoteItem'
import { NoteUpdate } from '../models/NoteUpdate';
const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('NotesAccess')

export class NotesAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly notesTable = process.env.NOTES_TABLE,
    private readonly noteCreatedIndex = process.env.NOTES_CREATED_AT_INDEX) {
  }

  async getAllNotes(userId: string): Promise<NoteItem[]> {
    console.log('Getting all noteItems ' + userId)

    const result = await this.docClient.query({
      TableName: this.notesTable,
      IndexName: this.noteCreatedIndex,
      KeyConditionExpression: 'userId = :pk',
      ExpressionAttributeValues: {
        ':pk': userId
      }
    }).promise()
    console.log('Getting all noteItems successful')
    const items = result.Items
    return items as NoteItem[]
  }

  async createNote(noteItem: NoteItem): Promise<NoteItem> {
    await this.docClient.put({
      TableName: this.notesTable,
      Item: noteItem
    }).promise()

    return noteItem
  }

  async updateNote(noteId: String, userId: String, updateNoteItem: NoteUpdate): Promise<NoteUpdate> {
    logger.info('Update note')

    await this.docClient.update({
      TableName: this.notesTable,
      Key: {
        noteId: noteId,
        userId: userId
      },
      UpdateExpression: "set #note_name = :name, note = :note",
      ExpressionAttributeNames: {
        '#note_name': 'name',
      },
      ExpressionAttributeValues: {
        ":name": updateNoteItem.name,
        ":note": updateNoteItem.note
      }
    }).promise()

    return updateNoteItem
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}