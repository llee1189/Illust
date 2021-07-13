import React, { useState, useEffect} from 'react';
import Login from './content/Login'
import Main from './content/Main'
import AddPhoto from './content/AddPhoto'
import Signup from './content/Signup'
import Guest from './content/Guest';
import { db } from './Firebase';


function App() {
const[photos, setPhotos] = useState([])
const[showSignup, setShowSignup] = useState(false)
const[showGuest, setShowGuest] = useState(false)
const[showMain, setShowMain] = useState(false)
const[showAddPhoto, setShowAddPhoto] = useState(false)
const[user, setUser] = useState(null);
const[username, setUsername] = useState('');
const[log, setLog] = useState(false);


useEffect(() => {
  if (log) {
    setShowAddPhoto(false);
    setShowMain(false);
    setShowSignup(false);
    setLog(false);
  } 
}, [log]);

useEffect(() => {


  db.collection('photos').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
    setPhotos(snapshot.docs.map(doc => ({
      id: doc.id,
      photo: doc.data()
    })))
  })
}, []);

  return(
    <div>
    {
      showGuest ? <Guest photos={photos} username={username} guest={showGuest} onGuest={()=>setShowGuest(!showGuest)}/> :
      showAddPhoto ? <AddPhoto onAddPhoto={() => setShowAddPhoto(!showAddPhoto)} username={username} onHome={()=>setShowAddPhoto(false)} onLog={()=>setLog(true)}/>:
      showMain ? <Main photos={photos} username={username} onAddPhoto={() => setShowAddPhoto(!showAddPhoto)} onHome={()=>setShowAddPhoto(false)} onMain={()=>setShowMain(!showMain)}/>:
      showSignup ? <Signup onSignup={()=> setShowSignup(!showSignup)} onMain={()=> setShowMain(!showMain)} onUsername={(u) => setUsername(u)}/>:
      <Login onSignup={()=> setShowSignup(!showSignup)} onMain={()=> setShowMain(!showMain)} onUsername={(u) => setUsername(u)} onGuest={()=> setShowGuest(!false)}/>
    }
    </div>
  );
}



export default App;
