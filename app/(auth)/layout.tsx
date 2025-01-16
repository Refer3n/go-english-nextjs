import { ReactNode } from 'react'

const layout = ( { children }: {children: ReactNode}) => {
  return (
    <main className="auth-container">
        <section className="auth-form">
            <div>{children}</div>
        </section>
    </main>
  )
}

export default layout