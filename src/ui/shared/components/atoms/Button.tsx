import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: 'primary' | 'secondary' | 'danger';
}

export function Button({ children, tone = 'primary', ...props }: PropsWithChildren<ButtonProps>) {
  return (
    <button
      {...props}
      className={`wr-button wr-button--${tone} ${props.className ?? ''}`.trim()}
    >
      {children}
    </button>
  );
}
