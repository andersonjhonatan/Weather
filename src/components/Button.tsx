import { ReactNode, ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

export const Button = ({ children, ...props }: ButtonProps) => {
  return <button {...props}>{children}</button>
}
