// src/components/ui/Modal.tsx
import React from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    // The overlay div now has an onClick handler to close the modal
    // when clicking the background.
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      {/* This prevents clicks inside the modal from closing it */}
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}