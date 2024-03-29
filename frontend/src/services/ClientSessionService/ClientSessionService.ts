import { Session } from "../SessionListService/types";
import ClientConnection from "./ClientConnection";

interface ClientSessionStateNotJoined {
    state: 'not_joined';
}

interface ClientSessionStateJoining {
    state: 'joining';
    session: Session;
}

interface ClientSessionStateJoined {
    state: 'joined';
    session: Session;
    client_connection: ClientConnection;
}

interface ClientSessionStateLeft {
    state: 'left';
}

interface ClientSessionStateSessionEnded {
    state: 'session_ended';
}

export type ClientSessionState =
    ClientSessionStateNotJoined |
    ClientSessionStateJoining |
    ClientSessionStateJoined |
    ClientSessionStateLeft |
    ClientSessionStateSessionEnded;

interface ClientSessionService extends EventTarget {
    get_state(): ClientSessionState;
    join_session(session: Session): void;
    leave_session(): void;
}

export default ClientSessionService;