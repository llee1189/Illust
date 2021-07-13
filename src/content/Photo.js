import {FaRegComment} from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { db } from '../Firebase'
import firebase from 'firebase'


const Photo = ({user, photo, caption, pid, username, guest}) => {

    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        if (comment === '') {
            alert('You must type something before submitting.')
            return
        }
        db.collection('photos').doc(pid).collection('comments').add( {
            text: comment,
            username: username,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('')
    }

    useEffect(() => {
        let unsubscribe;
        if (pid) {
            unsubscribe = db
                .collection('photos')
                .doc(pid)
                .collection('comments')
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc => doc.data())));
                });
        }

        return () => {
            unsubscribe();
        }
    }, [pid]);
    


    return (
        <div>
        <div className='feed-photos-border'>


            <img className="photo" src={photo}/>
            <div className='info'><div className='user'>{user}</div>:&nbsp;<div>{caption}</div></div>
            <div className='comments'> <FaRegComment className='FaRegComment' onClick={()=>setShowComments(!showComments)}/>&nbsp;Comments</div>
            {showComments && <div className='comments-show'> {comments.map((comment) => (
        <p className>
            <strong>{comment.username}:&nbsp;</strong> {comment.text}
        </p>

    ))}</div>}
        </div>
        {!guest &&         <form className='add-comment-container' onSubmit={onSubmit}>
            <input type='text' className='add-comment' placeholder='Add a comment...' value={comment} onChange={(e)=> setComment(e.target.value)}/>
            <input className='add-comment-post' type='submit' value='Post'/>
        </form>}

        </div>
    )
}


export default Photo

  {/* <div>Username</div>
            <img class='photo' src="https://cdn.pixabay.com/photo/2015/09/02/13/10/rigging-918920_960_720.jpg"/> */}