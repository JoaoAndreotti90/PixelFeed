import "./Message.css";
import {
  BsCheckCircle,
  BsXCircle,
  BsInfoCircle,
  BsExclamationTriangle,
} from "react-icons/bs";

const iconMap = {
  success: <BsCheckCircle className="message-icon" />,
  error: <BsXCircle className="message-icon" />,
  warning: <BsExclamationTriangle className="message-icon" />,
  info: <BsInfoCircle className="message-icon" />,
};

const Message = ({ msg, type = "info" }) => {
  const icon = iconMap[type] || iconMap.info;

  return (
    <div className={`message ${type}`}>
      {icon}
      <p>{msg}</p>
    </div>
  );
};

export default Message;