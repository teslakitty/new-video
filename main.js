import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDA0X9OkthCMMvhxXIwUvVjeqzjNNT8b_k",
  authDomain: "newvideo2212.firebaseapp.com",
  databaseURL: "https://newvideo2212-default-rtdb.firebaseio.com",
  projectId: "newvideo2212",
  storageBucket: "newvideo2212.appspot.com",
  messagingSenderId: "283500325791",
  appId: "1:283500325791:web:4715dfd7a607b511832baa"
};


firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();

export { auth, firestore };

// Initialize Agora SDK and create client object
const agoraAppId = '<5f10b8d038114e4494671eba6636a671>';
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

// Function to join a channel
async function joinChannel(channelName, uid) {
  // Create token for user authentication
  const token = '<007eJxTYGiLLvx79qrbxGrW2g8f31qamQvoqnnfvOAWFbVdtOjGi0MKDKZphgZJFikGxhaGhiapJiaWJmbmhqlJiWZmxmaJQGboDp2UhkBGhu0fN7EwMkAgiM/CkJuaX87AAABslh/p>';

  // Join the channel using Agora SDK
  await client.join(agoraAppId, channelName, token, uid);

  // Create local audio and video tracks
  const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  const localVideoTrack = await AgoraRTC.createCameraVideoTrack();

  // Publish local tracks to the channel
  await client.publish([localAudioTrack, localVideoTrack]);

  // Add the local tracks to the video grid
  addVideoTrack(localVideoTrack, uid);
}

// Function to add a video track to the video grid
function addVideoTrack(track, uid) {
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
  track.play(videoElement);
}

// Function to leave the channel and unpublish tracks
async function leaveChannel() {
  // Unpublish local tracks and leave the channel
  await client.unpublish();
  await client.leave();

  // Remove all video elements from the video grid
  const videoGrid = document.getElementById('video-grid');
  while (videoGrid.firstChild) {
    videoGrid.removeChild(videoGrid.firstChild);
  }
}

// Add event listeners to the control buttons
document.getElementById('mute-button').addEventListener('click', () => {
  const localAudioTrack = client.getLocalAudioTrack();
  if (localAudioTrack) {
    localAudioTrack.setMuted(!localAudioTrack.isMuted());
  }
});
document.getElementById('video-button').addEventListener('click', () => {
  const localVideoTrack = client.getLocalVideoTrack();
  if (localVideoTrack) {
    localVideoTrack.setEnabled(!localVideoTrack.isEnabled());
  }
});
document.getElementById('leave-button').addEventListener('click', leaveChannel);

// Add event listener to the sign-in button
document.getElementById('sign-in-button').addEventListener('click', () => {
  const ui = new firebaseui.auth.AuthUI(auth);
  ui.start('#firebaseui-auth-container', {
    signInOptions: [provider],
    signInFlow: 'popup',
    callbacks: {
      signInSuccessWithAuthResult: (authResult, redirectUrl) => {
        // Join the channel after successful sign-in
        const user = authResult.user;
        const uid = user.uid;
        joinChannel('cool-video-chat-app', uid);
        return false;
      }
    }
  });
});
