document.addEventListener("DOMContentLoaded", function(event) {
  //storage variables
  const notes = [];

  //identifier variables
  // const sidebarContainer = document.getElementById("sidebar")
  // const msgDisplayContainer = document.getElementById("master-detail-element")

  //display detailed noted
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

  //event static listeners
  document.getElementById('sidebar').addEventListener("click", function(event) {
    if (event.target.dataset.action === "openMsg") {
      triggerDisplayMessage(event.target.id)
    } else {
      console.log("nope");
    }
  })

  document.getElementById('detail').addEventListener("click", function(event) {
    if (event.target.id === "edit") {
      console.log("edit");
    } else if (event.target.id === "delete") {
      debugger;
      console.log(event.target.dataset.deleteId);
      // deleteNote()event.target.id;
    }
  })

  //display sidebar notes
  function buildSideNote(note) {
    console.log("hi")
    return `<div><h2 id="${note.id}" data-action="openMsg"> ${note.title}</h2><p>${note.body.slice(0,20)}...</p></div>`
  };

  function displayAllMsg() {
    sidebar.innerHTML = notes.map(note => buildSideNote(note)).join('');
    console.log("notes")
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

  const url = "http://localhost:3000/api/v1/notes";
  const displayNotes = function(notes) {
    notes.forEach(function(note) {
      saveNotes(note.title, note.body, note.id);
    })
    displayAllMsg();
  }

  fetch(url).then(r => r.json()).then(r => displayNotes(r)).catch(error => {
    return "Fetch Failed"
  });

});
