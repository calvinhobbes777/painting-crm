export default ({ access, children, role }) => {
  if (access && !role) {
    return null;
  } else if (access && role) {
    return access.find(_role => _role === role) ? children : null;
  } else {
    return children;
  }
};
