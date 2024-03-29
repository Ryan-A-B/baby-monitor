import Severity from "./LoggingService/Severity";

export const EventTypeServiceWorkerRegistrationStatusChanged = 'service_worker_registration_status_changed';

interface ServiceWorkerRegistrationStatusNotAvailable {
    status: 'not_available';
}

interface ServiceWorkerRegistrationStatusAvailable {
    status: 'available';
}

interface ServiceWorkerRegistrationStatusRegistered {
    status: 'registered';
    registration: ServiceWorkerRegistration;
}

interface ServiceWorkerRegistrationStatusFailed {
    status: 'failed';
    error: unknown;
}

export type ServiceWorkerRegistrationStatus =
    ServiceWorkerRegistrationStatusNotAvailable |
    ServiceWorkerRegistrationStatusAvailable |
    ServiceWorkerRegistrationStatusRegistered |
    ServiceWorkerRegistrationStatusFailed;

type NewServiceWorkerServiceInput = {
    logging_service: LoggingService;
}

class ServiceWorkerService extends EventTarget {
    private static should_skip_registration = process.env.NODE_ENV === 'development';
    private logging_service: LoggingService;
    private status: ServiceWorkerRegistrationStatus;

    constructor(input: NewServiceWorkerServiceInput) {
        super();
        this.logging_service = input.logging_service;
        const service_worker_available = 'serviceWorker' in navigator;
        if (!service_worker_available) {
            this.status = { status: 'not_available' };
            return;
        }
        this.status = { status: 'available' };
    }

    public get_status = (): ServiceWorkerRegistrationStatus => {
        return this.status;
    }

    private set_status = (status: ServiceWorkerRegistrationStatus): void => {
        this.logging_service.log({
            severity: Severity.Debug,
            message: `Service worker registration status changed from ${this.status.status} to ${status.status}`,
        });
        this.status = status;
        this.dispatchEvent(new Event(EventTypeServiceWorkerRegistrationStatusChanged));
    }

    public register_service_worker = async (): Promise<void> => {
        if (this.status.status !== 'available') return;
        if (ServiceWorkerService.should_skip_registration) return;
        try {
            const registration = await navigator.serviceWorker.register(`/service-worker.js`, { scope: '/' });
            this.set_status({ status: 'registered', registration });
        } catch (error) {
            this.set_status({ status: 'failed', error });
        }
    }

    public skip_waiting = async (): Promise<void> => {
        if (this.status.status !== 'registered')
            throw new Error("service worker not registered");
        const registration = this.status.registration;
        const waiting = registration.waiting;
        if (waiting === null)
            throw new Error('Service worker is not waiting');
        waiting.addEventListener('statechange', (event) => {
            const state = (event.target as ServiceWorker).state;
            if (state === 'activated') {
                window.location.reload();
            }
        });
        waiting.postMessage({ type: 'SKIP_WAITING' });
    }
}

export default ServiceWorkerService;
