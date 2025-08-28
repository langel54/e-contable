import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/provider";

const AuthGuard = ({ children, allowedRoles }) => {
  const { userType } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // if (!loading && !userType) {
    //   router.push("/login");
    // }

    if (userType && allowedRoles && !allowedRoles.includes(userType)) {
      router.push("/unauthorized");
    }
  }, [userType, router, allowedRoles]);

  return children;
};

export default AuthGuard;
