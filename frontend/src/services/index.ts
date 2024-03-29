import React from "react"

import EventService from "./EventService"
import MediaDevicePermissionService from "./MediaDevicePermissionService"
import MediaStreamService from "./MediaStreamService"
import HostSessionService from "./HostSessionService"
import ServiceWorkerService from "./ServiceWorkerService"
import ClientSessionService from "./ClientSessionService"
import SessionListService from "./SessionListService/types"
import { SignalService } from "./SignalService/types"

export type Services = {
    logging_service: LoggingService,
    authorization_service: AuthorizationService,
    client_session_service: ClientSessionService,
    event_service: EventService,
    signal_service: SignalService,
    media_device_permission_service: MediaDevicePermissionService,
    media_stream_service: MediaStreamService,
    host_session_service: HostSessionService,
    session_list_service: SessionListService,
    service_worker_service: ServiceWorkerService,
}

export const context = React.createContext<Nullable<Services>>(null);

type UseService<K extends keyof Services> = () => Services[K];

function makeUseService<K extends keyof Services>(key: K): UseService<K> {
    return () => {
        const services = React.useContext(context);
        if (services === null)
            throw new Error('useService must be used within a ServiceProvider');
        return services[key]
    };
}

export const useLoggingService = makeUseService('logging_service');
export const useAuthorizationService = makeUseService('authorization_service');
export const useClientSessionService = makeUseService('client_session_service');
export const useEventService = makeUseService('event_service');
export const useSignalService = makeUseService('signal_service');
export const useMediaDevicePermissionService = makeUseService('media_device_permission_service');
export const useMediaStreamService = makeUseService('media_stream_service');
export const useHostSessionService = makeUseService('host_session_service');
export const useSessionListService = makeUseService('session_list_service');
export const useServiceWorkerService = makeUseService('service_worker_service');
