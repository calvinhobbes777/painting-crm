import { Modal } from "antd";
import { withRouter } from "react-router-dom";
const { confirm } = Modal;

const Logout = props => {
  confirm({
    title: "Logout",
    iconType: "logout",
    content: "Are you sure you want to logout?",
    maskClosable: true,
    onCancel: () => props.history.replace("/account"),
    onOk: () => !localStorage.removeItem("token") && window.location.reload()
  });

  return null;
};

export default withRouter(Logout);
