import React from 'react'

function ModalForm(props) {
  return (
    <>
      <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.desc}</DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Tournament Name"
            type="string"
            fullWidth
            variant="standard"
            onChange={updateName}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="desc"
            name="desc"
            label="Description"
            type="string"
            fullWidth
            variant="standard"
            onChange={updateDesc}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="num-teams"
            name="num-teams"
            label="Number of Teams"
            type="number"
            fullWidth
            variant="standard"
            onChange={updateTeams}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="num-rounds"
            name="num-rounds"
            label="Number of Rounds"
            type="number"
            fullWidth
            variant="standard"
            onChange={updateRounds}
          />
        </DialogContent>
    </>
  )
}

export default ModalForm