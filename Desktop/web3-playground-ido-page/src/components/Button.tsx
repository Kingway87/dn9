import React, { ReactElement } from 'react'
import styles from './Button.module.css'

export default function Button({ children, ...props }: any): ReactElement {
  return (
    <button
      {...props}
      className={`${styles.customButton} ${props.className}`}
      onClick={props?.onClick}
    >
      {children}
    </button>
  )
}
