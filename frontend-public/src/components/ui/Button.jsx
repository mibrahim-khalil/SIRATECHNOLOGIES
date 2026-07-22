export default function Button({ variant = "primary", as = "button", className = "", ...props }) {
  const Comp = as;
  const v = variant === "secondary" ? "btn-secondary" : "btn-primary";
  return <Comp className={`btn ${v} ${className}`} {...props} />;
}