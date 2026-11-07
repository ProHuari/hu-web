import "./style.css";

export default function Button({
    title,
    icon,
    iconPosition = "right",
    identifier = "",
    active = false,
    ...props
}) {
    return (
        <button
            className={`btn text-btn-semibold ${identifier} ${
                active ? "btn-active" : ""
            }`}
            aria-pressed={active}
            {...props}
        >
            {icon && iconPosition === "left" && (
                <span className="btn-icon">{icon}</span>
            )}

            {title}

            {icon && iconPosition === "right" && (
                <span className="btn-icon">{icon}</span>
            )}
        </button>
    );
}
