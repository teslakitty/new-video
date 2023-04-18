import firebase from 'firebase/app';
import '/firebase/auth';
import 'firebase/database';
import Twilio from 'twilio-video'; // Import Twilio here

const firebaseConfig = {
  // your Firebase config here
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();

export { auth, firestore };

const twilioConfig = {
  apiKey: 'SKeb8c6e246d50f880e17a36b7e113985c',
  apiSecret: '6VvsitCcr6UsI8rXU6pJijO7C3lyZDe3',
};

// Initialize Twilio Video SDK and create local tracks
const connect = async () => {
  const token = await getToken(); // function to generate Twilio token
  const roomName = 'cool-video-chat-app';
  const room = await Twilio.connect(token, {
    name: roomName,
  });
  const localTracks = await Twilio.createLocalTracks({
    audio: true,
    video: { width: 640 },
  });
  localTracks.forEach(track => {
    room.localParticipant.publishTrack(track);
    addVideoTrack(track, room.localParticipant.identity);
  });
  room.on('participantConnected', participant => {
    participant.tracks.forEach(publication => {
      if (publication.isSubscribed) {
        addVideoTrack(publication.track, participant.identity);
      }
    });
    participant.on('trackSubscribed', track => {
      addVideoTrack(track, participant.identity);
    });
  });
};

// Function to add a video track to the video grid
function addVideoTrack(track, identity) {
  // Create a new video element and wrapper
  const videoElement = document.createElement('video');
  videoElement.setAttribute('autoplay', '');
  videoElement.setAttribute('muted', '');
  const videoWrapper = document.createElement('div');
  videoWrapper.classList.add('video-wrapper');
  videoWrapper.appendChild(videoElement);

  // Add the wrapper to the video grid
  const videoGrid = document.getElementById('video-grid');
  videoGrid.appendChild(videoWrapper);

  // Play the track on the new video element
  track.attach(videoElement);
}

async function getToken() {
  const response = await fetch('/token');
  if (!response.ok) {
    throw new Error('Failed to fetch token');
  }
  const data = await response.json();
  return data.token;
}

// Initialize FirebaseUI
const ui = new firebaseui.auth.AuthUI(auth);

// Configure FirebaseUI
const uiConfig = {
  signInSuccessUrl: '/',
  signInOptions: [
    // Add your desired sign-in methods here
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  tosUrl: '/',
  privacyPolicyUrl: '/'
};

// Show FirebaseUI auth widget
ui.start('#firebaseui-auth-container', uiConfig);

// Add event listeners to buttons
document.getElementById('mute-button').addEventListener('click', () => {
  const localParticipant = Twilio?.video?.room?.localParticipant;
  if (localParticipant) {
    localParticipant.audioTracks.forEach(track => {
      track.isEnabled = !track.isEnabled;
    });
  }
});

document.getElementById('video-button').addEventListener('click', () => {
  const localParticipant = Twilio?.video?.room?.localParticipant;
  if (localParticipant) {
    localParticipant.videoTracks.forEach(track => {
      track.isEnabled = !track.isEnabled;
    });
  }
});

document.getElementById('leave-button').addEventListener('click', () => {
  Twilio?.video?.room?.disconnect();
});

document.getElementById('google-sign-in-button').addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
});
