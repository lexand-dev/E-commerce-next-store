import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";

const SignOutPage = () => {
  return (
    <Button variant="secondary" >
      <SignOutButton />
    </Button>
  )
};

export default SignOutPage;
