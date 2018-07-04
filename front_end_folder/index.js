document.addEventListener("DOMContentLoaded", function(event) {
  //general variables
  let notes = [];
  const url = "http://localhost:3000/api/v1/notes";

  //display detailed notes
  function buildDisplayedMsg(note) {
    return `<div><h2>${note.title}</h2><p>${note.body}</p><button data-edit-id="${note.id}" id="edit">Edit</button> <button data-delete-id="${note.id}" id="delete">Delete</button></div>`
  }

  function displayNote(builtNote) {
    detail.innerHTML = builtNote;
  }

  function triggerDisplayMessage(noteId) {
    const clickedNote = notes.find(note => note.id === parseInt(noteId))
    const builtNote = buildDisplayedMsg(clickedNote)
    displayNote(builtNote);
  }

  function emptyDetailedNotes(message) {
    detail.innerHTML = `<p>${message}</p>`;
  };

  //forms
  function returnForm(noteId, action){
    return `<div>
              <h2>${action} Note</h2>
              <form>
                <input id="titleInput", placeholder="Title" />
                <textarea id="descriptionInput" rows="4" cols="50" placeholder="Description"></textarea>
                <input type="submit" class="btn" data-submit-id="${noteId}" data-action="submit${action}Btn">
              </form>
            </div>`;
  }

  function addFormReady(noteId) {
    if (noteId === "new"){
      detail.innerHTML = returnForm(noteId, "New");
    } else {
      detail.innerHTML += returnForm(noteId, "Edit");
    }
  };

  //CRUD actions
  function deleteNote(noteId) {
    emptyDetailedNotes("Your note was deleted successfully.");
    const newUrl = `${url}/${noteId}`;
    return fetch(newUrl, {method: "DELETE"}).then( init );
  }

  function updateNote(id, title, description){
    emptyDetailedNotes("Your note was updated successfully.");
    const newUrl = `${url}/${id}`;
    const method = "PATCH"
    const headers = {"Content-Type": "application/json"}
    const payload = JSON.stringify({title: title, body: description})
    const configOrb = {method: method, headers: headers, body: payload }
    return fetch(newUrl, configOrb).then( init );
  }

  function createNote(title, description){
    emptyDetailedNotes("Your note was created successfully.");
    const newUrl = `${url}`;
    const method = "POST"
    const headers = {"Content-Type": "application/json"}
    const payload = JSON.stringify({title: title, body: description, user_id:2 })
    const configOrb = {method: method, headers: headers, body: payload }
    // return fetch(newUrl, configOrb).then(r => r.json()).then( r => {init(); return r }).then(resp => triggerDisplayMessage(`${resp.id}`));
  }

  //event static listeners
  document.getElementById('create').addEventListener("click", function(event) {
    addFormReady("new")
  })

  document.getElementById('sidebar').addEventListener("click", function(event) {
    if (event.target.dataset.action === "openMsg") {
      triggerDisplayMessage(event.target.id)
    } else {
      console.log("nope");
    }
  })

  document.getElementById('detail').addEventListener("click", function(event) {
    if (event.target.id === "edit") {
      addFormReady(event.target.dataset.editId);
    } else if (event.target.id === "delete") {
      deleteNote(event.target.dataset.deleteId)
    } else if (event.target.dataset.action === "submitEditBtn") {
      event.preventDefault();
      const editId = event.target.dataset.submitId
      const editTitle = document.getElementById('titleInput').value
      const editDescription = document.getElementById('descriptionInput').value
      updateNote(editId,editTitle, editDescription);
    } else if (event.target.dataset.action === "submitNewBtn") {
      event.preventDefault();
      const editTitle = document.getElementById('titleInput').value
      const editDescription = document.getElementById('descriptionInput').value
      createNote(editTitle, editDescription);
    }
  })

  //display sidebar notes
  function buildSideNote(note) {
    return `<div><h2 id="${note.id}" data-action="openMsg"> ${note.title}</h2><p>${note.body.slice(0,20)}...</p></div>`
  };
  function displayAllMsg() {
    sidebar.innerHTML = notes.map(note => buildSideNote(note)).join('');
  }

  //initial fetch
  function saveNotes(noteTitle, noteBody, noteId) {
    const noteEl = {
      "id": noteId,
      "title": noteTitle,
      "body": noteBody
    };
    notes.push(noteEl);
  };

  function displayNotes(notesObjs) {
    notesObjs.forEach(function(note) {
      saveNotes(note.title, note.body, note.id);
    })
    displayAllMsg();
  }

  function init() {
    notes = [];
    fetch(url).then(r => r.json()).then(r => displayNotes(r)).catch(error => {
    return "Fetch Failed"
  });
  }
  init();

});
