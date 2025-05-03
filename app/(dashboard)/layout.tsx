import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid lg:grid-cols-5 ">
      {/* Sidebar hides on the small screen*/}
      <div className="hidden lg:block lg:col-span-1 lg:min-h-screen">
        <Sidebar />
      </div>
      {/* second column hides on on the big screen*/}
      <div className="lg:col-span-4">
        <Navbar />
        <div className="py-16 px-4 sm:px-8 lg:px-16">{children}</div>
      </div>
    </main>
  );
}

export default layout;
