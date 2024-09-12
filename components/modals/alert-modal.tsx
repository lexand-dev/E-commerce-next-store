"use client";
import { useEffect, useState } from "react";

import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";

interface AlertModalProps {
  onClose: () => void;
  onConfirm: () => void;
  isOpen: boolean;
  loading: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  onClose,
  onConfirm,
  isOpen,
  loading,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Are you sure?"
      description="This action cannot be undone."
      onClose={onClose}
      isOpen={isOpen}
    >
      <div className="pt-6 space-x-6 flex items-center justify-end w-full">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          Continue
        </Button>
      </div>
    </Modal>
  );
};
