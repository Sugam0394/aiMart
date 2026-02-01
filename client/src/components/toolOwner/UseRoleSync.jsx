import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { syncUserRole } from "../../app/features/AuthSlice";
 

function UseRoleSync() {

 const dispatch = useDispatch();
  const { user, role } = useSelector(state => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(syncUserRole()); // fetch latest role from backend
    }
  }, [dispatch, user]);

  return role;
}

export default UseRoleSync