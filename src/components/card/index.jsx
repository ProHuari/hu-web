
import './style.css';

export default function Card({
    title,
    value,
    description,
    icon: Icon,
}) {
    return (
        <article className="card">
            <div className="card-icon">
                {Icon && <Icon aria-hidden="true" />}
            </div>

            <div className="card-content">
                <h2 className="text-p-regular">
                    {title}
                </h2>

                <p className="card-value">
                    {value}
                </p>

                <p className="card-description">
                    {description}
                </p>
            </div>
        </article>
    );
}
