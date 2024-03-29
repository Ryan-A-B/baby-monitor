import React from 'react';
import { MediaDevicePermissionStatus, EventTypeMediaDevicePermissionStatusChanged } from '../services/MediaDevicePermissionService';
import { useMediaDevicePermissionService } from '../services';

const useMediaDevicesPermissionStatus = (): MediaDevicePermissionStatus => {
    const media_device_permission_service = useMediaDevicePermissionService();
    const [permission_status, set_permission_status] = React.useState<MediaDevicePermissionStatus>(media_device_permission_service.get_status);
    React.useEffect(() => {
        const handle_permission_status_changed = () => {
            set_permission_status(media_device_permission_service.get_status());
        };
        media_device_permission_service.addEventListener(EventTypeMediaDevicePermissionStatusChanged, handle_permission_status_changed);
        return () => {
            media_device_permission_service.removeEventListener(EventTypeMediaDevicePermissionStatusChanged, handle_permission_status_changed);
        }
    }, [media_device_permission_service]);
    return permission_status
}

export default useMediaDevicesPermissionStatus;
