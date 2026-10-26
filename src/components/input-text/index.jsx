import './style.css';

export default function InputText({
  label,
  labelAction,
  type = "text",
  iconLeft,
  iconRight,
  identifier = "",
  ...props
}) {
  return (
    <div className="input-container-group">

      {(label || labelAction) && (
        <div className="input-header-wrapper">
          {label && (
            <label className="input-label text-h3-regular">
              {label}
            </label>
          )}

          {labelAction && (
            <div className="input-label-action text-p-small-regular">
              {labelAction}
            </div>
          )}
        </div>
      )}

      <div className={`input-wrapper-field ${identifier}`}>
        {iconLeft && (
          <span className="input-icon-left">
            {iconLeft}
          </span>
        )}

        <input
          type={type}
          className={`input-field text-p-regular ${
            iconLeft ? "has-icon-left" : ""
          } ${iconRight ? "has-icon-right" : ""}`}
          {...props}
        />

        {iconRight && (
          <span className="input-icon-right">
            {iconRight}
          </span>
        )}
      </div>
    </div>
  );
}
