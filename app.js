// app.js
const agoraAppId = '5f10b8d038114e4494671eba6636a671'; // Replace with your Agora App ID
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

// Function to initialize and join the Agora channel
function initializeAgora() {
  client.init(agoraAppId, () => {
    client.join(null, 'meow', null, (uid) => {
      const localStream = AgoraRTC.createStream({
        streamID: uid,
        audio: true,
        video: true,
      });

      localStream.init(() => {
        localStream.play('local-stream');
        client.publish(localStream);

        client.on('stream-added', (evt) => {
          const remoteStream = evt.stream;
          client.subscribe(remoteStream);
        });

        client.on('stream-subscribed', (evt) => {
          const remoteStream = evt.stream;
          const remoteStreamContainer = document.getElementById('remote-streams');
          const remoteStreamDiv = document.createElement('div');
          remoteStreamDiv.id = `remote-stream-${remoteStream.getId()}`;
          remoteStreamContainer.appendChild(remoteStreamDiv);
          remoteStream.play(`remote-stream-${remoteStream.getId()}`);
        });
      });
    });
  });
}

// Execute the initialization function when the page loads
window.onload = initializeAgora;
