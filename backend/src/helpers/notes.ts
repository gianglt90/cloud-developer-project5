import { NotesAccess } from './notesAcess'
import { NoteItem } from '../models/NoteItem'
import { NoteUpdate } from '../models/NoteUpdate'
import { CreateRequest } from '../requests/CreateRequest'
import { UpdateNoteRequest } from '../requests/UpdateNoteRequest'
import * as uuid from 'uuid'
// Note: Implement businessLogic

  
  const NoteAccess = new NotesAccess();
  export async function getAllNotes(userId: string): Promise<NoteItem[]> {
    return NoteAccess.getAllNotes(userId);
  }
  
  export async function createNote(userId: string, createNoteRequest: CreateRequest): Promise<NoteItem> {
  
    const itemId = uuid.v4()
  
    return await NoteAccess.createNote({
      noteId: itemId,
      userId: userId,
      name: createNoteRequest.name,
      note: createNoteRequest.note
    })
  }
  
  export async function updateNote(NoteId: string, userId: string, updateNoteRequest: UpdateNoteRequest): Promise<NoteUpdate> {
    return await NoteAccess.updateNote(NoteId, userId, {
      name: updateNoteRequest.name,
      note: updateNoteRequest.note
    })
  }
