export default function Badge({ children, variant = 'success', className = '', ...props }) {
    const variants = {
        success: 'badge-success',
        popular: 'badge-popular',
    }

    return (
        <span className={`badge ${variants[variant]} ${className}`} {...props}>
            {children}
        </span>
    )
}
