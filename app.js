// Initialize Firebase
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
  



  // Initialize the Twilio Video client
const accessToken = 'SKf92f4930aff2ea5a2d1fa3dd83b6de72';
const videoClient = new Twilio.Video.Client(accessToken);





// Connect to a room and publish your local video feed
const roomName = 'my-room';
videoClient.connect({ roomName }).then(room => {
  const localStream = new Twilio.Video.LocalVideoTrack();
  room.localParticipant.publishTrack(localStream);
});




// Subscribe to remote video feeds
room.on('participantConnected', participant => {
    participant.on('trackSubscribed', track => {
      const remoteStream = track.attach();
      document.getElementById('remote-feeds').appendChild(remoteStream);
    });
  });
  