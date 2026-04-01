import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

interface TessorFileUploadProps {
  label: string;
  accept: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hideIcon?: boolean;
}

export function TessorFileUpload({ label, accept, onChange, hideIcon = false }: TessorFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onChange}
        className="hidden"
      />
      <button
        onClick={handleClick}
        className="w-full transition-colors flex items-center justify-center"
        style={{ height: 'var(--t-control-h-lg)', borderRadius: 'var(--t-radius-md)', background: 'var(--t-surface-3)', color: 'var(--t-text)', fontSize: 'var(--t-font-xs)', fontWeight: 'var(--t-font-weight)', gap: 'var(--t-space-2)' }}
      >
        {!hideIcon && <Upload style={{ width: 'var(--t-icon-sm)', height: 'var(--t-icon-sm)' }} strokeWidth={2} />}
        {label}
      </button>
    </div>
  );
}
