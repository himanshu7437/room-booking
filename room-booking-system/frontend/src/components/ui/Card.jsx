import { forwardRef } from "react";

const Card = forwardRef(({ className = "", children, ...props }, ref) => (
  <div
    ref={ref}
    className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}
    {...props}
  >
    {children}
  </div>
));

Card.displayName = "Card";

export const CardHeader = ({ className = "", children, ...props }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody = ({ className = "", children, ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className = "", children, ...props }) => (
  <div
    className={`px-6 py-4 border-t border-gray-200 flex justify-end gap-2 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
