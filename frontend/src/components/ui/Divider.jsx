import './Divider.css';

/**
 * Thin editorial divider
 * Avoid cards, shadows, pills - use dividers for separation
 */
function Divider({ thin = false, className = '' }) {
    return (
        <hr className={`divider ${thin ? 'divider--thin' : ''} ${className}`} />
    );
}

export default Divider;
