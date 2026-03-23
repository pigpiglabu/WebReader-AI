import { useState } from 'react';
import type { Attachment } from '../../../../../shared/types';
import { Button } from '../../../components/atoms/Button';
import { TextArea } from '../../../components/atoms/Input';
import { AttachmentPicker } from './AttachmentPicker';

interface ChatInputProps {
  onSend: (content: string, attachments: Attachment[]) => Promise<void>;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  return (
    <div className="wr-panel wr-grid">
      <TextArea placeholder="询问当前网页内容..." value={content} onChange={(event: { target: { value: string } }) => setContent(event.target.value)} />
      <AttachmentPicker onPick={setAttachments} />
      <Button disabled={disabled || !content.trim()} onClick={async () => {
        await onSend(content, attachments);
        setContent('');
        setAttachments([]);
      }}>发送</Button>
    </div>
  );
}
