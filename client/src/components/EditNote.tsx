import * as React from 'react'
import { Form, Button, Input } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { patchNote } from '../api/notes-api'
import { History } from 'history'

interface EditNoteProps {
  match: {
    params: {
      noteId: string
    }
  }
  auth: Auth
  history: History
}

interface EditNoteState {
  enote: { [key: string]: string | string }
  newNoteName: string
  newNote: string
}


export class EditNote extends React.PureComponent<
  EditNoteProps,
  EditNoteState
> {
  state: EditNoteState = {
    enote: this.props.history.location.state as { [key: string]: string | string },
    newNoteName: '',
    newNote: ''
  }


  handleNoteNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enote1: { [key: string]: string | string } = {};
    enote1.note = this.state.enote.note;
    enote1.name = event.target.value;
    this.setState({ enote: enote1 })
    this.setState({ newNoteName: event.target.value })
    this.setState({ newNote: this.state.enote.note })
  }

  handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enote1: { [key: string]: string | string } = {};
    enote1.name = this.state.enote.name;
    enote1.note = event.target.value;
    this.setState({ enote: enote1 })
    this.setState({ newNote: event.target.value })
    this.setState({ newNoteName: this.state.enote.name })
  }

  handleSubmit = async (event: React.SyntheticEvent)  => {

    await patchNote(this.props.auth.getIdToken(), this.props.match.params.noteId, {
      name: this.state.newNoteName,
      note: this.state.newNote
    })
    this.props.history.push(`/`)
  }

  render() {
    return (
      <div>
        <h1>Edit the Note</h1>
        
        <Form onSubmit={this.handleSubmit}>
        <Input
            fluid
            actionPosition="left"
            placeholder="Note name"
            onChange={this.handleNoteNameChange}
            value = {this.state.enote.name}
          />
           <Input
            fluid
            actionPosition="left"
            placeholder="Note content"
            onChange={this.handleNoteChange}
            value = {this.state.enote.note}
          />

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        <Button
          type="submit"
        >
          Update
        </Button>
      </div>
    )
  }
}
