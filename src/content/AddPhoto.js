import Photo from './Photo'
import { AiFillHeart, AiFillMessage, AiFillHome, AiOutlinePlus } from 'react-icons/ai'
import { BsFillPersonFill, BsMoon, BsPerson} from 'react-icons/bs'
import { BiMoon } from 'react-icons/bi'
import {RiLogoutBoxLine} from 'react-icons/ri'
import { useState } from 'react'
import {Dropdown} from './Main'
import { storage, db } from '../Firebase'
import firebase from 'firebase'


const AddPhoto = ({onAddPhoto, username, onHome, onLog}) => {
    const LogOut = () => {
        firebase.auth().signOut().then(() => {
            onLog();
            alert('Logging out was successful.')
        }).catch((error) => {
            alert('You are trapped here forever.')
        });
    }

    const [image, setImage] = useState(null);
    const [url, setURL] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('')
    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            setURL(URL.createObjectURL(e.target.files[0]))
        }

    }
    const handleUpload = (e) => {
        e.preventDefault()
        if (image === null) {
            alert('Please choose a file.')
            return;
        }
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                storage
                    .ref('images')
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection('photos').add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            photo: url,
                            user: username
                        });
                        setProgress(0);
                        setCaption('');
                        setImage(null);
                    })
            }
        )
        alert('Photo has been published successfully.')
        onAddPhoto();
    }
    

    return (
        <div className='main-container'> 

        <div className='menu'>
            <div className='menu-text'>
                <div className='menu-name'>Illust.</div>
                <input type='text' placeholder='Search' className='search'/>
                <div className='menu-options'>
                    <AiFillHome onClick = {onHome}/>
                    <AiFillMessage/>
                    <AiFillHeart/>
                    <Dropdown><Drop LogOut={LogOut}/></Dropdown>
                </div>
            </div>
        </div>
        <div className='add-photo-container'>
            <form className='add-photo' onSubmit={handleUpload}>
                <div className='stock-photo'>{ url !== null ? <div className='temp-photo-div'><img className='temp-photo' src={url}/></div> : <div className='temp-photo-div'><div className='no-photo'></div></div>}
                <input className='choose-file' type="file" onChange={handleChange}/>
                </div>
                <input className='caption-text' type="text" placeholder='Write a caption...' value = {caption} onChange={(e)=> setCaption(e.target.value)}/>
                <input className='upload-button' type='submit' value='Upload'/>
                <progress value={progress} max='100'/>
            </form>
            </div>
        </div>
    )
}

export function Drop({LogOut}) {
    return (
        <div className='drop'>
            <li><BsPerson/>Profile</li>
            <li><BiMoon/>Theme</li>
            <li onClick={LogOut}><RiLogoutBoxLine/>Log Out</li>
        </div>
        // Profile, Add photos, nightmode, logout
    )
}

export default AddPhoto
