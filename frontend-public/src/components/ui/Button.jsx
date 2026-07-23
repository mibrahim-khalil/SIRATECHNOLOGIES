export default function Button({
  variant = "primary",
  as = "button",
  className = "",
  ...props
}) {
  const Comp = as;

  const map = {
    primary: "btn btn-primary",
    secondary: "btn btn-secondary",
    outlineOnImage: "btn btn-outline-on-image"
  };

  const cls = map[variant] || map.primary;

  return <Comp className={`${cls} ${className}`} {...props} />;
}