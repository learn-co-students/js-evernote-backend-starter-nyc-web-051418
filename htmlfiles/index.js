const displayNotes = (notes) => {
  notes.forEach( note => {
    // debugger;
    sidebar.innerHTML += `<a id=deleteSidebar${note.id} href=#${note.id}><div><h2>${note.title}</h2><p>${note.body.slice(0,20)}...</p></div></a>`
    detail.innerHTML += `<div id=deleteContent${note.id}><h2><a name=${note.id}>${note.title}</a></h2><p>${note.body}</p><button id=edit${note.id}>Edit</button> <button id=delete${note.id}>Delete</button></div>`
  })

  notes.forEach(note=>{
    var deleteButton=document.getElementById("delete"+`${note.id}`)
      // debugger;
      deleteButton.addEventListener("click",(event)=> {
        event.preventDefault()
        // debugger;
        console.log("hi")
        console.log(note)
        deleteNote(note)
        document.getElementById("deleteContent"+`${note.id}`).remove()
        document.getElementById("deleteSidebar"+`${note.id}`).remove()

      })

  })

  notes.forEach(note=>{
    function editFunction() {
      var editButton=document.getElementById("edit"+`${note.id}`)
      editButton.addEventListener("click",(event)=>{
        event.preventDefault()
        console.log("I want to edit")
        var editContent=document.getElementById("deleteContent"+`${note.id}`)
  // debugger;
        editContent.innerHTML=`<form>
        <textarea id=title${note.id} rows="2" cols="80"> ${note.title}</textarea>
        <textarea id=body${note.id} rows="8" cols="80"> ${note.body}</textarea>
        <input id=submitEdit${note.id} type="submit" style="background:red" value="submit to edit">
        </form>
        `
        // debugger;
        console.log(editContent)
        var submitButton=document.getElementById("submitEdit"+`${note.id}`)
          submitButton.addEventListener("click",(event)=>{
            event.preventDefault()
            var editTitle=document.getElementById("title"+`${note.id}`)
            var editBody=document.getElementById("body"+`${note.id}`)
            console.log(editTitle)
              // debugger;

            note.title=editTitle.value
            note.body=editBody.value

            // debugger;
            editNote(note)
            let editedSidebar=document.getElementById("deleteSidebar"+`${note.id}`)
            let editedContent=document.getElementById("deleteContent"+`${note.id}`)
            editedSidebar.innerHTML=`<div><h2>${note.title}</h2><p>${note.body.slice(0,20)}...</p></div>`
            editedContent.innerHTML=`<h2><a name=${note.id}>${note.title}</a></h2><p>${note.body}</p><button id=edit${note.id}>Edit</button> <button id=delete${note.id}>Delete</button>`
              editFunction();
            // editContent.innerHTML=
            // debugger;
            // delete:

                var deleteButton=document.getElementById("delete"+`${note.id}`)
                  // debugger;
                  deleteButton.addEventListener("click",(event)=> {
                    event.preventDefault()
                    // debugger;
                    console.log("hi")
                    console.log(note)
                    deleteNote(note)
                    document.getElementById("deleteContent"+`${note.id}`).remove()
                    document.getElementById("deleteSidebar"+`${note.id}`).remove()
                    // debugger;

                  })




          })

      })
      // debugger;


  // edit

    }

editFunction();

  })


}

var url="http://localhost:3000/api/v1/notes"
fetch(url).then(r=>r.json()).then(data=>{console.log(data);displayNotes(data)})
// debugger;

function deleteNote(note) {
  var url=`http://localhost:3000/api/v1/notes/${note.id}`

  const confi={
    method:"DELETE",
    headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    message: note
  })
  }
  // debugger;
fetch(url,confi)

}

function editNote(note) {
  // debugger;
  var url=`http://localhost:3000/api/v1/notes/${note.id}`

  const confi={
    method:"PATCH",
    headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
      "title":`${note.title}`,
      "body":`${note.body}`
    })
  }
// debugger;
fetch(url,confi)


}
