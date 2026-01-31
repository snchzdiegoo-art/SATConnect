export default function Card({ children, className = '', hover = false, ...props }) {
    return (
        <div
            className={`glass-card p-8 ${hover ? 'hover-lift hover-glow' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    )
}
