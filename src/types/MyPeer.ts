import Peer from 'simple-peer';

interface IMyPeer {
  peer: Peer.Instance | null;
  remotePeers: Peer.Instance[];
}
export default class MyPeer implements IMyPeer {
  peer: Peer.Instance | null = null;
  remotePeers: Peer.Instance[] = [];

  constructor(opts?: Peer.Options) {
    //1. create a new peer
    //2. connect the peer to other peers in remotePeers (.on('signal'))
    this.peer = new Peer(opts);
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
    const updatedRemotePeers = this.remotePeers.filter(
      (rp) => rp !== remotePeer
    );
    this.remotePeers = updatedRemotePeers;
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
//
