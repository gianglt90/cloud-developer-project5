import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Loader,
  Image
} from 'semantic-ui-react'

import { createNote, getNotes } from '../api/notes-api'
import Auth from '../auth/Auth'
import { Note } from '../types/Note'

interface NotesProps {
  auth: Auth
  history: History
}

interface NotesState {
  notes: Note[]
  note: string
  newNoteName: string
  loadingNotes: boolean
}

export class Notes extends React.PureComponent<NotesProps, NotesState> {
  state: NotesState = {
    notes: [],
    note: "",
    newNoteName: '',
    loadingNotes: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newNoteName: event.target.value })
  }

  handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ note: event.target.value})
  }

  onEditButtonClick = (noteId: string, noteName: string, note: string) => {
    const enote: { [key: string]: string | string } = {};
    enote.name = noteName;
    enote.note = note;
    this.props.history.push(`/notes/${noteId}/edit`, enote)
  }

  onNoteCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newNote = await createNote(this.props.auth.getIdToken(), {
        name: this.state.newNoteName,
        note: this.state.note
      })
      this.setState({
        notes: [...this.state.notes, newNote],
        newNoteName: ''
      })
    } catch {
      alert('Note creation failed! The note content should be greater than 100 characters')
    }
  }

  async componentDidMount() {
    try {
      const notes = await getNotes(this.props.auth.getIdToken())
      this.setState({
        notes,
        loadingNotes: false
      })
    } catch (e) {
      alert(`Failed to fetch notes: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">NOTEs</Header>

        {this.renderCreateNoteInput()}

        {this.renderNotes()}
      </div>
    )
  }

  renderCreateNoteInput() {
    return (
      <Grid.Row>
        <Grid.Column width={10}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Notes',
              onClick: this.onNoteCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Note title"
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
        <Input
            fluid
            actionPosition="left"
            placeholder="Note content"
            onChange={this.handleNoteChange}
          />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderNotes() {
    if (this.state.loadingNotes) {
      return this.renderLoading()
    }

    return this.renderNotesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading NOTEs
        </Loader>
      </Grid.Row>
    )
  }

  renderNotesList() {
    return (
      <Grid padded>
        {this.state.notes.map((note, pos) => {
          return (
            <Grid.Row key={note.noteId}>
              <Grid.Column width={10} verticalAlign="middle">
                <b>{note.name}</b>
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {note.note}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(note.noteId, note.name, note.note)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>              
              <Grid.Column width={16}>
              <Image src={note.attachmentUrl} size="small" wrapped />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
