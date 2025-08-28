import { 
  UseFormRegister, 
  FieldValues, 
  Path, 
  RegisterOptions 
} from 'react-hook-form';
import React from 'react';

interface Props<TFieldValues extends FieldValues> {
  id: Path<TFieldValues>;
  label: string;
  type?: string;
  register: UseFormRegister<TFieldValues>;
  options?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  required?: boolean;
  className?: string;
}

export default function FormInput<TFieldValues extends FieldValues = FieldValues>({
  id,
  label,
  type = 'text',
  register,
  options,
  required = false,
  className = '',
}: Props<TFieldValues>) {
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={String(id)} className="block mb-1 font-medium">
        {label}
      </label>
      <input
        id={String(id)}
        type={type}
        {...register(id, { required, ...options })}
        className="border p-2 w-full"
      />
    </div>
  );
}
