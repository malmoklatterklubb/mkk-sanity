import React from 'react'

export const Box = ({children}: {children?: React.ReactNode}) => <div>{children}</div>

export const Button = ({
  onClick,
  text,
  disabled,
}: {
  onClick?: () => void
  text?: string
  disabled?: boolean
}) => (
  <button type="button" onClick={onClick} disabled={disabled}>
    {text}
  </button>
)

export const Flex = ({children}: {children?: React.ReactNode}) => <div>{children}</div>

export const Stack = ({children}: {children?: React.ReactNode}) => <div>{children}</div>

export const Text = ({children}: {children?: React.ReactNode}) => <span>{children}</span>

export const TextInput = ({
  value,
  onChange,
  placeholder,
  readOnly,
  id,
}: {
  value?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  placeholder?: string
  readOnly?: boolean
  id?: string
}) => (
  <input
    id={id}
    value={value ?? ''}
    onChange={onChange}
    placeholder={placeholder}
    readOnly={readOnly ?? false}
  />
)
