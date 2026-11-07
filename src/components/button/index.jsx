import React from "react";
import PropTypes from "prop-types";
import "./style.css";

export default function Button({
    title,
    children,
    icon,
    iconPosition = "right",
    identifier = "",
    variant = "primary",
    active = false,
    className = "",
    type = "button",
    disabled = false,
    ...props
}) {
    const content = children || title;

    return (
        <button
            type={type}
            disabled={disabled}
            className={`btn text-btn-semibold btn-${variant} ${identifier} ${className} ${
                active ? "btn-active" : ""
            }`.trim()}
            aria-pressed={active}
            {...props}
        >
            {icon && iconPosition === "left" && (
                <span className="btn-icon btn-icon-left" aria-hidden="true">
                    {icon}
                </span>
            )}

            {content && <span className="btn-label">{content}</span>}

            {icon && iconPosition === "right" && (
                <span className="btn-icon btn-icon-right" aria-hidden="true">
                    {icon}
                </span>
            )}
        </button>
    );
}

Button.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node,
    icon: PropTypes.node,
    iconPosition: PropTypes.oneOf(["left", "right"]),
    identifier: PropTypes.string,
    variant: PropTypes.oneOf(["primary", "secondary", "outline", "ghost", "visitor", "danger"]),
    active: PropTypes.bool,
    className: PropTypes.string,
    type: PropTypes.string,
    disabled: PropTypes.bool,
};
