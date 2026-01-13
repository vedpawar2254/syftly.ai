import './Typography.css';

/**
 * Typography components following style_guide.md
 * Primary serif for headlines, sans for body
 */

/**
 * Headline - Large serif, newspaper style
 * @param {1|2|3|4|5|6} level - Heading level
 * @param {string} className - Additional classes
 */
export function Headline({ level = 1, children, className = '' }) {
    const Tag = `h${level}`;
    return <Tag className={`headline headline--${level} ${className}`}>{children}</Tag>;
}

/**
 * Body text - Sans serif, readable
 */
export function Body({ children, className = '' }) {
    return <p className={`body ${className}`}>{children}</p>;
}

/**
 * Caption - Small meta text
 */
export function Caption({ children, className = '' }) {
    return <span className={`caption ${className}`}>{children}</span>;
}

/**
 * Label - Uppercase small text
 */
export function Label({ children, className = '' }) {
    return <span className={`label ${className}`}>{children}</span>;
}

export default { Headline, Body, Caption, Label };
