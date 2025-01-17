import CardWrapper from "./CardWrapper";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";


const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops Something went wrong!"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
        <div className="w-full items-center flex justify-center">
            <ExclamationTriangleIcon className="text-destructive"/>
        </div>
    </CardWrapper>
  )
}

export default ErrorCard