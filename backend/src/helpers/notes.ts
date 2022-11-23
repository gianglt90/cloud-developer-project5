import { NotesAccess } from './notesAcess'
import { NoteItem } from '../models/NoteItem'
import { NoteUpdate } from '../models/NoteUpdate'
import { CreateRequest } from '../requests/CreateRequest'
import { UpdateNoteRequest } from '../requests/UpdateNoteRequest'
import * as uuid from 'uuid'
import { createLogger } from '../utils/logger'
import { AttachmentUtils } from './attachmentUtils';
import * as AWS from 'aws-sdk'
// Note: Implement businessLogic
const logger = createLogger('Todos business logic')

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})
const attachmentUtils = new AttachmentUtils();
const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

  const noteAccess = new NotesAccess();
  export async function getAllNotes(userId: string): Promise<NoteItem[]> {
    return await noteAccess.getAllNotes(userId);
  }
  
  export async function createNote(userId: string, createNoteRequest: CreateRequest): Promise<NoteItem> {
  
    const itemId = uuid.v4()
  
    return await noteAccess.createNote({
      noteId: itemId,
      userId: userId,
      name: createNoteRequest.name,
      note: createNoteRequest.note
    })
  }
  
  export async function updateNote(NoteId: string, userId: string, updateNoteRequest: UpdateNoteRequest): Promise<NoteUpdate> {
    return await noteAccess.updateNote(NoteId, userId, {
      name: updateNoteRequest.name,
      note: updateNoteRequest.note
    })
  }

  export async function createAttachmentUrl (noteId: string, userId: string) {
    logger.info('create attachment url')
    const timestamp = new Date().toISOString()
    const imageId = uuid.v4()
    const newItem = {
      noteId,
      timestamp,
      imageId,
      imageUrl: `https://${bucketName}.s3.amazonaws.com/${imageId}`
    }
    await attachmentUtils.updateAttachmentUrl(noteId, userId, newItem.imageUrl)
    return getUploadUrl(imageId)
  }
  
  function getUploadUrl(imageId: string) {
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: imageId,
      Expires: parseInt(urlExpiration)
    })
  }
