import Image from 'next/image';
import React from 'react';
import { AppModal } from '../Modal';

type prop = {
  open: boolean;
  handleClose?: () => void;
  url?: string;
};
export default function ImageModal({ open, handleClose, url }: prop) {
  return (
    <AppModal open={open} onClose={() => {}}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '500px',
          minWidth: '300px',
          display: 'block',
          overflow: 'auto',
        }}
      >
        <Image src={url ? url : ''} alt="image" />
      </div>
    </AppModal>
  );
}
