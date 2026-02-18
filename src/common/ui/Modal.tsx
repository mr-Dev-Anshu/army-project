"use client";

import { FiX } from "react-icons/fi";
import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
  disableBackdropClose?: boolean;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = "",
  maxWidth = "lg",
  showCloseButton = true,
  disableBackdropClose = false,
}: ModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close when clicking the backdrop itself, not bubbled events
    if (e.target === e.currentTarget && !disableBackdropClose) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full ${maxWidthClasses[maxWidth]} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-gray-100 transition"
                aria-label="Close modal"
              >
                <FiX size={22} />
              </button>
            )}
          </div>
        )}

        <div className="p-6">{children}</div>
      </div>
    </div>
  );

  // Use portal to render modal at document.body level to avoid z-index issues
  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
}