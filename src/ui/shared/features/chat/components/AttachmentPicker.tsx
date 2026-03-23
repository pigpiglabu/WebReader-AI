import type { ChangeEvent } from 'react';
import type { Attachment } from '../../../../../shared/types';

interface AttachmentPickerProps {
  onPick: (attachments: Attachment[]) => void;
}

const toDataUrl = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result ?? ''));
  reader.onerror = () => reject(new Error(`Unable to read ${file.name}`));
  reader.readAsDataURL(file);
});

export function AttachmentPicker({ onPick }: AttachmentPickerProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    Promise.all(files.map(async (file) => ({
      type: file.type.includes('pdf') ? 'pdf_converted_image' : file.type.startsWith('image/') ? 'image' : 'file',
      name: file.name,
      dataUrl: await toDataUrl(file)
    } as Attachment))).then(onPick);
  };

  return <input type="file" multiple accept="image/*,.pdf" onChange={handleChange} />;
}
