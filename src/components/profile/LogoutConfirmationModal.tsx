"use client";

import { Button } from "@/components/ui/button";

type LogoutConfirmationModalProps = {
  open: boolean;
  isLoggingOut: boolean;
  error: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function LogoutConfirmationModal({
  open,
  isLoggingOut,
  error,
  onClose,
  onConfirm,
}: LogoutConfirmationModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-container-margin">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
        onClick={() => !isLoggingOut && onClose()}
      />
      <div className="glass-card relative z-10 w-full max-w-sm rounded-2xl border border-primary/20 p-8">
        <h4 className="mb-2 text-center font-headline text-headline-md font-semibold">
          Logout?
        </h4>
        <p className="mb-8 text-center font-body text-body-lg text-on-surface-variant">
          Are you sure you want to logout from Numo AI?
        </p>
        {error && <p className="mb-4 text-center text-sm text-error">{error}</p>}
        <div className="flex flex-col gap-3">
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoggingOut}
            variant="destructive"
            size="lg"
            className="h-12 w-full rounded-xl font-headline font-semibold disabled:cursor-not-allowed"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
          <Button
            type="button"
            onClick={onClose}
            disabled={isLoggingOut}
            variant="outline"
            size="lg"
            className="h-12 w-full rounded-xl font-headline font-semibold disabled:cursor-not-allowed"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
