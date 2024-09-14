import Navbar from "../_component/Navbar";

//18.5:create a layout in the protected folder
interface ProtectedLayoutProps {
    children: React.ReactNode;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="items-center justify-center w-full flex flex-col mt-10 gap-4">
      <Navbar />
      <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center">
        { children }

      </div>
    </div>
  )
}

export default ProtectedLayout