import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';
import { Code } from 'react-native-vision-camera';

import CameraModal from '@src/widgets/modals/CameraModal';

type CameraCallbacks = {
  onPhotoTaken?: (uri: string) => void;
  onVideoRecorded?: (uri: string) => void;
  onQrCodeScan?: (code: Code) => void;
};

type TCameraProvider = {
  closeCamera: () => void;
  isVisible: boolean;
  openCamera: (options?: CameraCallbacks) => void;
};

const CameraContext = createContext<TCameraProvider | undefined>(undefined);

export const useCameraModal = (): TCameraProvider => {
  const context = useContext(CameraContext);
  if (!context) {
    throw new Error('useCameraModal must be used within CameraProvider');
  }
  return context;
};

export const CameraProvider = ({ children }: PropsWithChildren) => {
  const [isVisible, setIsVisible] = useState(false);
  const [callbacks, setCallbacks] = useState<CameraCallbacks>({});

  const _openCamera = useCallback((options: CameraCallbacks = {}) => {
    setCallbacks({
      onPhotoTaken: options.onPhotoTaken,
      onQrCodeScan: options.onQrCodeScan,
      onVideoRecorded: options.onVideoRecorded,
    });
    setIsVisible(true);
  }, []);

  const _closeCamera = useCallback(() => {
    setIsVisible(false);
    setCallbacks({});
  }, []);

  const _handleScanQr = useCallback(
    (code: Code) => {
      if (callbacks.onQrCodeScan) {
        callbacks.onQrCodeScan(code);
      }
      _closeCamera();
    },
    [callbacks, _closeCamera]
  );

  const value: TCameraProvider = {
    closeCamera: _closeCamera,
    isVisible,
    openCamera: _openCamera,
  };

  return (
    <CameraContext.Provider value={value}>
      {children}
      <CameraModal
        visible={isVisible}
        onClose={_closeCamera}
        onScan={_handleScanQr}
      />
    </CameraContext.Provider>
  );
};
