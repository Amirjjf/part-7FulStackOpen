import { useState, forwardRef, useImperativeHandle } from "react";
import { Button, Collapse } from "react-bootstrap";

// eslint-disable-next-line react/prop-types
const Togglable = forwardRef(({ children, buttonLabel }, ref) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div>
      {!visible && (
        <Button 
          variant="success" 
          onClick={toggleVisibility}
          className="mb-3"
        >
          {buttonLabel}
        </Button>
      )}
      
      <Collapse in={visible}>
        <div>{children}</div>
      </Collapse>
    </div>
  );
});

Togglable.displayName = "Togglable";
export default Togglable;
