import React, { useState, useEffect } from 'react';
import Login from './content/Login'
import Main from './content/Main'
import AddPhoto from './content/AddPhoto'
import Signup from './content/Signup'
import Guest from './content/Guest';
import Profile from './content/Profile';
import Message from './content/Message';
import { db, auth } from './Firebase';


function App() {
  const [photos, setPhotos] = useState([])
  const [showProfile, setShowProfile] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [showGuest, setShowGuest] = useState(false)
  const [showMain, setShowMain] = useState(false)
  const [showAddPhoto, setShowAddPhoto] = useState(false)
  const [user, setUser] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [username, setUsername] = useState('');
  const [profileName, setProfileName] = useState('')
  const [log, setLog] = useState(false);
  const [profilePhotos, setProfilePhotos] = useState([])
  const [profileReady, setProfileReady] = useState(true);
  const [dtheme, setdTheme] = useState(false)

const onHome = () => {
  setShowProfile(false);
  setShowAddPhoto(false);
  setShowSignup(false);
  setShowMessage(false);
}

async function getUserIds() {
  console.log('start')
  var ref = db.collection('users').doc(profileName).collection('user-photos');
  var ui = [];
  try {
    var allIds = await ref.get();
    allIds.forEach(doc => (
      ui.push(doc.data().pid)
    ))
    console.log(ui)
  }
  catch (e) {
    console.log('Error with getting User IDs' + e)
  }


  var pi = [];
  try {
    var ref2 = db.collection('photos')
    for (const id of ui) {
      var allPhotos = await ref2.doc(id).get();
        pi.push({id: id, photo: allPhotos.data().photo})
    }
    console.log(pi)
  }
  catch (e) {
    console.log('Error with getting photos' + e)
  }
  setProfilePhotos(pi)
  onHome();
  setShowProfile(true)
}

useEffect(() => {
  if (profileName){    
    getUserIds()
  }
}, [profileName])

  // Logging off - can make into a regular function
  useEffect(() => {
    if (log) {
      setShowProfile(false);
      setShowAddPhoto(false);
      setShowMain(false);
      setShowSignup(false);
      setShowMessage(false);
      setLog(false);
    }
  }, [log]);


  // Photos
  useEffect(() => {
    db.collection('photos').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPhotos(snapshot.docs.map(doc => ({
        id: doc.id,
        photo: doc.data()
      })))
    })
  }, []);


  return (
    <div>
      {
        showMessage ? <Message username ={username} onHome={() => onHome()} setdTheme={() => setdTheme(!dtheme)} dtheme={dtheme} onAddPhoto={() => setShowAddPhoto(!showAddPhoto)}
        setProfileName={(x) => setProfileName(x)} onLog={() => setLog(true)}
        /> :

        showProfile ? <Profile onAddPhoto={() => setShowAddPhoto(!showAddPhoto)} onProfile={() => setShowProfile(!showProfile)} onLog={() => setLog(true)} username={username}
          profilePhotos={profilePhotos} profileName={profileName} profileReady={profileReady} 
          setProfileName={(x) => setProfileName(x)} dtheme={dtheme}  setdTheme={() => setdTheme(!dtheme)} onHome={() => onHome()} setShowMessage={() => setShowMessage(!showMessage)}
        /> :
          showGuest ? <Guest photos={photos} username={username} guest={showGuest} onGuest={() => setShowGuest(!showGuest)} /> :

            showAddPhoto ? <AddPhoto onAddPhoto={() => setShowAddPhoto(!showAddPhoto)} username={username} onHome={() => setShowAddPhoto(false)} 
            onLog={() => setLog(true)} setdTheme={()=>setdTheme(!dtheme)} dtheme={dtheme} setProfileName={(x) => setProfileName(x)} setShowMessage={() => setShowMessage(!showMessage)}/> :

              showMain ? <Main photos={photos} username={username} onAddPhoto={() => setShowAddPhoto(!showAddPhoto)} onHome={() => setShowAddPhoto(false)} onMain={() => setShowMain(!showMain)}
                aFunction={(x) => setProfileName(x)} setdTheme={()=>setdTheme(!dtheme)} dtheme={dtheme} setShowMessage={() => setShowMessage(!showMessage)}
              /> :
                showSignup ? <Signup onSignup={() => setShowSignup(!showSignup)} onMain={() => setShowMain(!showMain)} onUsername={(u) => setUsername(u)} /> :
                  <Login onSignup={() => setShowSignup(!showSignup)} onMain={() => setShowMain(!showMain)} onUsername={(u) => setUsername(u)} onGuest={() => setShowGuest(!false)}
                    onUser={(u) => setUser(u)} />
      }
    </div>
  );
}



export default App;
