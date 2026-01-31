export default function Button({ children, variant = 'primary', className = '', onClick, ...props }) {
    const variants = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        ghost: 'btn-ghost',
    }

    return (
        <button
            className={`btn ${variants[variant]} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    )
}
