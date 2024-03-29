# TODO
## Now
### Bugs
- backup eventlog to S3
- reconnect WebRTC
- improve logic for knowing when a session has ended
- refresh token already used results in bricked app
    - from too fast refreshes

### Features
- indicate that the connection is being established
- record monitor events
- show baby station battery level on monitor
- picture in picture for all browsers
    - currently only firefox displays button
    - close if connection lost
- add cloudfront content security policy and permissions policy to cloudformation
- integration tests for API prod release

## Next
### Bugs
- mock square for testing
- responive slightly broken on phone (S7)
- server hardening
- websocket to notify when a new session becomes available

### Features
- connection lost
    - attempt reconnect
    - Picture in Picture doesn't support custom elements
        - disable picture in picture when connection is lost
- monitor time taken to connect call
    - show spinner
- edit device metadata
- microphone from monitor (default muted)
- record button on monitor (picture and video)
    - instruct baby station to do the recording (better quality)
    - record the stream coming over webrtc (more intuitive)
    - both? record on baby station then send over data stream to monitor?
- show number of active connections
- continuous integration
- noise when connection lost
- battery usage analytics

## Later
### Bugs
- microphone didn't come through when also playing sound from different app?
- scale
    - use AWS IoT as message broker on production
        - when monitor comes on line it sends message asking what sessions are available
            - accounts/{account_id}
        - for WebRTC negotiation 
            - accounts/{account_id}/to_device/{device_id}/from_device/{device_id}
- frontend/node_modules/react-scripts/config/webpackDevServer.config.js
    - devServer.client.webSocketURL.protocol = wss

### Features
- configurable signal server
- configurable STUN server
- use colour from the video stream to set background colour
    - display video twice
        - fullscreen in background blurred
        - actual video stream
- Lighting payments
