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

  function findNote(noteId) {
    return notes.find(note => note.id === parseInt(noteId));
  }

  function filterNotes(values) {
    return notes.filter(note => note.title.includes(values));
  }

  function triggerDisplayMessage(noteId, noteFullData) {
    if (noteFullData === undefined) {
      const clickedNote = findNote(noteId);
      const builtNote = buildDisplayedMsg(clickedNote);
      displayNote(builtNote);
    } else {
      const builtNote = buildDisplayedMsg(noteFullData);
      displayNote(builtNote);
    }
  }

  function emptyDetailedNotes(message, addition) {
    if (addition === "addition"){
      detail.innerHTML += `<p>${message}</p>`;
    } else {
      detail.innerHTML = `<p>${message}</p>`;
    }
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
      const previousNoteData = findNote(noteId);
      document.getElementById('titleInput').value = `${previousNoteData.title}`;
      document.getElementById('descriptionInput').value = `${previousNoteData.body}`;
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
    const newUrl = `${url}`;
    const method = "POST"
    const headers = {"Content-Type": "application/json"}
    const payload = JSON.stringify({title: title, body: description, user_id:2 })
    const configOrb = {method: method, headers: headers, body: payload }
    return fetch(newUrl, configOrb).then(r => r.json()).then(resp => {triggerDisplayMessage(resp.id, resp); emptyDetailedNotes("Your note was created successfully.", "addition");
 }).then(init);
  }

  //event listeners w/o routing
  document.getElementById('create').addEventListener("click", function(event) {
    addFormReady("new")
  })

  document.getElementById('search-bar').addEventListener("input", function(event) {
    let searchValues = this.value;
    if (searchValues.match(/[a-z]/i)){
      let filteredNotes = filterNotes(searchValues);
      displayAllMsg(filteredNotes);
    } else {
      displayAllMsg(notes);
    }
  })

  document.getElementById('sidebar').addEventListener("click", function(event) {
    if (event.target.dataset.action === "openMsg") {
      triggerDisplayMessage(event.target.id)
    } else {
      console.log("nope");
    }
  })

  //router functions
  function routerEdit(eventTarget) {
    eventTarget.style.display = "none";
    addFormReady(eventTarget.dataset.editId);
  }
  function routerSubmitEditBtn(eventArg) {
    eventArg.preventDefault();
    const editId = eventArg.target.dataset.submitId
    const editTitle = document.getElementById('titleInput').value
    const editDescription = document.getElementById('descriptionInput').value
    updateNote(editId,editTitle, editDescription);
  }

  function routerSubmitNewBtn(eventArg) {
    eventArg.preventDefault();
    const editTitle = document.getElementById('titleInput').value
    const editDescription = document.getElementById('descriptionInput').value
    createNote(editTitle, editDescription);
  }

  //listener router
  document.getElementById('detail').addEventListener("click", function(event) {
    if (event.target.id === "edit") {
      routerEdit(event.target)
    } else if (event.target.id === "delete") {
      deleteNote(event.target.dataset.deleteId)
    } else if (event.target.dataset.action === "submitEditBtn") {
      routerSubmitEditBtn(event)
    } else if (event.target.dataset.action === "submitNewBtn") {
      routerSubmitNewBtn(event)
    }
  })

  //display sidebar notes
  function buildSideNote(note) {
    return `<div><h2 id="${note.id}" data-action="openMsg"> ${note.title}</h2><p>${note.body.slice(0,20)}...</p></div>`
  };
  function displayAllMsg(notesVar) {
    sidebar.innerHTML = notesVar.map(note => buildSideNote(note)).join('');
  }

  //origin: fetch and display
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
    displayAllMsg(notes);
  }

  function init() {
    notes = [];
    fetch(url).then(r => r.json()).then(r => displayNotes(r)).catch(error => {
    return "Fetch Failed"
  });
  }
  init();

});
