import { HTMLInputTypeAttribute } from 'react'
import { UseFormRegister, FieldError } from 'react-hook-form'

interface FormFieldProps {
  label: string
  name: string
  type?: HTMLInputTypeAttribute
  placeholder?: string
  register: UseFormRegister<any>
  error?: FieldError
  className?: string
}

export function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  register,
  error,
  className = '',
}: FormFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium mb-2">
        {label}
      </label>
      <input
        type={type}
        id={name}
        placeholder={placeholder}
        {...register(name)}
        className={`w-full px-3 py-2 border rounded-md bg-background ${
          error
            ? 'border-destructive focus:ring-destructive'
            : 'border-input focus:ring-primary'
        } focus:outline-none focus:ring-2 focus:ring-offset-1`}
      />
      {error && (
        <p className="mt-1 text-sm text-destructive">{error.message}</p>
      )}
    </div>
  )
} 