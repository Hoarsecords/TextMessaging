import Peer from 'simple-peer';
import wrtc from 'wrtc';

interface IMyPeer {
  peer: Peer.Instance | null;
  remotePeers: Peer.Instance[];
}
export default class MyPeer implements IMyPeer {
  peer: Peer.Instance | null = null;
  remotePeers: Peer.Instance[] = [];

  constructor() {
    this.peer = new Peer({ initiator: true, wrtc: wrtc as any });
    this.remotePeers = [];
  }

  /*This method will add a remote peer to the peer's list, so that we can loop through them and send informaiton  */
  async addRemotePeer(remotePeer: Peer.Instance) {
    this.remotePeers.push(remotePeer);
    this.peer?.on('signal', (data) => {
      remotePeer.signal(data);
    });
  }

  async removeRemotePeer(remotePeer: Peer.Instance) {
    //delete the peer from the list

    //destroy connection
    remotePeer?.destroy();
  }

  async sendSignal(message: any) {
    this?.peer?.on('connect', () => {
      // wait for 'connect' event before using the data channel
      this?.peer?.send(message);
    });
  }
}
