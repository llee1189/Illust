import React from 'react'

const ProfilePhotos = ({photo, dtheme}) => {
    return (
        <div className='feed-profile-photo' style={dtheme ? {
            'borderColor':'#1F1F1F ' ,} : {}}>
        <img className = 'profile-photo' src={photo} style={dtheme ? {
                    'borderColor':'#111111 ' , } : {'borderColor':'white'}}/>
        </div>
    )
}

export default ProfilePhotos
