import{useEffect, useState} from "react"

const Todo = ()=>{

    const [title,setTitle]= useState("")
    const [description,setDescription] = useState("")
    const [todos,setTodos] = useState([])
    const[error,setError] = useState("")
    const[message,setMessage] = useState("")
    const [editId,setEditId]=useState(-1)
    const [editTitle,setEditTitle]= useState("")
    const [editDescription,setEditDescription] = useState("")
    const apiUrl = "http://localhost:8000"

    function HandleSubmit(){
        setError("")
        // check input
        if (title.trim() !== "" && description.trim() !== "") {
            // api call
            fetch(apiUrl+"/todos",
                {                      //option
                    method:"POST",
                    headers:{          // bcz we r sending in a json format
                        "content-type":"application/json"
                    },
                    body:JSON.stringify({title,description})
                }
            )
            .then((res)=>{
               if (res.ok) {
                  // add item to the list
                  setTodos([...todos,{title,description}])
                  setTitle("")
                  setDescription("")
                  setMessage("Item added Successfully")
                  setTimeout(()=>{
                    setMessage("")
                  },3000)

               }else{
                  setError("Unable to create todo item")
               }
            }).catch(()=>{
                setError("Unable to create todo item")
            }
        )
    }
}

useEffect(()=>{
    getItems()
},[])

const getItems = ()=>{
    fetch(apiUrl+"/todos")
    .then(res=>res.json())
    .then(res=>{
        setTodos(res)
    })
}

const HandleEdit = (item)=>{
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description)
}

const HandleUpdate = ()=>{
    setError("")
    // check input
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
        // api call
        fetch(apiUrl+"/todos/"+editId,
            {                      //option
                method:"PUT",
                headers:{          // bcz we r sending in a json format
                    "content-type":"application/json"
                },
                body:JSON.stringify({title: editTitle,description: editDescription})  //IMPPPP
            }
        )
        .then((res)=>{
           if (res.ok) {
              // UPDATE item to the list
              const updatedTodos = todos.map((item)=>{
                if (item._id==editId) {
                    item.title = editTitle
                    item.description = editDescription
                }
                return item
              })



              setTodos(updatedTodos)
              setEditTitle("")
              setEditDescription("")
              setMessage("Item updated Successfully")
              setTimeout(()=>{
                setMessage("")
              },3000)

              setEditId(-1)

           }else{
              setError("Unable to create todo item")
           }
        }).catch(()=>{
            setError("Unable to create todo item")
        }
    )
}
}

const HandleEditCancel = ()=>{
    setEditId(-1)
}

const HandleDelete = (id)=>{
    if (window.confirm("Are you sure wanna delete?")){
                fetch(apiUrl+"/todos/"+id,
                {
                    method:"DELETE"
                }
                ).then(()=>{
                    const updatedTodos = todos.filter((item)=>item._id !== id)
                    setTodos(updatedTodos)
                    setMessage("Item deleted Successfully")
                    setTimeout(()=>{
                        setMessage("")
                    },3000)
                })
    }
    

}

    return<>
    <div className="row p-3 bg-success text-light">
        <h1>Todo list project</h1>
    </div>
    <div className="row">
        <h3>Add item</h3>
        {message && <p className="text-success">{message}</p>}
        <div className="form-group d-flex gap-2">
        <input className="form-control" placeholder="title" onChange={(e)=>{setTitle(e.target.value)}} value={title} type="text" />
        <input className="form-control" placeholder="description" onChange={(e)=>{setDescription(e.target.value)}} value={description} type="text" />
        <button className="btn btn-dark" onClick={HandleSubmit}>Submit</button>
        </div>
        <div>
          {error && <p>{error}</p>}
        </div>
        <div className="row mt-3">
            <h3>Tasks</h3>
        
                <div >
                    <ul className="list-group">
                        {
                            todos.map((item)=>
                                <li className="list-group-item d-flex justify-content-between bg-info align-items-center my-2">
                                <div className="d-flex flex-column">
                                    {
                                        editId == -1 || editId !== item._id ? <>
                                        <span className="fw-bold">{item.title}</span>
                                        <span>{item.description}</span>
                                        </> : <>
                                        <div className="form-group d-flex gap-2">
                                            <input className="form-control" placeholder="title" onChange={(e)=>{setEditTitle(e.target.value)}} value={editTitle} type="text" />
                                            <input className="form-control" placeholder="description" onChange={(e)=>{setEditDescription(e.target.value)}} value={editDescription} type="text" />
                                        </div>
                                        </>
                                        
                                    }
                                    
                                </div>
                                <div  className=" d-flex gap-2">
                                    {editId == -1  || editId !== item._id ? <button className="btn btn-warning" onClick={()=>HandleEdit(item)}>Edit</button> : <button className="btn btn-warning" onClick={HandleUpdate}>Update</button> }
                                    { editId == -1  || editId !== item._id ? <button className="btn btn-danger" onClick={()=>HandleDelete(item._id)}>Delete</button> : <button className="btn btn-danger" onClick={HandleEditCancel}>Cancel</button>}
                                </div>
                            </li>
                            )
                        }
                    </ul>
                </div>
            
        </div>
    </div>
    </>
}

export default Todo