import MainClientSessionService from "../ClientSessionService";
import influx_logging_service from "./logging_service";
import signal_service from "./signal_service";
import session_list_service from "./session_list_service";

const client_session_service = new MainClientSessionService({
    logging_service: influx_logging_service,
    signal_service,
    session_list_service,
});

export default client_session_service;